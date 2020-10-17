(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

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
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'updated', 'beforeDestroy', 'destroyed'];
  var starts = [];

  starts.data = function (parentVal, childVal) {
    console.log(parentVal, childVal);
  };

  starts.computed = function () {};

  starts.watch = function () {};

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal); //父子进行拼接
      } else {
        return [childVal]; // 将儿子转化成一个数组
      }
    } else {
        return parentVal; // 不合并采用父级
      }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    starts[hook] = mergeHook;
  });
  function mergeOptions(parent, child) {
    var options = {}; // 遍历父亲，可能父亲有，儿子没有；父亲和儿子都有的在这里处理

    for (var key in parent) {
      console.log('1', key);
      mergeField(key);
    } // 遍历儿子，儿子有父亲没有


    for (var _key in child) {
      console.log('2', _key);
      mergeField(_key);
    }

    function mergeField(key) {
      // console.log(key)
      if (starts[key]) {
        options[key] = starts[key](parent[key], child[key]); // 主要一下
      } else {
        options[key] = child[key];
      }
    }

    return options;
  }

  function initGlobalApi(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      // console.log(mixin)
      this.options = mergeOptions(this.options, mixin);
      console.log(this.options); // this.options = {created:[a,b,c]}
    };
  } // 合并对象，只考虑生命周期，不考虑watch，computed
  // function mergeOptions() {
  // }

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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // dom结构转换成js语法

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, " : ").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(node) {
    if (node.type == 1) {
      return generate(node); // 生成元素节点的字符串
    } else {
      var text = node.text; // 如果是普通文本，不带{{}}

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      }

      var tokens = [];
      var lastIndex = defaultTagRE.lastIndex = 0;
      var match, index;

      while (match = defaultTagRE.exec(text)) {
        index = match.index; // 保存匹配到的索引

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function getChildren(el) {
    var children = el.children;

    if (children) {
      // 将所有转化后的儿子，用逗号拼接
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }

  function generate(el) {
    var children = getChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名，比如<aa-aa></aa-aa>
  // ?匹配不捕获 my:xx 

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  function parseHTML(html) {
    function creatAstElement(tagName, attrs) {
      return {
        tag: tagName,
        children: [],
        attrs: attrs,
        type: 1,
        //类型，本文还是标签
        parent: null // 父级元素

      };
    }

    var root;
    var currentParent;
    var stack = []; // 校验标签是否合法

    function start(tagName, attrs) {
      var element = creatAstElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    }

    function end(tagName) {
      // 在结尾标签处，创建父子关系
      var element = stack.pop(); //取出栈中的最后一个元素

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        // 在闭合时，知道这个标签的父级是哪个
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, "");

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    while (html) {
      //只要html不为空，则一直解析
      var textEnd = html.indexOf('<'); // indexOf如果没有返回-1，如果有返回元素的位置

      if (textEnd == 0) {
        var startTagMatch = parseStartTag(); //开始标签匹配的结果

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]); // 将结束标签传入

          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        // 如果是文本
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      } // break

    }

    function advance(n) {
      // 将字符串进行截取操作，再更新html内容
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 删除开始标签
        // 如果是闭合标签，说明没有属性

        var _end;

        var attr; // 不是结束标签，能匹配到属性

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        } // console.log(html)

      }
    }

    return root;
  }

  // {
  //     tag: 'div',
  //     parent: null,
  //     type:1,
  //     attrs: [],
  //     children: [{
  //         tag:null,
  //         parent: div,父
  //     }]
  // }

  function compileToFunctions(template) {
    // console.log(template)
    // 将html模板 =》 render函数
    // ast语法树
    // 1.将html代码转化成ast语法树，可以用ast树描述语言本身
    // 前端必须掌握的数据结构===树
    // 优化静态节点
    var ast = parseHTML(template); // 2. 优化静态节点
    // console.log(ast)
    // 3. 通过ast树重新生成代码

    var code = generate(ast);
    console.log(code); // 4. 将字符串转换成函数,限制取值范围，通过with来进行取值。调用render函数可以通过改变this，让这个函数内部渠道结果

    var render = new Function("with(this){return ".concat(code, "}")); // console.log(render)

    return render; // 虚拟dom是用对象来描述节点，ast也可以描述js余元
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
    };
  }
  function mountComponent(vm, el) {
    // 调用render方法去渲染el属性
    // 先调用render方法，创建虚拟节点，在将虚拟节点渲染到页面上
    callHook(vm, 'beforeMounted');

    vm._update(vm._render());

    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook]; // vm.$options.create = [a1,a2,a3]

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm); // 更改生命周期的this
      }
    }
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

    return new Observer(data); // 使用类的好处是方便识别当前这个属性属于哪个实例，只观测data中的数据
    // 数组中的长度和索引如法被监控
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

      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, 'beforeCreate');
      initSate(vm);
      callHook(vm, 'created'); // vue核心特性：响应式数据原理
      // Vue 是什么框架，MVVM（不完全是）怎么是？ 数据变化视图会更新，视图变化数据会被影响，
      // 怎么不是？ mvvm不能跳过数据直接更新视图，但是vue有$ref可以直接操作dom
      // 如果有el属性，说明要渲染模板

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    }; // 渲染的时候，先找render，template,外部template（这些都要是el存在的时候）


    Vue.prototype.$mount = function (el) {
      // 挂载操作
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);
      vm.$el = el;

      if (!options.render) {
        // 没有render方法，将template转化成render方法
        var template = options.template;

        if (!template && el) {
          // 没有tamplatet，有el，直接采用外部模板，即我们平时的写法
          template = el.outerHTML; // el.outerHTML拿到el所在的html元素
        } // 编译原理，将模板编译成render函数
        // 1. 处理模板变为ast树深度遍历， 2.标记静态节点，可以减少比对，提高性能，3. codegen-render函数生成，用了树和栈 4： new funtion+with（抛出render函数）


        var render = compileToFunctions(template); // 将dom结构编译成函数

        options.render = render;
      } // options.render
      // console.log(options.render) // 渲染时用的都是这个render方法
      // 需要挂载这个组件


      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      //创建虚拟dom元素
      return createElement.apply(void 0, arguments);
    }; // 1. 当结果是对象时，会对这个对象取值


    Vue.prototype._s = function (val) {
      // stringify
      return val == null ? '' : _typeof(val) == 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._v = function (text) {
      // 创建虚拟dom文本元素
      return createTextVnode(text);
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, children);
  }

  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  } // 用于产生虚拟dom，可以创建一些自定义属性


  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function Vue(options) {
    this._init(options); // 组件初始化的入口

  } //写成一个个的插件进行扩展，解耦方法
  // vue初始化方法
  // 原型方法


  initMixin(Vue); // init方法

  lifecycleMixin(Vue); // 混合生命周期，渲染dom _update

  renderMixin(Vue); // _render
  // 静态方法Vue.component,Vue.directive,Vue.extend,Vue.mixin

  initGlobalApi(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
