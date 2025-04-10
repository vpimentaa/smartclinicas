'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to handle errors
export const handleSupabaseError = (error: Error | { message: string }) => {
  console.error('Supabase error:', error)
  throw new Error(error.message)
}

// Type definitions for our tables
export type Account = {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export type Patient = {
  id: string
  account_id: string
  name: string
  cpf: string
  phone: string | null
  email: string | null
  birth_date: string | null
  gender: 'M' | 'F' | 'O' | null
  medical_history: string | null
  allergies: string | null
  medications: string | null
  created_at: string
  updated_at: string
}

export type Professional = {
  id: string
  account_id: string
  name: string
  cpf: string
  email: string | null
  phone: string | null
  birth_date: string | null
  gender: 'M' | 'F' | 'O' | null
  specialty: string | null
  registration_number: string | null
  registration_state: string | null
  created_at: string
  updated_at: string
}

export type Clinic = {
  id: string
  account_id: string
  name: string
  cnpj: string
  email: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export type ClinicUnit = {
  id: string
  clinic_id: string
  name: string
  address_street: string | null
  address_number: string | null
  address_complement: string | null
  address_neighborhood: string | null
  address_city: string | null
  address_state: string | null
  address_zip_code: string | null
  created_at: string
  updated_at: string
}

export type Appointment = {
  id: string
  account_id: string
  patient_id: string
  professional_id: string
  clinic_unit_id: string
  start_time: string
  end_time: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  type: string
  notes: string | null
  created_at: string
  updated_at: string
}

export type MedicalRecord = {
  id: string
  account_id: string
  patient_id: string
  professional_id: string
  appointment_id: string | null
  diagnosis: string | null
  prescription: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type FinancialTransaction = {
  id: string
  account_id: string
  patient_id: string
  appointment_id: string | null
  amount: number
  type: 'payment' | 'refund'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string
  transaction_date: string
  created_at: string
  updated_at: string
}

export type Document = {
  id: string
  account_id: string
  patient_id: string
  name: string
  type: string
  file_path: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

export type UserRole = 'owner' | 'admin' | 'employee'

export type Employee = {
  id: string
  account_id: string
  clinic_id: string
  user_id: string
  name: string
  email: string
  role: UserRole
  department: string | null
  hire_date: string
  termination_date: string | null
  salary: number | null
  permissions: {
    can_create_appointments: boolean
    can_edit_appointments: boolean
    can_delete_appointments: boolean
    can_view_financial: boolean
    can_create_financial_entries: boolean
    can_edit_financial_entries: boolean
    can_delete_financial_entries: boolean
    can_manage_patients: boolean
    can_manage_professionals: boolean
    can_manage_employees: boolean
  }
  created_at: string
  updated_at: string
}

export type Address = {
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
}

export type PatientData = {
  name: string
  cpf: string
  phone: string
  email: string
  birth_date: string
  gender: string
  medical_history: string
  allergies: string
  medications: string
  account_id: string
}

// Helper function to get current account_id
export const getCurrentAccountId = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  if (!session?.user) throw new Error('No user session found')

  const { data, error: accountError } = await supabase
    .from('accounts_users')
    .select('account_id')
    .eq('user_id', session.user.id)
    .single()

  if (accountError) throw accountError
  if (!data?.account_id) throw new Error('No account found for user')

  return data.account_id
}

// Helper functions for clinics
export const getClinics = async () => {
  const account_id = await getCurrentAccountId()
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .eq('account_id', account_id)
    .order('name')

  if (error) throw error
  return data as Clinic[]
}

export const getClinicById = async (id: string) => {
  const account_id = await getCurrentAccountId()
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', id)
    .eq('account_id', account_id)
    .single()

  if (error) throw error
  return data as Clinic
}

export const createClinic = async (clinic: Omit<Clinic, 'id' | 'created_at' | 'updated_at'>) => {
  const account_id = await getCurrentAccountId()
  const { data, error } = await supabase
    .from('clinics')
    .insert([{ ...clinic, account_id }])
    .select()
    .single()

  if (error) throw error
  return data as Clinic
}

export const updateClinic = async (id: string, clinic: Partial<Clinic>) => {
  const account_id = await getCurrentAccountId()
  const { data, error } = await supabase
    .from('clinics')
    .update(clinic)
    .eq('id', id)
    .eq('account_id', account_id)
    .select()
    .single()

  if (error) throw error
  return data as Clinic
}

export const deleteClinic = async (id: string) => {
  const account_id = await getCurrentAccountId()
  const { error } = await supabase
    .from('clinics')
    .delete()
    .eq('id', id)
    .eq('account_id', account_id)

  if (error) throw error
}

// Helper functions for clinic units
export const getClinicUnits = async (clinicId: string) => {
  const { data, error } = await supabase
    .from('clinic_units')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('name')

  if (error) throw error
  return data as ClinicUnit[]
}

export const getClinicUnitById = async (id: string) => {
  const { data, error } = await supabase
    .from('clinic_units')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as ClinicUnit
}

export const createClinicUnit = async (unit: Omit<ClinicUnit, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('clinic_units')
    .insert([unit])
    .select()
    .single()

  if (error) throw error
  return data as ClinicUnit
}

export const updateClinicUnit = async (id: string, unit: Partial<ClinicUnit>) => {
  const { data, error } = await supabase
    .from('clinic_units')
    .update(unit)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as ClinicUnit
}

export const deleteClinicUnit = async (id: string) => {
  const { error } = await supabase
    .from('clinic_units')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Helper functions for professionals
export const getProfessionals = async (clinicId: string) => {
  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('name')

  if (error) throw error
  return data as Professional[]
}

export const getProfessionalById = async (id: string) => {
  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Professional
}

export const createProfessional = async (professional: Omit<Professional, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('professionals')
    .insert([professional])
    .select()
    .single()

  if (error) throw error
  return data as Professional
}

export const updateProfessional = async (id: string, professional: Partial<Professional>) => {
  const { data, error } = await supabase
    .from('professionals')
    .update(professional)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Professional
}

export const deleteProfessional = async (id: string) => {
  const { error } = await supabase
    .from('professionals')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function createPatient(patientData: PatientData) {
  try {
    console.log('Creating patient with data:', patientData)
    
    const { data, error } = await supabase
      .from('patients')
      .insert([{
        name: patientData.name,
        cpf: patientData.cpf,
        phone: patientData.phone,
        email: patientData.email,
        birth_date: patientData.birth_date,
        gender: patientData.gender,
        medical_history: patientData.medical_history,
        allergies: patientData.allergies,
        medications: patientData.medications,
        account_id: patientData.account_id
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Patient created successfully:', data)
    return data
  } catch (error: unknown) {
    console.error('Error in createPatient:', error)
    throw error
  }
}

// Helper functions for employees
export const getEmployees = async (clinicId: string) => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('name')

  if (error) throw error
  return data as Employee[]
}

export const getEmployeeById = async (id: string) => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Employee
}

export const createEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('employees')
    .insert([employee])
    .select()
    .single()

  if (error) throw error
  return data as Employee
}

export const updateEmployee = async (id: string, employee: Partial<Employee>) => {
  const { data, error } = await supabase
    .from('employees')
    .update(employee)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Employee
}

export const deleteEmployee = async (id: string) => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const getPatients = async (accountId: string) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('account_id', accountId)
    .order('name')

  if (error) throw error
  return data as Patient[]
}

export const getPatientById = async (id: string) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Patient
}

export const updatePatient = async (id: string, patient: Partial<Patient>) => {
  const { data, error } = await supabase
    .from('patients')
    .update(patient)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Patient
}

export const deletePatient = async (id: string) => {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id)

  if (error) throw error
} 