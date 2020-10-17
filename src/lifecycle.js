import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function(vnode) {
        const vm= this
        patch(vm.$el,vnode) // 比较重要的的方法，将虚拟节点创建为真实节点
    }
}

export function mountComponent(vm,el) {
    // 调用render方法去渲染el属性


    // 先调用render方法，创建虚拟节点，在将虚拟节点渲染到页面上
    vm._update(vm._render())
}