import { Process, Exception, Store } from '@yaoapps/client';
import { Request } from '@yao/sui';

// 初始化消息历史
function GetMessages(r: Request) {
  return [];
}

// 处理用户消息并返回AI响应
function ApiGetResponse(message: string) {
  try {
    // 这里可以集成实际的AI服务
    // 目前返回简单的回复用于演示
    return `这是对"${message}"的回复。`;
  } catch (error) {
    console.error('Error in GetResponse:', error);
    throw new Exception('Failed to get AI response', 500);
  }
}