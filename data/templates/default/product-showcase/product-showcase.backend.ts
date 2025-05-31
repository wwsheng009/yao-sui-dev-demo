import { Request } from '@yao/sui';

// 模拟产品数据
const products = [
  {
    id: '1',
    name: '高端智能手表',
    description: '采用先进技术，全天候健康监测，超长续航',
    price: 2999,
    image: '/assets/products/smart-watch.jpg',
    category: 'electronics',
    featured: true,
    rating: 5,
    details: {
      features: ["心率监测", "血氧检测", "GPS定位", "50米防水"],
      specifications: {
        "屏幕": "1.78英寸AMOLED",
        "电池": "450mAh，续航7天",
        "材质": "钛合金机身，蓝宝石玻璃"
      }
    }
  },
  {
    id: '2',
    name: '设计师办公椅',
    description: '人体工学设计，优质材料，提供完美支撑',
    price: 4599,
    image: '/assets/products/office-chair.jpg',
    category: 'furniture',
    rating: 4,
    details: {
      features: ["可调节扶手", "透气网布", "腰部支撑", "360度旋转"],
      specifications: {
        "材质": "铝合金框架，高级网布",
        "承重": "150kg",
        "颜色": "黑色/灰色/蓝色"
      }
    }
  },
  // 更多产品...
];

// 获取所有产品
function GetProducts(request: Request) {
  return products;
}

// 获取过滤后的产品
function ApiGetFilteredProducts(category: string) {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
}

// 获取产品详情
function ApiGetProductDetails(id: string) {
  const product = products.find(p => p.id === id);
  if (!product) return null;
  
  return {
    ...product,
    // 添加其他可能需要的数据
  };
}

// 渲染前处理
function BeforeRender(request: Request, props: any) {
  return {
    products: products.filter(p => p.featured).slice(0, 8) // 默认显示推荐产品
  };
}

// 组件常量
const Constants = {
  MAX_PRODUCTS_PER_PAGE: 12
};