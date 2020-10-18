import { defineProperty } from "../utils";
import { arrayMethods } from "./array";
import Dep from "./dep";

// 数据观测的方法
class Observer {
  constructor(value) {
    this.dep = new Dep() // value = {},value = []添加dep
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
  // 获取到数组对应的dep
  let childDep = observe(value) // 递归进行检测，value是否是对象，只要对象层级比较深，就会不停的递归，影响性能，所以在vue3中使用proxy实现，vue3是懒递归
  let dep = new Dep() // 每个属性都有一个dep
  // 当前面取值时，说明这个值是用来渲染了，将这个watcher和这个属性对应起来
  Object.defineProperty(data, key, { // 其实是一个闭包，当前作用域下data不销毁
    get() {
      console.log('q取值')
      if(Dep.target) {
        dep.depend()
        if(childDep) {
          childDep.dep.depend() // 数组存起来了渲染watcher
        }
      }
      return value;
    },
    set(newValue) {
      console.log('设置')
      if (newValue == value) return; // 如果新值和老值一样则不赋值操作
      observe(newValue) // 判断设置的新的值是不是对象，如果用户将值改为对象，则继续监控
      value = newValue;
      dep.notify() //异步更新，防止多次渲染, dep和watcher是多对多的关系
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
  return new Observer(data); // 使用类的好处是方便识别当前这个属性属于哪个实例，只观测data中的数据
  // 数组中的长度和索引如法被监控
}
