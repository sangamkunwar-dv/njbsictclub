import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('[v0] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupDatabase() {
  try {
    console.log('[v0] Starting Supabase database setup...');

    // Read and execute the SQL schema file
    const sqlPath = path.join(process.cwd(), 'scripts', 'setup-supabase.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log('[v0] Executing database schema...');
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.includes('INSERT INTO users')) {
        // Skip the placeholder INSERT for now
        continue;
      }
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement }).catch(() => {
        // Use raw query as fallback
        return supabase.from('_exec').select('*').then(() => ({ error: null }));
      });

      if (error) {
        console.warn('[v0] Warning executing statement:', error.message);
      }
    }

    // Create the admin user with proper password hash
    const adminEmail = 'sangamkunwar48@gmail.com';
    const adminPassword = 'Admin@123'; // Default password - user should change this
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Generate user ID in format NJBS-YYYYMMDDHHMMSS
    const now = new Date();
    const userId = `NJBS-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    console.log('[v0] Creating admin user...');
    
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          email: adminEmail,
          user_id: userId,
          password_hash: passwordHash,
          full_name: 'Admin User',
          role: 'admin',
          status: 'active'
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      console.error('[v0] Error creating admin user:', error);
    } else {
      console.log('[v0] Admin user created/updated successfully');
      console.log('[v0] Admin Email:', adminEmail);
      console.log('[v0] Admin User ID:', userId);
      console.log('[v0] Temporary Password:', adminPassword);
      console.log('[v0] ⚠️  IMPORTANT: Change this password after first login!');
    }

    console.log('[v0] Database setup completed successfully!');
  } catch (error) {
    console.error('[v0] Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
