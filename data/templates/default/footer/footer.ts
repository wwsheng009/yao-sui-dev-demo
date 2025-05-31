import { Component } from '@yao/sui';

console.log('footer component init called');
// 引用当前组件实例
const self = this as Component;

self.hello = function () {
    console.log('hello');
    alert('hello');
}
if (self.root.getAttribute("initialized")){
    console.log('footer component already initialized');
}