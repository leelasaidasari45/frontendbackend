import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkSchema() {
  const { data, error } = await supabase.from('complaints').select('*').limit(1);
  console.log("Data:", data);
  console.log("Error:", error);
}

checkSchema();
