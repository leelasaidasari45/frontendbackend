import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testInsert() {
  const { data, error } = await supabase.from('complaints').insert([{
    tenant_id: '15d3151b-5e43-4fa8-b1fc-e5cff492aeb6', // Just a fake uuid
    hostel_id: 'e6981e4b-9721-4f1d-b873-1f1f2e46b6a6', // fake uuid
    title: 'Complaint',
    description: 'This is a test issue',
    status: 'open'
  }]);
  
  console.log("Insert result:");
  console.log("Data:", data);
  console.log("Error:", error);
}

testInsert();
