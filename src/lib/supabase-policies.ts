import { supabase } from './supabase'

export async function setupPatientPolicies() {
  try {
    // Drop existing policies
    await supabase.rpc('drop_policy_if_exists', {
      table_name: 'patients',
      policy_name: 'Enable read access for authenticated users'
    })
    await supabase.rpc('drop_policy_if_exists', {
      table_name: 'patients',
      policy_name: 'Enable insert for authenticated users'
    })
    await supabase.rpc('drop_policy_if_exists', {
      table_name: 'patients',
      policy_name: 'Enable update for authenticated users'
    })
    await supabase.rpc('drop_policy_if_exists', {
      table_name: 'patients',
      policy_name: 'Enable delete for authenticated users'
    })

    // Create new policies
    await supabase.rpc('create_policy', {
      table_name: 'patients',
      policy_name: 'Enable read access for authenticated users',
      using: 'auth.uid() = account_id',
      check: null,
      command: 'SELECT'
    })

    await supabase.rpc('create_policy', {
      table_name: 'patients',
      policy_name: 'Enable insert for authenticated users',
      using: null,
      check: 'auth.uid() = account_id',
      command: 'INSERT'
    })

    await supabase.rpc('create_policy', {
      table_name: 'patients',
      policy_name: 'Enable update for authenticated users',
      using: 'auth.uid() = account_id',
      check: 'auth.uid() = account_id',
      command: 'UPDATE'
    })

    await supabase.rpc('create_policy', {
      table_name: 'patients',
      policy_name: 'Enable delete for authenticated users',
      using: 'auth.uid() = account_id',
      check: null,
      command: 'DELETE'
    })

    console.log('Patient policies updated successfully')
  } catch (error) {
    console.error('Error setting up patient policies:', error)
    throw error
  }
}

// Function to check if a policy exists
export async function checkPolicyExists(tableName: string, policyName: string) {
  const { data, error } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', tableName)
    .eq('policyname', policyName)
    .single()

  if (error) {
    console.error('Error checking policy:', error)
    return false
  }

  return !!data
} 