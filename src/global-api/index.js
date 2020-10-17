import { mergeOptions } from "../utils";

export function initGlobalApi(Vue) {
    Vue.options = {};
    Vue.mixin = function(mixin) {
        // console.log(mixin)
        this.options = mergeOptions(this.options,mixin)
        console.log(this.options) // this.options = {created:[a,b,c]}
    }
}
// 合并对象，只考虑生命周期，不考虑watch，computed
// function mergeOptions() {

// }