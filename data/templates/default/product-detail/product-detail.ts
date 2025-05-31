import { Component, EventData } from '@yao/sui';

const self = this as Component;

// 初始化产品视图
self.once = function() {
  self.store.Set('expanded', false);
  self.store.Set('activeImageIndex', 0);
};

// 缩略图点击处理
self.handleThumbClick = async (event: Event, data: EventData) => {
  const index = parseInt(data['index']);
  self.store.Set('activeImageIndex', index);
  await self.render('.gallery-main', {});
};

// 加入购物车
self.handleAddToCart = async () => {
  const productId = self.props.Get('product.id');
  try {
    const result = await $Backend('/product-detail').Call('AddToCart', productId);
    self.$root.find('.add-to-cart').elm().innerHTML =  ('已加入 (' + result.data.count + ')');
  } catch (error) {
    console.error('添加到购物车失败:', error);
  }
};

// 详情展开切换
self.toggleExpand = () => {
  const expanded = !self.store.Get('expanded');
  self.store.Set('expanded', expanded);
  self.render('.product-description', {});
};