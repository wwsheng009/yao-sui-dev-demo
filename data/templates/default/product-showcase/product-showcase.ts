import { Component, EventData, EventDetail, $Backend, __sui_data,$Query } from '@yao/sui';

const self = this as Component;

// 过滤产品
self.filterProducts = async (event: Event, data: EventData) => {
  const category = data['category'];
  
  // 更新UI中的活动按钮
  $Query('.filter-btn').removeClass('active');
  $Query(`[data-category="${category}"]`).addClass('active');
  
  // 保存当前类别
  self.store.Set('currentCategory', category);
  
  // 调用后端获取过滤后的产品
  const products = await $Backend('/product-showcase').Call('GetFilteredProducts', category);
  
  if (products) {
    self.store.SetJSON('products', products);
    // 重新渲染产品列表
    await self.render('product-list', { products });
  }
};

// 查看产品详情
self.viewDetails = async (event: Event, data: EventData) => {
  const productId = data['id'];
  
  // 显示加载状态
  $Query('.modal-content').html('<div class="p-12 text-center">加载中...</div>');
  $Query('[s\\:render="product-detail-modal"]').removeClass('hidden');
  
  // 调用后端获取产品详情
  const productDetail = await $Backend('/product-showcase').Call('GetProductDetails', productId);
  
  if (productDetail) {
    // 渲染产品详情
    // 渲染产品详情
    await self.render('product-detail-modal', {product:productDetail});
    // Ensure modal remains visible after render
    $Query('[s\\:render="product-detail-modal"]').removeClass('hidden');
    $Query('.modal-content').addClass('scale-100 opacity-100');
  } else {
    // Handle error case (e.g., show error message or close modal)
    $Query('.modal-content').html('<div class="p-12 text-center">无法加载产品详情</div>');
  }
};

// 关闭模态框（在模态框内实现）
self.closeModal = () => {
  $Query('[s\\:render="product-detail-modal"]').addClass('hidden');
};

function initStat(){
    // 设置初始产品列表
    self.store.SetJSON('products', __sui_data['products']);
    // 设置当前过滤类别
    self.store.Set('currentCategory', 'all');
}
document.addEventListener("DOMContentLoaded", initStat);
