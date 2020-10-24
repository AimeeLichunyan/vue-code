let id = 0;
class Dep {
    constructor() {
        this.subs = [];
        this.id = id++
    }
    depend() {
        // 希望watcher可以存放dep
        Dep.target.addDep(this);// 可以实现watcher和dep的双向记忆
        // this.subs.push(Dep.target)
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}
Dep.target = null;
let stack = []// 设置一个栈，将watcher进行存储
export function pushTarget(watcher) {
    Dep.target = watcher // 保留watcher
    stack.push(watcher) // 有渲染watcher 和其他watcher进行存储;渲染watcher和计算属性watcher
}
export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1] // 删除变量
}
// 多对多的关系，一个属性有一个dep是用收集watcher的
// dep 可以存多个watcher
export default Dep