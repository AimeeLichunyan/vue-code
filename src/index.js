import { initMixin } from "./init";
function Vue(options) {
  console.log(options);
  this._init(options);
}
//写成一个个的插件进行扩展，解耦方法
// vue初始化方法
initMixin(Vue);
export default Vue;
