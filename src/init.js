import { initSate } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    // 初始化状态（数据做初始化劫持，改变数据时应该更新视图）
    //  vue 组件中很多状态，data,props,watch,computed
    initSate(vm);

    // vue核心特性：响应式数据原理
    // Vue 是什么框架，MVVM（不完全是）怎么是？ 数据变化视图会更新，视图变化数据会被影响，
    // 怎么不是？ mvvm不能跳过数据直接更新视图，但是vue有$ref可以直接操作dom
  };
}
