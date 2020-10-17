import { compileToFunctions } from "./compiler/index";
import { mountComponent } from "./lifecycle";
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
    // 如果有el属性，说明要渲染模板
    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  };
  Vue.prototype.$mount = function(el) {
    // 挂载操作
    const vm = this;
    const options = vm.$options;

    el = document.querySelector(el);
    vm.$el = el;
    if(!options.render) {
      // 没有render方法，将template转化成render方法
      let template = options.template;
      if(!template && el) { // 没有tamplatet，有el，直接采用外部模板，即我们平时的写法
        template = el.outerHTML; // el.outerHTML拿到el所在的html元素
      }
      // 编译原理，将模板编译成render函数
      const render = compileToFunctions(template); // 将dom结构编译成函数
      options.render = render
    }
    // options.render
    // console.log(options.render) // 渲染时用的都是这个render方法

    // 需要挂载这个组件
    mountComponent(vm,el)

  }
}
