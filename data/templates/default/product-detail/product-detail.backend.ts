import { Request } from '@yao/sui';

const products = {
  'P123': {
    id: 'P123',
    name: '智能手表旗舰版',
    price: 2999,
    images: ['/assets/watch-1.jpg', '/assets/watch-2.jpg'],
    specs: {
      材质: '陶瓷表圈',
      续航: '7天',
      防水: '5ATM'
    },
    description: '配备AMOLED显示屏，支持血氧监测和GPS定位...'
  }
};

// 产品详情接口
 function BeforeRender(request: Request) {
  const productId = request.params?.id || 'P123';
  return products[productId]
}

// 购物车接口
 function ApiAddToCart(productId: string) {
  return { 
    code: 200,
    data: {
      count: Math.floor(Math.random() * 10) + 1
    }
  };
}