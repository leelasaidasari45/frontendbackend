import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkComplaints() {
  const { data, error } = await supabase.from('complaints').select('*');
  console.log("All complaints:", data);
  if (error) console.error(error);
}

checkComplaints();
