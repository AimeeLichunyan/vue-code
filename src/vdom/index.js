export function renderMixin(Vue) {
    Vue.prototype._c = function() { //创建虚拟dom元素
        return createElement(...arguments)
    }
    // 1. 当结果是对象时，会对这个对象取值
    Vue.prototype._s = function(val) { // stringify
        return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val): val
    }
    Vue.prototype._v = function(text) { // 创建虚拟dom文本元素
        return createTextVnode(text)
    }
    Vue.prototype._render = function() {
        const vm = this;
        const render = vm.$options.render;
        let vnode = render.call(vm);
        return vnode;
    }
}
function createElement(tag,data={},...children) {
    return vnode(tag,data,children)
}
function createTextVnode(text) {
    return vnode(undefined,undefined,undefined,undefined,text)
}
// 用于产生虚拟dom，可以创建一些自定义属性
function vnode(tag,data,key,children,text) {
    return {
        tag,
        data,
        key,
        children,
        text,
    }
}