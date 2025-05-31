/* data/templates/default/theme-switcher/theme-switcher.ts */
import { Component, EventData, EventDetail, $Backend, __sui_data } from '@yao/sui';
const self = this as Component;

self.once = async function () {
  console.log('Theme switcher initialized');
};

// Handle theme selection
self.setTheme = async (event: Event, data: EventData, detail: EventDetail) => {
  try {
    const theme = data['theme'];
    if (!['light', 'dark', 'system'].includes(theme)) {
      throw new Error('Invalid theme selected');
    }

    // Call backend to save the theme
    const success = await $Backend('/theme-switcher').Call('SetTheme', theme);
    if (!success) {
      throw new Error('Failed to set theme');
    }

    // Update local store
    self.store.SetJSON('theme', theme);

    // Update document class for theme
    if (theme === 'system') {
      document.body.className = '';
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
      }
    } else {
      document.body.className = theme;
    }

    // Re-render the demo area
    await self.render('theme-demo', { theme });
  } catch (error) {
    console.error('Error setting theme:', error);
    alert('Failed to set theme. Please try again.');
  }
};

// Initialize state
async function initState() {
  const initialTheme = __sui_data['theme'] || 'light';
  self.store.SetJSON('theme', initialTheme);
  document.body.className = initialTheme === 'system' ? '' : initialTheme;
  console.log('Theme switcher state initialized with theme:', initialTheme);
}
document.addEventListener('DOMContentLoaded', initState);