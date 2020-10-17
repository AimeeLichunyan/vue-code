export function patch(oldVnode,vnode) {
    // 将虚拟节点转化成真是节点
    // 递归生成
    // oldVnode是dom结构中真是的挂载点，<div id="app" style="color: red"></div>
    // vnode是产生的虚拟节点
    console.log(oldVnode,vnode)
    let el = createElm(vnode); // 将虚拟dom节点产生真实的dom结构
    let parentElm = oldVnode.parentNode; // 获取老的app的父级节点body
    parentElm.insertBefore(el,oldVnode.nextSibling); // 将当前的真实元素插入到app的后面
    parentElm.removeChild(oldVnode) // 删除老的app节点，即开始的真是dom挂载点
}
function createElm(vnode) {
    let {tag,children,key,data,text} = vnode;
    if(typeof tag == 'string' ) { //创建元素，放到vnode.el上
        vnode.el = document.createElement(tag);
        console.log('children',children)
        children.forEach(child => { // 遍历儿子，将儿子渲染后的结构扔到父亲中
            vnode.el.appendChild(createElm(child))
        })
    }else { // 创建文件，放到vnode.el上
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
// vue的渲染流程 1.初始化数据 2. 将模板进行编译成render函数，生成虚拟节点，生成真是的dom，渲染到页面