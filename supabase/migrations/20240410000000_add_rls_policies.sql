-- First, drop all existing policies
DROP POLICY IF EXISTS "clinics_select_policy" ON clinics;
DROP POLICY IF EXISTS "clinics_insert_policy" ON clinics;
DROP POLICY IF EXISTS "clinics_update_policy" ON clinics;
DROP POLICY IF EXISTS "clinics_delete_policy" ON clinics;

DROP POLICY IF EXISTS "patients_select_policy" ON patients;
DROP POLICY IF EXISTS "patients_insert_policy" ON patients;
DROP POLICY IF EXISTS "patients_update_policy" ON patients;
DROP POLICY IF EXISTS "patients_delete_policy" ON patients;

DROP POLICY IF EXISTS "professionals_select_policy" ON professionals;
DROP POLICY IF EXISTS "professionals_insert_policy" ON professionals;
DROP POLICY IF EXISTS "professionals_update_policy" ON professionals;
DROP POLICY IF EXISTS "professionals_delete_policy" ON professionals;

DROP POLICY IF EXISTS "clinic_units_select_policy" ON clinic_units;
DROP POLICY IF EXISTS "clinic_units_insert_policy" ON clinic_units;
DROP POLICY IF EXISTS "clinic_units_update_policy" ON clinic_units;
DROP POLICY IF EXISTS "clinic_units_delete_policy" ON clinic_units;

DROP POLICY IF EXISTS "appointments_select_policy" ON appointments;
DROP POLICY IF EXISTS "appointments_insert_policy" ON appointments;
DROP POLICY IF EXISTS "appointments_update_policy" ON appointments;
DROP POLICY IF EXISTS "appointments_delete_policy" ON appointments;

DROP POLICY IF EXISTS "medical_records_select_policy" ON medical_records;
DROP POLICY IF EXISTS "medical_records_insert_policy" ON medical_records;
DROP POLICY IF EXISTS "medical_records_update_policy" ON medical_records;
DROP POLICY IF EXISTS "medical_records_delete_policy" ON medical_records;

DROP POLICY IF EXISTS "financial_transactions_select_policy" ON financial_transactions;
DROP POLICY IF EXISTS "financial_transactions_insert_policy" ON financial_transactions;
DROP POLICY IF EXISTS "financial_transactions_update_policy" ON financial_transactions;
DROP POLICY IF EXISTS "financial_transactions_delete_policy" ON financial_transactions;

DROP POLICY IF EXISTS "documents_select_policy" ON documents;
DROP POLICY IF EXISTS "documents_insert_policy" ON documents;
DROP POLICY IF EXISTS "documents_update_policy" ON documents;
DROP POLICY IF EXISTS "documents_delete_policy" ON documents;

DROP POLICY IF EXISTS "employees_select_policy" ON employees;
DROP POLICY IF EXISTS "employees_insert_policy" ON employees;
DROP POLICY IF EXISTS "employees_update_policy" ON employees;
DROP POLICY IF EXISTS "employees_delete_policy" ON employees;

-- Now we can safely drop and recreate the function
DROP FUNCTION IF EXISTS has_account_access(UUID) CASCADE;

-- Recreate the function with improved logic
CREATE OR REPLACE FUNCTION has_account_access(account_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.user_id = auth.uid()
        AND accounts_users.account_id = has_account_access.account_id
    );
END;
$$;

-- Create policies for clinics table
CREATE POLICY "clinics_select_policy" ON clinics
    FOR SELECT TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "clinics_insert_policy" ON clinics
    FOR INSERT TO authenticated
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "clinics_update_policy" ON clinics
    FOR UPDATE TO authenticated
    USING (has_account_access(account_id))
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "clinics_delete_policy" ON clinics
    FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.user_id = auth.uid()
        AND accounts_users.account_id = clinics.account_id
        AND accounts_users.role IN ('owner', 'admin')
    ));

-- Create policies for clinic units
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
        SELECT 1 FROM clinics c
        JOIN accounts_users au ON c.account_id = au.account_id
        WHERE c.id = clinic_units.clinic_id
        AND au.user_id = auth.uid()
        AND au.role IN ('owner', 'admin')
    ));

-- Create policies for patients table
CREATE POLICY "patients_select_policy" ON patients
    FOR SELECT TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "patients_insert_policy" ON patients
    FOR INSERT TO authenticated
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "patients_update_policy" ON patients
    FOR UPDATE TO authenticated
    USING (has_account_access(account_id))
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "patients_delete_policy" ON patients
    FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.user_id = auth.uid()
        AND accounts_users.account_id = patients.account_id
        AND accounts_users.role IN ('owner', 'admin')
    ));

-- Create policies for professionals table
CREATE POLICY "professionals_select_policy" ON professionals
    FOR SELECT TO authenticated
    USING (has_account_access(account_id));

CREATE POLICY "professionals_insert_policy" ON professionals
    FOR INSERT TO authenticated
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "professionals_update_policy" ON professionals
    FOR UPDATE TO authenticated
    USING (has_account_access(account_id))
    WITH CHECK (has_account_access(account_id));

CREATE POLICY "professionals_delete_policy" ON professionals
    FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.user_id = auth.uid()
        AND accounts_users.account_id = professionals.account_id
        AND accounts_users.role IN ('owner', 'admin')
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
    USING (EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.user_id = auth.uid()
        AND accounts_users.account_id = appointments.account_id
        AND accounts_users.role IN ('owner', 'admin')
    ));

-- Create policies for medical records
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
    USING (EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.user_id = auth.uid()
        AND accounts_users.account_id = medical_records.account_id
        AND accounts_users.role IN ('owner', 'admin')
    ));

-- Create policies for financial transactions
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
    USING (EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.user_id = auth.uid()
        AND accounts_users.account_id = financial_transactions.account_id
        AND accounts_users.role IN ('owner', 'admin')
    ));

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
    USING (EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.user_id = auth.uid()
        AND accounts_users.account_id = documents.account_id
        AND accounts_users.role IN ('owner', 'admin')
    ));

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
    USING (EXISTS (
        SELECT 1 FROM accounts_users
        WHERE accounts_users.user_id = auth.uid()
        AND accounts_users.account_id = employees.account_id
        AND accounts_users.role IN ('owner', 'admin')
    )); 