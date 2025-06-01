import { Component, EventData, EventDetail, $Backend } from '@yao/sui';

const self = this as Component;

// 初始化组件
self.once = async function () {
  self.store.SetJSON('charCount', 0);
  // 监听输入框变化
  const input = self.$root.find('#search-input').elm() as HTMLInputElement;
  input.addEventListener('input', updateCharCount);
};

// 更新字符计数
function updateCharCount(event: Event) {
  const input = event.target as HTMLInputElement;
  const count = input.value.length;
  self.store.SetJSON('charCount', count);
  self.render('char-count', { charCount: count });
}

// 搜索关键词
self.searchKeywords = async (event: Event, data: EventData, detail: EventDetail) => {
  try {
    const input = self.$root.find('#search-input').elm() as HTMLInputElement;
    const keywords = input.value.trim();
    
    if (!keywords) {
      alert('请输入搜索关键词');
      return;
    }

    const result = await $Backend('/search-keywords').Call('Search', keywords);
    console.log('搜索结果:', result);
    
  } catch (error) {
    console.error('搜索出错:', error);
    alert('搜索失败，请重试');
  }
};