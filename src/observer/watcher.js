import { nextTick } from "../utils";

let id = 0;
class Watcher {
    constructor(vm,exprOrFn,cb,options) {
        this.vm = vm, // vm实例
        this.exprOrFn = exprOrFn; // exprOrFn vm._update()
        this.cb = cb;
        this.options = options
        this.user = options.user;
        this.lazy = options.lazy //如果watcher上有lazy属性，说明就是一个计算属性
        this.dirty = this.lazy // dirty代表取值时是否执行用户提供的方法
        this.id = id++ // watcher的唯一标识
        this.deps = [];
        this.depsId = new Set()
        if(typeof exprOrFn == 'function'){
            this.getter = exprOrFn
        }else {
            this.getter = function() {
                let path = exprOrFn.split('.');
                let obj = vm;
                for(let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj
            }
        }
        // 默认会调用一次get方法，进行取值，将结果保留下来
        this.value = this.lazy ? void 0 : this.get()
    }
    addDep(dep) {
        let id = dep.id;
        if(!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id);
            dep.addSub(this)
        }
    }
    get() {
        pushTarget(this) // 当前watcher实例
        let result = this.getter.call(this.vm) // 调用exprOrFn，渲染页面取值，要调用get方法，render方法 with(vm){_v(msg)}
        popTarget() // 渲染完成后，将watcher删除掉
        return result
    }
    update() {
        if(this.lazy) { // 是计算属性
            this.dirty = true; // 页面重新渲染就可以获得最新的值了
        }else {
            // 这里不要每次都调用get方法，get方法会重新渲染页面
            queueWatcher(this)
            //    this.get() 
        }
        
    }
    evaluate() { // 求值的时候执行
        this.value = this.get();
        this.dirty = false // 取过一次值之后，就表示已经取过值了

    }
    depend() {
        // 计算属性watcher，会存储dep，dep会存储watcher
        // 通过watcher找到对应的所有dep，让所有的
        let i= this.deps.length;
        while(i--){
            this.deps[i].depend(); // 让dep去存储渲染watcher
        }
    }
}
function flushSchedulerQueue() {
    queue.forEach(watcher => {
        watcher.run()
        queue = [];
        has = {}
        pending = false
    })
}
let queue = []; // 将需要批量更新的watcher存到一个队列中，稍后让watcher执行
let has = {}
let pending = false;
function queueWatcher(watcher) {
    console.log(watcher.id)
    const id = watcher.id // 对watcher进行去重
    if(has[id] == null) {
        queue.push(watcher) // 将watcher存到队列中
        has[id] =  true;
        if(!pending) { // 如果没有清空队列就不要开启定时器 防抖处理
            // 等待所有的同步代码执行完毕以后再执行
            nextTick(flushSchedulerQueue)
            // setTimeout(() => { 
                
            // },0)
        }
    }
}
export default Watcher
// 在数据劫持时，定义defineProperty的时候，已经给每个属性增加了一个dep
// 1. 吧渲染watcher放到Dep.target属性上，
// 2. 开始渲染，取值会调用get方法，需要让这个属性的dep、存储当前的watcher
// 3. 页面上所需要的属性都会讲这个watcher存在自己的dep中
// 4. 属性更新时，会重新调用渲染逻辑，通知自己存储的watcher来更新