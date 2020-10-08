// 拿到数组原型的方法（或者拿到数组原来的方法）
let oldArrayProtoMethods = Array.prototype;

// 继承原来数组的方法 arrayMethods.__proto__ = oldArrayProtoMethods,继承以后可以重写，如果没有重写，则会顺着原型链找到原来数组的方法
export let arrayMethods = Object.create(oldArrayProtoMethods)
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]
// 这是个高阶函数或者叫切片编程
methods.forEach(method => {
    arrayMethods[method] = function(...args) { // this就是ob
        const result = oldArrayProtoMethods[method].apply(this,arguments)
        let inserted;
        let ob = this.__ob__
        switch (method) {
            case 'push': // arr.push({a:1},{b:2})
            case 'unshift': // push和unshift方法都是追加的,追加的内容可能是对象类型，应该再次进行劫持
                inserted = args
                break;
            case 'splice': // vue.$set实现的原理就是splice，删除，添加，修改
            inserted = args.slice(2) // arr.splice(0,1,{a:1})
            default:
                break;
        }
        if(inserted) ob.observeArray(inserted) // 给数组新增的值进行观测
        return result
    }
})