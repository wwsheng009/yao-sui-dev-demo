import { Process, Exception } from '@yaoapps/client';
import { Request } from '@yao/sui';

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
}

// 登录处理函数
function ApiLogin(email: string, password: string): LoginResponse {
  try {
    // 调用Yao的登录处理器
    const response = Process('yao.login.Admin', [{
      email: email,
      password: password
    }]);

    // 如果登录成功，返回token
    if (response && response.token) {
      return {
        success: true,
        token: response.token
      };
    }

    return {
      success: false,
      message: 'Invalid email or password'
    };

  } catch (error) {
    console.error('Login error:', error);
    throw new Exception('Login failed', 500);
  }
}