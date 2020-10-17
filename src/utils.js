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