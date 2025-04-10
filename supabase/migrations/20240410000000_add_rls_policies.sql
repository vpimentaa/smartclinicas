-- Remove duplicate has_account_access function
DROP FUNCTION IF EXISTS has_account_access(UUID);

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
    USING (has_account_access(account_id));

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