import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://mtdlluecnaaausijdnzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZGxsdWVjbmFhYXVzaWpkbnp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNDM0NTIsImV4cCI6MjEwODcxOTQ1Mn0.veHiexZ7SohAPr7wKk0cS8w0ix7iHH3_Zhrq6z684-g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);