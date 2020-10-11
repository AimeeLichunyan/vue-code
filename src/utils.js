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