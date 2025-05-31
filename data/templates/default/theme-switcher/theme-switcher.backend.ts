/* data/templates/default/theme-switcher/theme-switcher.backend.ts */
import { Store } from '@yaoapps/client';
import { Request } from '@yao/sui';

function getTheme() {
  return new Store('cache').Get('theme') || 'light';
}

// Fetch current theme
function GetCurrentTheme(r: Request) {
  return getTheme();
}

// Set theme
function ApiSetTheme(theme: string) {
  if (!['light', 'dark', 'system'].includes(theme)) {
    return false;
  }
  new Store('cache').Set('theme', theme);
  return true;
}