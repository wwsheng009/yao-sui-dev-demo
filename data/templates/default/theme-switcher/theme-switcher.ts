/* data/templates/default/theme-switcher/theme-switcher.ts */
import { Component, EventData, EventDetail, $Backend, __sui_data } from '@yao/sui';
const self = this as Component;

self.once = async function () {
  console.log('Theme switcher initialized');
};

type Theme = 'light' | 'dark' | 'system';

function getTheme() {
  const yao = new Yao();
  const savedTheme = yao.Cookie('color-theme') as Theme | null;
  return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'dark'
    : 'light';
}
// 全局切换
function setTheme(event: Event, data: EventData, detail: EventDetail) {
  const { theme } = data;
  const yao = new Yao();
  const html = document.documentElement;
  // Remove existing theme classes
  html.classList.remove('light', 'dark');
  if (theme === 'system') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      html.classList.add('dark');
    }
    yao.SetCookie('color-theme', 'system');
    return;
  }
  html.classList.add(theme);
  yao.SetCookie('color-theme', theme);
}

// Handle theme selection
// 局部切换主题，通过render局部渲染
// 也可以使用bodoy的class切换
self.setTheme1 = async (event: Event, data: EventData, detail: EventDetail) => {
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
      //
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
// document.addEventListener('DOMContentLoaded', initState);