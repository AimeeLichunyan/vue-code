export function proxy(vm,data,key) {
    Object.defineProperty(vm,key,{
      get() {
        return vm[data][key];
      },
      set(newValue) {
        vm[data][key] = newValue
      }
    })
  }
  export function defineProperty(target,key,value) {
    Object.defineProperty(target,key,{
        enumerable:false, // 不能被，枚举，不能被循环出来
        configurable:false,
        value: value
      })
  }
  export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'updated',
    'beforeDestroy',
    'destroyed'
  ]
  const starts = [];
  starts.data = function(parentVal,childVal) {
    console.log(parentVal,childVal)
  }
  starts.computed = function() {

  }
  starts.watch = function() {

  }
  function mergeHook(parentVal,childVal) {
    if(childVal) {
      if(parentVal) {
        return parentVal.concat(childVal) //父子进行拼接
      }else {
        return [childVal] // 将儿子转化成一个数组
      }
    }else {
      return parentVal // 不合并采用父级
    }
  }
  LIFECYCLE_HOOKS.forEach(hook => {
    starts[hook] = mergeHook
  })
  export function mergeOptions(parent,child) {
    const options = {}
    // 遍历父亲，可能父亲有，儿子没有；父亲和儿子都有的在这里处理
    for (let key in parent) {
      console.log('1',key)
      mergeField(key)
    }
    // 遍历儿子，儿子有父亲没有
    for(let key in child) {
      console.log('2',key)
      mergeField(key)
    }
    function mergeField(key) {
      // console.log(key)
      if(starts[key]) {
        options[key]=starts[key](parent[key],child[key]) // 主要一下

      }else {
        options[key] = child[key]
      }
    }
    return options;
  }
  const callBacks = [];
  let pending = false // 批量处理的标志位
  function flushCallbacks() {
    callBacks.forEach(cb => cb())
    pending = false
    callBacks = []
  }
  let timerFunc;
  if(Promise) {
    timerFunc = () => {
      Promise.resolve().then(flushCallbacks)
    }
  }else if(MutationObserver) { // 不支持promise,可监控dom的变化，监控完毕后异步更新
    let observe = new MutationObserver(flushCallbacks);
    let textNode = document.createTextNode(1); // 创建一个文本节点
    observe.observe(textNode,{characterData:true}); // 观测文本节点中的内容
    timerFunc = () => {
      textNode.textContent = 2
    }
  }else if(setImmediate) {
    timerFunc = () => {
      setImmediate(flushCallbacks)
    }
  }else {
    timerFunc = () => {
      setTimeout(flushCallbacks)
    }
  }
  export function nextTick(cb) { // 核心就是异步
    callBacks.push(cb)
    // vue3 nextTick原理就是用的promise.then 没有做兼容处理
    if(!pending) {
    timerFunc(); // 这个方法是异步的，做了兼容处理
      pending = true
    }
  }