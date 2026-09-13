import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nyurdlvtuxupwhihydmm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55dXJkbHZ0dXh1cHdoaWh5ZG1tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODE4OTQ0NCwiZXhwIjoyMTAzNzY1NDQ0fQ.ICrap-oydSNG31gE4BVfWkqXILxL38g_7UcjNDjG99Y'
);

async function test() {
  const { data, error } = await supabase.from('products').select('*');
  console.log('Error:', error);
  console.log('Data:', data);
}
test();
