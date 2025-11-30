-- Script to remove all unique constraints from materials table (except PRIMARY KEY)
-- Run this manually if migrations don't work

-- Drop all unique constraints on materials table (excluding PRIMARY KEY)
DO $$ 
DECLARE
    constraint_record RECORD;
BEGIN
    -- Find all unique constraints on materials table (excluding PRIMARY KEY)
    FOR constraint_record IN 
        SELECT conname
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'materials'
        AND c.contype = 'u'
        AND conname NOT LIKE '%_pkey'
    LOOP
        EXECUTE 'ALTER TABLE materials DROP CONSTRAINT IF EXISTS ' || constraint_record.conname;
        RAISE NOTICE 'Dropped constraint: %', constraint_record.conname;
    END LOOP;
END $$;

-- Drop all unique indexes on materials table (excluding PRIMARY KEY indexes)
DO $$ 
DECLARE
    index_record RECORD;
BEGIN
    -- Find all unique indexes on materials table (excluding PRIMARY KEY indexes)
    FOR index_record IN 
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = 'materials'
        AND indexdef LIKE '%UNIQUE%'
        AND indexname NOT LIKE '%_pkey'
    LOOP
        EXECUTE 'DROP INDEX IF EXISTS ' || index_record.indexname;
        RAISE NOTICE 'Dropped index: %', index_record.indexname;
    END LOOP;
END $$;

