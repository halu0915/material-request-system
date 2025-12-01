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

    // Companies table
    await query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        tax_id VARCHAR(50),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, name)
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(construction_category_id, material_category_id, name)
      )
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

    // Material requests table
    await query(`
      CREATE TABLE IF NOT EXISTS material_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        company_id INTEGER REFERENCES companies(id),
        request_number VARCHAR(100) UNIQUE NOT NULL,
        construction_category_id INTEGER REFERENCES construction_categories(id),
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
    
    // Add company_id column if it doesn't exist (for existing databases)
    await query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'material_requests' AND column_name = 'company_id'
        ) THEN
          ALTER TABLE material_requests ADD COLUMN company_id INTEGER REFERENCES companies(id);
        END IF;
      END $$;
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
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

    // Addresses table
    await query(`
      CREATE TABLE IF NOT EXISTS addresses (
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

    // Create indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_material_requests_user_id ON material_requests(user_id);
      CREATE INDEX IF NOT EXISTS idx_material_requests_number ON material_requests(request_number);
      CREATE INDEX IF NOT EXISTS idx_material_requests_company_id ON material_requests(company_id);
      CREATE INDEX IF NOT EXISTS idx_material_request_items_request_id ON material_request_items(request_id);
      CREATE INDEX IF NOT EXISTS idx_materials_categories ON materials(construction_category_id, material_category_id);
      CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
      CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
    `);

    console.log('資料表建立完成');
  } catch (error) {
    console.error('建立資料表時發生錯誤:', error);
    throw error;
  }
};

