GRANT USAGE ON SCHEMA formulaire TO "apps";
ALTER DEFAULT PRIVILEGES IN SCHEMA formulaire GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON TABLES TO "apps";
ALTER DEFAULT PRIVILEGES IN SCHEMA formulaire GRANT EXECUTE ON FUNCTIONS TO "apps";
ALTER DEFAULT PRIVILEGES IN SCHEMA formulaire GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO "apps";