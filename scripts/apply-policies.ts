import { setupPatientPolicies } from '../src/lib/supabase-policies'

async function main() {
  try {
    console.log('Setting up patient policies...')
    await setupPatientPolicies()
    console.log('Patient policies setup completed successfully')
  } catch (error) {
    console.error('Error setting up policies:', error)
    process.exit(1)
  }
}

main() 