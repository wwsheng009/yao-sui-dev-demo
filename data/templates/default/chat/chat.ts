import { Component, EventData, EventDetail, $Backend } from '@yao/sui';

const self = this as Component;

interface Message {
  content: string;
  isUser: boolean;
}

// 初始化组件状态
self.once = async function () {
  self.store.SetJSON('messages', []);
};

// 处理消息发送
self.sendMessage = async (event: Event, data: EventData, detail: EventDetail) => {
  const input = self.$root.find('#message-input').elm() as HTMLInputElement;
  const text = input.value.trim();

  if (!text) return;

  // 添加用户消息
  const messages = self.store.GetJSON('messages') || [];
  messages.push({
    content: text,
    isUser: true
  });

  // 更新UI
  self.store.SetJSON('messages', messages);
  await self.render('messages', { messages });

  // 清空输入框
  input.value = '';

  try {
    // 调用后端获取AI响应
    const response = await $Backend('/chat').Call('GetResponse', text);
    
    // 添加AI响应
    messages.push({
      content: response,
      isUser: false
    });

    // 更新UI
    self.store.SetJSON('messages', messages);
    await self.render('messages', { messages });
  } catch (error) {
    console.error('Error getting AI response:', error);
  }
};

// 处理键盘事件
self.handleKeyPress = async (event: KeyboardEvent, data: EventData, detail: EventDetail) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    await self.sendMessage(event, data, detail);
  }
};