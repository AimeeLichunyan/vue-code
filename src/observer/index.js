import { defineProperty } from "../utils";
import { arrayMethods } from "./array";

// 数据观测的方法
class Observer {
  constructor(value) {
    // 使用defineProperty重新定义属性，
    // 判断一个对象是否被观测过，看它有没有__ob__这个属性
    defineProperty(value,'__ob__',this)
    
    // 判断是否是数组
    if(Array.isArray(value)) {
      // 调用push，shift，unshift,splice,sort,reverse,pop等操作
      // 函数劫持，或者切片编程
      value.__proto__ = arrayMethods
      // 观测数组中的对象类型，对象变化触发一些操作
      this.observeArray(value)
    }else {
      //   使用defineProperty 重新定义属性
    this.walk(value);
    }
    
  }
  observeArray(value) {
    value.forEach(item => {
      observe(item)
    })
  }
  walk(data) {
    let keys = Object.keys(data);
    keys.forEach((key) => {
      defineReactive(data, key, data[key]); // Vue.utils.defineReactive
    });
  }
}
function defineReactive(data, key, value) {// 为每一个对象添加defineProperty，getset函数，进行数据劫持
  observe(value) // 递归进行检测，value是否是对象，只要对象层级比较深，就会不停的递归，影响性能，所以在vue3中使用proxy实现，vue3是懒递归
  Object.defineProperty(data, key, { // 其实是一个闭包，当前作用域下data不销毁
    get() {
      console.log('q取值')
      return value;
    },
    set(newValue) {
      console.log('设置')
      if (newValue == value) return; // 如果新值和老值一样则不赋值操作
      observe(newValue) // 判断设置的新的值是不是对象，如果用户将值改为对象，则继续监控
      value = newValue;
    },
  });
}
export default function observe(data) {
  if (typeof data !== "object" || data === null) {
    return data;
  }
  if(data.__ob__) {
    return data;
  }
  return new Observer(data);
}
