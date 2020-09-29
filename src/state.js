import observe from "./observer/index.js";

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
  observe(data);
}
function initComputed() {}
function initWatch() {}
