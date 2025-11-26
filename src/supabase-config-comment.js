import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase not configured. Using mock client.");
  // Create a mock client that mimics the Supabase API
  const createMockQuery = () => ({
    select: () => createMockQuery(),
    insert: () => createMockQuery(),
    update: () => createMockQuery(),
    delete: () => createMockQuery(),
    eq: () => createMockQuery(),
    order: () => createMockQuery(),
    limit: () => createMockQuery(),
    then: (resolve) => resolve({ data: [], error: null }),
  });

  supabase = {
    from: () => createMockQuery(),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    channel: () => ({
      on: () => ({
        subscribe: () => ({
          unsubscribe: () => {},
        }),
      }),
    }),
  };
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };