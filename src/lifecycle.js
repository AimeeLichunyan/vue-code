import Watcher from "./observer/watcher"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function(vnode) {
        const vm= this
        // patch(vm.$el,vnode) // 比较重要的的方法，将虚拟节点创建为真实节点
    }
}

export function mountComponent(vm,el) {
    // 调用render方法去渲染el属性


    // 先调用render方法，创建虚拟节点，在将虚拟节点渲染到页面上
    callHook(vm,'beforeMounted')
    let updateComponent = () => {
        vm._update(vm_render());
    }
    // 这个watcher是用于渲染的，目前米有任何功能，目的就是让updateComponent执行
    new Watcher(vm,updateComponent,()=>{
        callHook(vm,'beforeUpdate')
    },true)
    vm._update(vm._render())
    callHook(vm,'mounted')
}
export function callHook(vm,hook) {
    const handlers = vm.$options[hook]// vm.$options.create = [a1,a2,a3]
    if(handlers) {
        for(let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm) // 更改生命周期的this
        }

    }
}