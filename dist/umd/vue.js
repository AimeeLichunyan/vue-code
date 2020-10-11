(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    function compileToFunctions(template) {
      console.log(template);
    }

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

    function proxy(vm, data, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[data][key];
        },
        set: function set(newValue) {
          vm[data][key] = newValue;
        }
      });
    }
    function defineProperty(target, key, value) {
      Object.defineProperty(target, key, {
        enumerable: false,
        // 不能被，枚举，不能被循环出来
        configurable: false,
        value: value
      });
    }

    // 拿到数组原型的方法（或者拿到数组原来的方法）
    var oldArrayProtoMethods = Array.prototype; // 继承原来数组的方法 arrayMethods.__proto__ = oldArrayProtoMethods,继承以后可以重写，如果没有重写，则会顺着原型链找到原来数组的方法

    var arrayMethods = Object.create(oldArrayProtoMethods);
    var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']; // 这是个高阶函数或者叫切片编程

    methods.forEach(function (method) {
      arrayMethods[method] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        // this就是ob
        var result = oldArrayProtoMethods[method].apply(this, arguments);
        var inserted;
        var ob = this.__ob__;

        switch (method) {
          case 'push': // arr.push({a:1},{b:2})

          case 'unshift':
            // push和unshift方法都是追加的,追加的内容可能是对象类型，应该再次进行劫持
            inserted = args;
            break;

          case 'splice':
            // vue.$set实现的原理就是splice，删除，添加，修改
            inserted = args.slice(2);
        }

        if (inserted) ob.observeArray(inserted); // 给数组新增的值进行观测

        return result;
      };
    });

    var Observer = /*#__PURE__*/function () {
      function Observer(value) {
        _classCallCheck(this, Observer);

        // 使用defineProperty重新定义属性，
        // 判断一个对象是否被观测过，看它有没有__ob__这个属性
        defineProperty(value, '__ob__', this); // 判断是否是数组

        if (Array.isArray(value)) {
          // 调用push，shift，unshift,splice,sort,reverse,pop等操作
          // 函数劫持，或者切片编程
          value.__proto__ = arrayMethods; // 观测数组中的对象类型，对象变化触发一些操作

          this.observeArray(value);
        } else {
          //   使用defineProperty 重新定义属性
          this.walk(value);
        }
      }

      _createClass(Observer, [{
        key: "observeArray",
        value: function observeArray(value) {
          value.forEach(function (item) {
            observe(item);
          });
        }
      }, {
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
      // 为每一个对象添加defineProperty，getset函数，进行数据劫持
      observe(value); // 递归进行检测，value是否是对象，只要对象层级比较深，就会不停的递归，影响性能，所以在vue3中使用proxy实现，vue3是懒递归

      Object.defineProperty(data, key, {
        // 其实是一个闭包，当前作用域下data不销毁
        get: function get() {
          console.log('q取值');
          return value;
        },
        set: function set(newValue) {
          console.log('设置');
          if (newValue == value) return; // 如果新值和老值一样则不赋值操作

          observe(newValue); // 判断设置的新的值是不是对象，如果用户将值改为对象，则继续监控

          value = newValue;
        }
      });
    }

    function observe(data) {
      if (_typeof(data) !== "object" || data === null) {
        return data;
      }

      if (data.__ob__) {
        return data;
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
      // 实现代理 -- 当我去vm上取值是，帮我将属性的取值代理大vm._data上

      for (var key in data) {
        proxy(vm, '_data', key);
      }

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
        // 如果有el属性，说明要渲染模板

        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      };

      Vue.prototype.$mount = function (el) {
        // 挂载操作
        var vm = this;
        var options = vm.$options;
        el = document.querySelector(el);

        if (!options.render) {
          // 没有render方法，将template转化成render方法
          var template = options.template;

          if (!template && el) {
            // 没有tamplatet，有el，直接采用外部模板，即我们平时的写法
            template = el.outerHTML; // el.outerHTML拿到el所在的html元素
          } // 编译原理，将模板编译成render函数


          var render = compileToFunctions(template); // 将dom结构编译成函数

          options.render = render;
        }

        console.log(options.render); // 渲染时用的都是这个render方法
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
