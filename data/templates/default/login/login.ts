import { Component, EventData, EventDetail, $Backend } from '@yao/sui';

const self = this as Component;

interface FormData {
  email: string;
  password: string;
}

// 初始化表单数据
const formData: FormData = {
  email: '',
  password: ''
};

// 处理输入事件
self.handleInput = async (event: Event, data: EventData) => {
  const input = event.target as HTMLInputElement;
  const type = data['type'] as keyof FormData;
  formData[type] = input.value.trim();
};

// 处理登录事件
self.handleLogin = async () => {
  try {
    // 表单验证
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // 调用后端登录接口
    const response = await $Backend('/login').Call('Login', formData.email, formData.password);
    
    if (response.success) {
      // 登录成功，重定向到首页
      window.location.href = '/';
    } else {
      alert(response.message || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again.');
  }
};

// 邮箱格式验证
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}