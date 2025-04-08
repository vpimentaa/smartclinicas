import { supabase } from '../lib/supabase'

async function auditDatabase() {
  try {
    // Check if patients table exists
    const { error: patientsError } = await supabase
      .from('patients')
      .select('*')
      .limit(1)

    if (patientsError) {
      console.log('Patients table does not exist or is not accessible')
    } else {
      console.log('Patients table exists and is accessible')
    }

    // Check if accounts table exists
    const { error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .limit(1)

    if (accountsError) {
      console.log('Accounts table does not exist or is not accessible')
    } else {
      console.log('Accounts table exists and is accessible')
    }

    // Check if accounts_users table exists
    const { error: accountsUsersError } = await supabase
      .from('accounts_users')
      .select('*')
      .limit(1)

    if (accountsUsersError) {
      console.log('Accounts_users table does not exist or is not accessible')
    } else {
      console.log('Accounts_users table exists and is accessible')
    }

    // Check if clinics table exists
    const { error: clinicsError } = await supabase
      .from('clinics')
      .select('*')
      .limit(1)

    if (clinicsError) {
      console.log('Clinics table does not exist or is not accessible')
    } else {
      console.log('Clinics table exists and is accessible')
    }

    // Check if professionals table exists
    const { error: professionalsError } = await supabase
      .from('professionals')
      .select('*')
      .limit(1)

    if (professionalsError) {
      console.log('Professionals table does not exist or is not accessible')
    } else {
      console.log('Professionals table exists and is accessible')
    }

    // Check if employees table exists
    const { error: employeesError } = await supabase
      .from('employees')
      .select('*')
      .limit(1)

    if (employeesError) {
      console.log('Employees table does not exist or is not accessible')
    } else {
      console.log('Employees table exists and is accessible')
    }

  } catch (error) {
    console.error('Error auditing database:', error)
  }
}

// Run the audit
auditDatabase() 