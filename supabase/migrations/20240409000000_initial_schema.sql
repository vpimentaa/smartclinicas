-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts_users junction table
CREATE TABLE IF NOT EXISTS accounts_users (
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'employee')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (account_id, user_id)
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    phone TEXT,
    email TEXT,
    birth_date DATE,
    gender TEXT CHECK (gender IN ('M', 'F', 'O')),
    medical_history TEXT,
    allergies TEXT,
    medications TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create professionals table
CREATE TABLE IF NOT EXISTS professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    email TEXT,
    phone TEXT,
    birth_date DATE,
    gender TEXT CHECK (gender IN ('M', 'F', 'O')),
    specialty TEXT,
    registration_number TEXT,
    registration_state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clinics table
CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clinic_units table
CREATE TABLE IF NOT EXISTS clinic_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address_street TEXT,
    address_number TEXT,
    address_complement TEXT,
    address_neighborhood TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    clinic_unit_id UUID REFERENCES clinic_units(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    type TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    diagnosis TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_transactions table
CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('payment', 'refund')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'employee')),
    department TEXT,
    hire_date DATE NOT NULL,
    termination_date DATE,
    salary DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to check if user has access to an account
CREATE OR REPLACE FUNCTION has_account_access(account_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.account_id = has_account_access.account_id
        AND accounts_users.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security on all tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies for all tables
CREATE POLICY "accounts_select_policy" ON accounts
    FOR SELECT TO authenticated
    USING (has_account_access(id));

CREATE POLICY "accounts_insert_policy" ON accounts
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "accounts_update_policy" ON accounts
    FOR UPDATE TO authenticated
    USING (has_account_access(id) AND EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.user_id = auth.uid()
        AND accounts_users.account_id = accounts.id
        AND accounts_users.role IN ('owner', 'admin')
    ));

CREATE POLICY "accounts_delete_policy" ON accounts
    FOR DELETE TO authenticated
    USING (has_account_access(id) AND EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.user_id = auth.uid()
        AND accounts_users.account_id = accounts.id
        AND accounts_users.role = 'owner'
    ));

-- Create policies for users
CREATE POLICY "users_select_policy" ON users
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "users_insert_policy" ON users
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_policy" ON users
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);

-- Create policies for accounts_users
CREATE POLICY "accounts_users_select_policy" ON accounts_users
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "accounts_users_insert_policy" ON accounts_users
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "accounts_users_update_policy" ON accounts_users
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "accounts_users_delete_policy" ON accounts_users
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Create policies for patients
CREATE POLICY "patients_select_policy" ON patients
    FOR SELECT TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "patients_insert_policy" ON patients
    FOR INSERT TO authenticated
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "patients_update_policy" ON patients
    FOR UPDATE TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "patients_delete_policy" ON patients
    FOR DELETE TO authenticated
    USING (has_account_access(account_id));

-- Create policies for professionals
CREATE POLICY "professionals_select_policy" ON professionals
    FOR SELECT TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "professionals_insert_policy" ON professionals
    FOR INSERT TO authenticated
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "professionals_update_policy" ON professionals
    FOR UPDATE TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "professionals_delete_policy" ON professionals
    FOR DELETE TO authenticated
    USING (has_account_access(account_id));

-- Create policies for clinics
CREATE POLICY "clinics_select_policy" ON clinics
    FOR SELECT TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "clinics_insert_policy" ON clinics
    FOR INSERT TO authenticated
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "clinics_update_policy" ON clinics
    FOR UPDATE TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "clinics_delete_policy" ON clinics
    FOR DELETE TO authenticated
    USING (has_account_access(account_id));

-- Create policies for clinic_units
CREATE POLICY "clinic_units_select_policy" ON clinic_units
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM clinics
        WHERE clinics.id = clinic_units.clinic_id
        AND has_account_access(clinics.account_id)
    ));

CREATE POLICY "clinic_units_insert_policy" ON clinic_units
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM clinics
        WHERE clinics.id = clinic_units.clinic_id
        AND has_account_access(clinics.account_id)
    ));

CREATE POLICY "clinic_units_update_policy" ON clinic_units
    FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM clinics
        WHERE clinics.id = clinic_units.clinic_id
        AND has_account_access(clinics.account_id)
    ));

CREATE POLICY "clinic_units_delete_policy" ON clinic_units
    FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM clinics
        WHERE clinics.id = clinic_units.clinic_id
        AND has_account_access(clinics.account_id)
    ));

-- Create policies for appointments
CREATE POLICY "appointments_select_policy" ON appointments
    FOR SELECT TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "appointments_insert_policy" ON appointments
    FOR INSERT TO authenticated
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "appointments_update_policy" ON appointments
    FOR UPDATE TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "appointments_delete_policy" ON appointments
    FOR DELETE TO authenticated
    USING (has_account_access(account_id));

-- Create policies for medical_records
CREATE POLICY "medical_records_select_policy" ON medical_records
    FOR SELECT TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "medical_records_insert_policy" ON medical_records
    FOR INSERT TO authenticated
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "medical_records_update_policy" ON medical_records
    FOR UPDATE TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "medical_records_delete_policy" ON medical_records
    FOR DELETE TO authenticated
    USING (has_account_access(account_id));

-- Create policies for financial_transactions
CREATE POLICY "financial_transactions_select_policy" ON financial_transactions
    FOR SELECT TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "financial_transactions_insert_policy" ON financial_transactions
    FOR INSERT TO authenticated
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "financial_transactions_update_policy" ON financial_transactions
    FOR UPDATE TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "financial_transactions_delete_policy" ON financial_transactions
    FOR DELETE TO authenticated
    USING (has_account_access(account_id));

-- Create policies for documents
CREATE POLICY "documents_select_policy" ON documents
    FOR SELECT TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "documents_insert_policy" ON documents
    FOR INSERT TO authenticated
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "documents_update_policy" ON documents
    FOR UPDATE TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "documents_delete_policy" ON documents
    FOR DELETE TO authenticated
    USING (has_account_access(account_id));

-- Create policies for employees
CREATE POLICY "employees_select_policy" ON employees
    FOR SELECT TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "employees_insert_policy" ON employees
    FOR INSERT TO authenticated
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "employees_update_policy" ON employees
    FOR UPDATE TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "employees_delete_policy" ON employees
    FOR DELETE TO authenticated
    USING (has_account_access(account_id)); 