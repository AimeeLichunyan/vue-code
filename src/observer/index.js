// 数据观测的方法
class Observer {
  constructor(value) {
    //   使用defineProperty 重新定义属性
    this.walk(value);
  }
  walk(data) {
    let keys = Object.keys(data);
    keys.forEach((key) => {
      defineReactive(data, key, data[key]); // Vue.utils.defineReactive
    });
  }
}
function defineReactive(data, key, value) {
  Object.defineProperty(data, key, {
    get() {
      console.log("get");
      return value;
    },
    set(newValue) {
      console.log("set");
      if (newValue == value) return; // 如果新值和老值一样则不赋值操作
      value = newValue;
    },
  });
}
export default function observe(data) {
  if (typeof data !== "object" && data === null) {
    return;
  }
  return new Observer(data);
}
