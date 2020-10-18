import { initGlobalApi } from "./global-api/index";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vdom/index";
import {stateMixin} from './state'
import { compileToFunctions } from "./compiler";
import { createElm } from "./vdom/patch";

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
stateMixin(Vue)
// 静态方法Vue.component,Vue.directive,Vue.extend,Vue.mixin
initGlobalApi(Vue)


let vm1 = new Vue({data:{name:'zf'}});
let render1 = compileToFunctions('<div id="a">{{name}}</div>')
let vnode1 = render1.call(vm1)
document.body.appendChild(createElm(vnode1))

let vm1 = new Vue({data:{name:'jw'}});
let render2 = compileToFunctions('<div id="b">{{name}}</div>')
let vnode2 = render2.call(vm1)
document.body.appendChild(createElm(vnode2))
export default Vue;

// vue的更新策略是以组件为单位，给每个组件增加一个watcher，属性变化前后会重新调用这个watcher（渲染watcher）
