(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  // 数据观测的方法
  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      //   使用defineProperty 重新定义属性
      this.walk(value);
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]); // Vue.utils.defineReactive
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    Object.defineProperty(data, key, {
      get: function get() {
        console.log("get");
        return value;
      },
      set: function set(newValue) {
        console.log("set");
        if (newValue == value) return; // 如果新值和老值一样则不赋值操作

        value = newValue;
      }
    });
  }

  function observe(data) {
    if (_typeof(data) !== "object" && data === null) {
      return;
    }

    return new Observer(data);
  }

  function initSate(vm) {
    // vue初始化的顺序就是：先初始化属性，在是方法，再是data
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) ; //   核心部分


    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = typeof data == "function" ? data.call(vm) : data; //   数据的劫持方案： 对象object.defineProperty
    // 数组会单独处理

    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 初始化状态（数据做初始化劫持，改变数据时应该更新视图）
      //  vue 组件中很多状态，data,props,watch,computed

      initSate(vm); // vue核心特性：响应式数据原理
      // Vue 是什么框架，MVVM（不完全是）怎么是？ 数据变化视图会更新，视图变化数据会被影响，
      // 怎么不是？ mvvm不能跳过数据直接更新视图，但是vue有$ref可以直接操作dom
    };
  }

  function Vue(options) {
    console.log(options);

    this._init(options);
  } //写成一个个的插件进行扩展，解耦方法
  // vue初始化方法


  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
