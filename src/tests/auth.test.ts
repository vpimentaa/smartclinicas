import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Authentication Flow', () => {
  const testUser = {
    email: 'newtest@example.com',
    password: 'testpassword123',
  };

  beforeAll(async () => {
    // Clean up and create test user
    try {
      // Try to sign up the test user
      const { data: signUpData, error: signUpError } = await global.supabase.auth.signUp(testUser);
      
      if (signUpError && signUpError.message !== 'User already registered') {
        throw signUpError;
      }

      // If signup was successful or user exists, try to sign in
      const { data: signInData, error: signInError } = await global.supabase.auth.signInWithPassword(testUser);
      expect(signInError).toBeNull();
      expect(signInData.user).toBeDefined();

      if (!signInData.user) {
        throw new Error('User not found after sign in');
      }

      // Create or update the user's profile and account access
      const userId = signInData.user.id;

      // Create test account if it doesn't exist
      const { data: accountData } = await global.supabase
        .from('accounts')
        .upsert({
          id: '11111111-1111-1111-1111-111111111111',
          name: 'Test Clinic',
          email: 'test@clinic.com',
        })
        .select()
        .single();

      // Create or update user profile
      await global.supabase
        .from('users')
        .upsert({
          id: userId,
          email: testUser.email,
          full_name: 'Test User',
        });

      // Link user to account
      await global.supabase
        .from('accounts_users')
        .upsert({
          account_id: '11111111-1111-1111-1111-111111111111',
          user_id: userId,
          role: 'owner',
        });

      // Sign out after setup
      await global.supabase.auth.signOut();
    } catch (error) {
      console.error('Setup error:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await global.supabase.auth.signOut();
    } catch (error) {
      // Ignore errors
    }
  });

  it('should sign in with test user', async () => {
    const { data, error } = await global.supabase.auth.signInWithPassword(testUser);
    expect(error).toBeNull();
    expect(data.user).toBeDefined();
    expect(data.session).toBeDefined();
  });

  it('should access protected resources with authenticated user', async () => {
    // Sign in first
    const { data: authData } = await global.supabase.auth.signInWithPassword(testUser);

    // Try to access protected resources
    const { data: accounts, error: accountsError } = await global.supabase
      .from('accounts')
      .select('*');

    expect(accountsError).toBeNull();
    expect(accounts).toBeDefined();
    expect(accounts?.length).toBeGreaterThan(0);

    // Try to access a specific account that the user has access to
    const { data: account, error: accountError } = await global.supabase
      .from('accounts')
      .select('*')
      .eq('id', '11111111-1111-1111-1111-111111111111')
      .single();

    expect(accountError).toBeNull();
    expect(account).toBeDefined();
    expect(account?.name).toBe('Test Clinic');
  });

  it('should enforce RLS policies', async () => {
    // Create a new user without any account access
    const restrictedUser = {
      email: 'restricted@example.com',
      password: 'testpassword123',
    };

    // Sign up the restricted user
    const { data: signUpData, error: signUpError } = await global.supabase.auth.signUp(restrictedUser);

    // If user already exists, sign in instead
    if (signUpError?.message === 'User already registered') {
      const { data: signInData, error: signInError } = await global.supabase.auth.signInWithPassword(restrictedUser);
      expect(signInError).toBeNull();
      expect(signInData.user).toBeDefined();
    } else {
      expect(signUpError).toBeNull();
      expect(signUpData.user).toBeDefined();
    }

    // Try to access accounts (should return empty array due to RLS)
    const { data: accounts, error: accountsError } = await global.supabase
      .from('accounts')
      .select('*');

    expect(accountsError).toBeNull();
    expect(accounts).toBeDefined();
    expect(accounts?.length).toBe(0);

    // Try to access a specific account (should be blocked by RLS)
    const { data: account, error: accountError } = await global.supabase
      .from('accounts')
      .select('*')
      .eq('id', '11111111-1111-1111-1111-111111111111')
      .single();

    expect(accountError).toBeDefined();
    expect(account).toBeNull();
  });
}); 