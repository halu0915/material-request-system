import { query } from './connection';

export const createTables = async (): Promise<void> => {
  try {
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        name VARCHAR(255),
        provider VARCHAR(50) DEFAULT 'local',
        provider_id VARCHAR(255),
        avatar_url VARCHAR(500),
        is_trial BOOLEAN DEFAULT false,
        trial_expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Construction categories table
    await query(`
      CREATE TABLE IF NOT EXISTS construction_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Material categories table
    await query(`
      CREATE TABLE IF NOT EXISTS material_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Materials table
    await query(`
      CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        construction_category_id INTEGER REFERENCES construction_categories(id),
        material_category_id INTEGER REFERENCES material_categories(id),
        name VARCHAR(255) NOT NULL,
        specification VARCHAR(255),
        unit VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Drop the old unique constraint that doesn't include specification
    await query(`
      DO $$ 
      BEGIN
        -- Drop the unique constraint on (construction_category_id, material_category_id, name)
        IF EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'materials_construction_category_id_material_category_id_name_key'
        ) THEN
          ALTER TABLE materials DROP CONSTRAINT materials_construction_category_id_material_category_id_name_key;
        END IF;
        
        -- Also try to drop by checking the constraint definition
        IF EXISTS (
          SELECT 1 FROM pg_constraint c
          JOIN pg_class t ON c.conrelid = t.oid
          WHERE t.relname = 'materials'
          AND c.contype = 'u'
          AND array_length(c.conkey, 1) = 3
        ) THEN
          -- Find and drop the constraint
          DECLARE
            constraint_name TEXT;
          BEGIN
            SELECT conname INTO constraint_name
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'materials'
            AND c.contype = 'u'
            AND array_length(c.conkey, 1) = 3
            LIMIT 1;
            
            IF constraint_name IS NOT NULL THEN
              EXECUTE 'ALTER TABLE materials DROP CONSTRAINT IF EXISTS ' || constraint_name;
            END IF;
          END;
        END IF;
      END $$;
    `);
    
    // Add specification column if it doesn't exist (for existing databases)
    await query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'materials' AND column_name = 'specification'
        ) THEN
          ALTER TABLE materials ADD COLUMN specification VARCHAR(255);
        END IF;
      END $$;
    `);
    
    // Drop ALL unique constraints and indexes on materials table
    // This allows creating multiple materials with same category, name, and specification
    await query(`
      DO $$ 
      DECLARE
        constraint_record RECORD;
        index_record RECORD;
      BEGIN
        -- Drop all unique constraints on materials table
        FOR constraint_record IN 
          SELECT conname
          FROM pg_constraint c
          JOIN pg_class t ON c.conrelid = t.oid
          WHERE t.relname = 'materials'
          AND c.contype = 'u'
        LOOP
          EXECUTE 'ALTER TABLE materials DROP CONSTRAINT IF EXISTS ' || constraint_record.conname;
          RAISE NOTICE 'Dropped constraint: %', constraint_record.conname;
        END LOOP;
        
        -- Drop all unique indexes on materials table
        FOR index_record IN 
          SELECT indexname
          FROM pg_indexes
          WHERE tablename = 'materials'
          AND indexdef LIKE '%UNIQUE%'
        LOOP
          EXECUTE 'DROP INDEX IF EXISTS ' || index_record.indexname;
          RAISE NOTICE 'Dropped index: %', index_record.indexname;
        END LOOP;
      END $$;
    `);

    // Delivery addresses table (create before material_requests to avoid foreign key issues)
    await query(`
      CREATE TABLE IF NOT EXISTS delivery_addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        contact_person VARCHAR(255),
        contact_phone VARCHAR(50),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create index for delivery addresses
    await query(`
      CREATE INDEX IF NOT EXISTS idx_delivery_addresses_user_id ON delivery_addresses(user_id);
    `);

    // Material requests table
    await query(`
      CREATE TABLE IF NOT EXISTS material_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        request_number VARCHAR(100) UNIQUE NOT NULL,
        construction_category_id INTEGER REFERENCES construction_categories(id),
        work_area VARCHAR(255),
        applicant_name VARCHAR(255),
        contact_phone VARCHAR(50),
        delivery_address_id INTEGER REFERENCES delivery_addresses(id),
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        excel_file_url VARCHAR(500),
        cloud_file_id VARCHAR(255),
        email_sent BOOLEAN DEFAULT false,
        line_notified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add work_area column if it doesn't exist (for existing databases)
    await query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'material_requests' AND column_name = 'work_area'
        ) THEN
          ALTER TABLE material_requests ADD COLUMN work_area VARCHAR(255);
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'material_requests' AND column_name = 'applicant_name'
        ) THEN
          ALTER TABLE material_requests ADD COLUMN applicant_name VARCHAR(255);
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'material_requests' AND column_name = 'contact_phone'
        ) THEN
          ALTER TABLE material_requests ADD COLUMN contact_phone VARCHAR(50);
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'material_requests' AND column_name = 'delivery_address_id'
        ) THEN
          ALTER TABLE material_requests ADD COLUMN delivery_address_id INTEGER REFERENCES delivery_addresses(id);
        END IF;
      END $$;
    `);
    
    // Delivery addresses table
    await query(`
      CREATE TABLE IF NOT EXISTS delivery_addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        contact_person VARCHAR(255),
        contact_phone VARCHAR(50),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create index for delivery addresses
    await query(`
      CREATE INDEX IF NOT EXISTS idx_delivery_addresses_user_id ON delivery_addresses(user_id);
    `);

    // Material request items table
    await query(`
      CREATE TABLE IF NOT EXISTS material_request_items (
        id SERIAL PRIMARY KEY,
        request_id INTEGER REFERENCES material_requests(id) ON DELETE CASCADE,
        material_id INTEGER REFERENCES materials(id),
        quantity DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(50),
        notes TEXT,
        image_url VARCHAR(500),
        link_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add image_url and link_url columns if they don't exist (for existing databases)
    await query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'material_request_items' AND column_name = 'image_url'
        ) THEN
          ALTER TABLE material_request_items ADD COLUMN image_url VARCHAR(500);
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'material_request_items' AND column_name = 'link_url'
        ) THEN
          ALTER TABLE material_request_items ADD COLUMN link_url VARCHAR(500);
        END IF;
      END $$;
    `);

    // User LINE tokens (for notifications)
    await query(`
      CREATE TABLE IF NOT EXISTS user_line_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        access_token VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_material_requests_user_id ON material_requests(user_id);
      CREATE INDEX IF NOT EXISTS idx_material_requests_number ON material_requests(request_number);
      CREATE INDEX IF NOT EXISTS idx_material_request_items_request_id ON material_request_items(request_id);
      CREATE INDEX IF NOT EXISTS idx_materials_categories ON materials(construction_category_id, material_category_id);
    `);

    console.log('資料表建立完成');
  } catch (error) {
    console.error('建立資料表時發生錯誤:', error);
    throw error;
  }
};

