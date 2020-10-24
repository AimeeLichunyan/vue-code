import Dep from "./observer/dep.js";
import observe from "./observer/index.js";
import Watcher from "./observer/watcher.js";
import { nextTick, proxy } from "./utils.js";

// 状态的初始化;
export function initSate(vm) {
  // vue初始化的顺序就是：先初始化属性，在是方法，再是data
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethods(vm);
  }
  //   核心部分
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}
function initProps() {}
function initMethods() {}

function initData(vm) {
  let data = vm.$options.data;
  vm._data = data = typeof data == "function" ? data.call(vm) : data;
  //   数据的劫持方案： 对象object.defineProperty
  // 数组会单独处理

  // 实现代理 -- 当我去vm上取值是，帮我将属性的取值代理大vm._data上
  for(let key in data) {
    proxy(vm,'_data',key)
  }
  observe(data);
}
function initComputed(vm) {
  let computed = vm.$options.computed;
  const watchers = vm._computedWatchers = {};
  for(let key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef == 'function' ? userDef : userDef.get;
    watchers[key] = new Watcher(vm,getter,() =>{},{lazy:true})
    defineComputed(vm,key,userDef)
  }
}
function defineComputed(target,key,userDef) {
  // 这样直接写是没有缓存的
   const sharePropertyDefinition = {
     enumerable: true,
     configurable: true,
     get:()=>{},
     set:() => {}
   }
   if(typeof userDef == 'function') {
    //  createComputedGetter 高阶函数
    sharePropertyDefinition.get = createComputedGetter(key) // dirty 来控制是否调用
   }else {
    sharePropertyDefinition.get = createComputedGetter(key);
    sharePropertyDefinition.set = userDef.set
   }
   Object.defineProperty(target,key,userDef)

}
function createComputedGetter(key) {
  return function() { // 此方法是我们包装的方法，每次取值都会执行
    const watcher = this._computedWatchers[key] // 拿到属性对应的watcher
    
    if(watcher) { // 如果是脏数据就执行，可以认为是改变了就执行
      if(watcher.dirty) { // 默认就是脏的，
        watcher.evaluate()
      }
      if(Dep.target) { // 说明还有渲染watcher，一应该一并收集起来
        watcher.depend()
      }
      return watcher.value //默认返回watcher上存的值
    }
  }

}
function initWatch(vm) {
  let watch = vm.$options.watch;
  console.log(watch)
  for(let key in watch) {
    const handler = watch[key]; // handler的情况
    if(Array.isArray(handler)) { // 数组

    }else {
      createWatcher(vm,key,handler) // 字符串，对象，函数
    }
  }
}
function createWatcher(vm,exprOrFn,handler,options) {
  // options 可以用来标识，是用户的watcher
  if(typeof handler == 'object') {
    options = handler;
    handler = handler.handler
  }
  if(typeof handler == 'string') {
    handler = vm[handler]
  }
  return vm.$watch(exprOrFn,handler,options)
}
export function stateMixin(Vue) {
  Vue.prototype.$nextTick = function(cb) {
    console.log(cb)
    nextTick(cb)
  }
  Vue.prototype.$watch = function(exprOrFn,handler,options) {
   let watcher = new Watcher(vm, exprOrFn,cb,options) // 原理还是用的watcher
   if(options.immediate) {
    cb() // 如果是immediate，则是立即执行
   }
  }
}