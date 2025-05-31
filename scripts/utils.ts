import { Process } from '@yaoapps/client';

/**
 * Get the current time in milliseconds
 * @returns
 */
export function Now() {
  return new Date().getTime();
}

/**
 * Reset the demo data
 * yao run scripts.utils.ResetDemoData
 */
export function ResetDemoData() {

}

/**
 * Reset the administrators
 * yao run scripts.utils.ResetAdmins
 * @returns
 */
export function ResetAdmins() {
  Process('schemas.default.Drop', 'admin_user'); // Drop the users table if it exists

  Process('models.admin.user.Migrate', true); // Migrate the schema

  const admin = {
    email: 'demo@moapi.ai',
    password: 'Demo@5099',
    type: 'admin'
  };
  Process('models.admin.user.Save', admin); // Save the admin

  // Get the records
  const row = Process('models.admin.user.Find', 1, { select: ['email'] });
  return { ...admin, ...row };
}

