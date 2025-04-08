'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Clinic = {
  id: string
  owner_id: string
  name: string
  cnpj: string
  email: string
  phone: string
  address_street: string
  address_number: string
  address_complement: string | null
  address_neighborhood: string
  address_city: string
  address_state: string
  address_zip_code: string
  created_at: string
  updated_at: string
}

export type UserRole = 'owner' | 'admin' | 'employee'

export type Employee = {
  id: string
  clinic_id: string
  user_id: string
  name: string
  email: string
  role: UserRole
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

export type ClinicUnit = {
  id: string
  clinic_id: string
  owner_id: string
  name: string
  address_street: string
  address_number: string
  address_complement: string | null
  address_neighborhood: string
  address_city: string
  address_state: string
  address_zip_code: string
  created_at: string
  updated_at: string
}

export type Professional = {
  id: string
  clinic_id: string
  name: string
  cpf: string
  email: string
  phone: string
  birth_date: string
  gender: string
  specialty: string
  registration_number: string
  registration_state: string
  address_street: string
  address_number: string
  address_complement: string | null
  address_neighborhood: string
  address_city: string
  address_state: string
  address_zip_code: string
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
  address: Address
  medical_history: string
  allergies: string
  medications: string
  account_id: string
}

// Helper functions for clinics
export const getClinics = async () => {
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Clinic[]
}

export const getClinicById = async (id: string) => {
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Clinic
}

export const createClinic = async (clinic: Omit<Clinic, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('clinics')
    .insert([clinic])
    .select()
    .single()

  if (error) throw error
  return data as Clinic
}

export const updateClinic = async (id: string, clinic: Partial<Clinic>) => {
  const { data, error } = await supabase
    .from('clinics')
    .update(clinic)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Clinic
}

export const deleteClinic = async (id: string) => {
  const { error } = await supabase
    .from('clinics')
    .delete()
    .eq('id', id)

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
        ...patientData,
        address: patientData.address
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