-- Insert test account
INSERT INTO public.accounts (id, name, email, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Test Clinic',
    'test@clinic.com',
    NOW(),
    NOW()
);

-- Insert test user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'test@user.com',
    crypt('testpassword123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

-- Insert test user profile
INSERT INTO public.users (id, email, full_name, created_at, updated_at)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'test@user.com',
    'Test User',
    NOW(),
    NOW()
);

-- Link user to account
INSERT INTO public.accounts_users (account_id, user_id, role, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'owner',
    NOW(),
    NOW()
);

-- Insert test clinic
INSERT INTO public.clinics (id, account_id, name, cnpj, email, phone, created_at, updated_at)
VALUES (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Main Clinic',
    '12345678901234',
    'main@clinic.com',
    '+5511999999999',
    NOW(),
    NOW()
);

-- Insert test clinic unit
INSERT INTO public.clinic_units (id, clinic_id, name, address_street, address_number, address_complement, address_neighborhood, address_city, address_state, address_zip_code, created_at, updated_at)
VALUES (
    '55555555-5555-5555-5555-555555555555',
    '44444444-4444-4444-4444-444444444444',
    'Branch Unit',
    'Branch Street',
    '456',
    'Suite 101',
    'Downtown',
    'São Paulo',
    'SP',
    '12345-679',
    NOW(),
    NOW()
);

-- Insert test professional
INSERT INTO public.professionals (id, account_id, name, cpf, email, phone, birth_date, gender, specialty, registration_number, registration_state, created_at, updated_at)
VALUES (
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Dr. Test Professional',
    '12345678901',
    'doctor@test.com',
    '+5511999999997',
    '1980-01-01',
    'M',
    'Cardiology',
    '12345',
    'SP',
    NOW(),
    NOW()
);

-- Insert test patient
INSERT INTO public.patients (id, account_id, name, cpf, email, phone, birth_date, gender, medical_history, allergies, medications, created_at, updated_at)
VALUES (
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    'Test Patient',
    '98765432101',
    'patient@test.com',
    '+5511999999996',
    '1990-01-01',
    'F',
    'No significant medical history',
    'None',
    'None',
    NOW(),
    NOW()
);

-- Insert test employee
INSERT INTO public.employees (id, account_id, user_id, role, department, hire_date, salary, created_at, updated_at)
VALUES (
    '88888888-8888-8888-8888-888888888888',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'admin',
    'Administration',
    '2020-01-01',
    5000.00,
    NOW(),
    NOW()
);

-- Insert test appointment
INSERT INTO public.appointments (id, account_id, patient_id, professional_id, clinic_unit_id, start_time, end_time, status, type, notes, created_at, updated_at)
VALUES (
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    '77777777-7777-7777-7777-777777777777',
    '66666666-6666-6666-6666-666666666666',
    '55555555-5555-5555-5555-555555555555',
    '2024-04-15 09:00:00+00',
    '2024-04-15 10:00:00+00',
    'scheduled',
    'consultation',
    'Initial consultation',
    NOW(),
    NOW()
);

-- Insert test medical record
INSERT INTO public.medical_records (id, account_id, patient_id, professional_id, appointment_id, diagnosis, prescription, notes, created_at, updated_at)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    '77777777-7777-7777-7777-777777777777',
    '66666666-6666-6666-6666-666666666666',
    '99999999-9999-9999-9999-999999999999',
    'Hypertension',
    'Prescribed medication and lifestyle changes',
    'Patient needs to return in 30 days for follow-up',
    NOW(),
    NOW()
);

-- Insert test financial transaction
INSERT INTO public.financial_transactions (id, account_id, patient_id, appointment_id, amount, type, status, payment_method, transaction_date, created_at, updated_at)
VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    '77777777-7777-7777-7777-777777777777',
    '99999999-9999-9999-9999-999999999999',
    150.00,
    'payment',
    'completed',
    'credit_card',
    NOW(),
    NOW(),
    NOW()
);

-- Insert test document
INSERT INTO public.documents (id, account_id, patient_id, name, type, file_path, uploaded_by, created_at, updated_at)
VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '11111111-1111-1111-1111-111111111111',
    '77777777-7777-7777-7777-777777777777',
    'Initial Consultation Report',
    'medical_report',
    '/reports/initial.pdf',
    '22222222-2222-2222-2222-222222222222',
    NOW(),
    NOW()
); 