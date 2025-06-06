import { LoadOption, MigrateOption } from '@yao/lib';
import { Now, ResetAdmins, ResetDemoData, ResetPets } from '@scripts/utils'; // Import Now function from scripts/utils.ts.

/**
 * Custom process demo
 * yao run scripts.tests.Hello "Hello, World!"
 * @param input string the input string
 * @returns string
 */
export function Hello(input: string): string {
  console.log(`Hello process is executed with input: ${input}, now: ${Now()}`);
  return input;
}

/**
 * Executed after the application setup ( Setup Wizard )
 * yao run scripts.tests.AppSetup
 */
export function AppSetup() {
  Reset();
}

/**
 * Executed after the application load ( yao start or yao run )
 * @param option LoadOption
 */
export function AppAfterLoad(option: LoadOption) {
  console.log(option);
}

/**
 * Executed after the application migrate ( yao migrate )
 * @param option MigrateOption
 */
export function AppAfterMigrate(option: MigrateOption) {
  console.log(option);
}

/**
 * Reset the demo data
 * yao run scripts.tests.Reset
 */
function Reset() {
  ResetAdmins(); // Reset the admins data
}
