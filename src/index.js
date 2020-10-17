import { initGlobalApi } from "./global-api/index";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vdom/index";
// 用vue的构造函数或者创建组件
function Vue(options) {
  this._init(options); // 组件初始化的入口
}
//写成一个个的插件进行扩展，解耦方法
// vue初始化方法
// 原型方法
initMixin(Vue); // init方法
lifecycleMixin(Vue); // 混合生命周期，渲染dom _update
renderMixin(Vue) // _render

// 静态方法Vue.component,Vue.directive,Vue.extend,Vue.mixin
initGlobalApi(Vue)
export default Vue;
