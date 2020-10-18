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
export function pushTarget(watcher) {
    Dep.target = watcher // 保留watcher
}
export function popTarget() {
    Dep.target = null // 删除变量
}
// 多对多的关系，一个属性有一个dep是用收集watcher的
// dep 可以存多个watcher
export default Dep