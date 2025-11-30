-- Script to remove all unique constraints from materials table
-- Run this manually if migrations don't work

-- Drop all unique constraints on materials table
DO $$ 
DECLARE
    constraint_record RECORD;
BEGIN
    -- Find all unique constraints on materials table
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
END $$;

-- Drop all unique indexes on materials table
DO $$ 
DECLARE
    index_record RECORD;
BEGIN
    -- Find all unique indexes on materials table
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

