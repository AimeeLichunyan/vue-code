export function patch(oldVnode,vnode) {
    // 默认在初始化时，直接用虚拟节点创建出来的真实的dom，替换掉老节点

    if(oldVnode.nodeType == 1) {
        // 将虚拟节点转化成真是节点
    // 递归生成
    // oldVnode是dom结构中真是的挂载点，<div id="app" style="color: red"></div>
    // vnode是产生的虚拟节点
    console.log(oldVnode,vnode)
    let el = createElm(vnode); // 将虚拟dom节点产生真实的dom结构
    let parentElm = oldVnode.parentNode; // 获取老的app的父级节点body
    parentElm.insertBefore(el,oldVnode.nextSibling); // 将当前的真实元素插入到app的后面
    parentElm.removeChild(oldVnode) // 删除老的app节点，即开始的真是dom挂载点
    }else {
        // 进行虚拟节点的比对
    // 在更新时，拿老的虚拟节点，和新的虚拟节点做对比，将不同的地方更新展示

    // 1. 比较两个元素的标签，标签不一样直接替换
    if(oldVnode.tag !== vnode.tag) {
        oldVnode.el.parentNode.replaceChild(createElm(vnode),oldVnode.el)
    }
    // 2. 标签一样，文本节点的虚拟节点tag都是undefined，
    if(!oldVnode.tag) { // 文本的比较
        if(oldVnode.text !== vnode.text) {
            return oldVnode.el.textContent = vnode.text
        }
    }
    // 3. 标签一样，并且需要开始比对标签的属性和子节点
    // 标签一样直接复用即可
    let el = vnode.el = oldVnode.el // 复用老节点
    // 更新属性，用新的虚拟节点的属性和老的比较，去更新节点
    // 新老属性做对比
    updateProperties(vnode.oldVnode.data);

    // 儿子的比较
    let oldChildren = oldVnode.children || [];
    let newChildren = vnode.children || [];

    if(oldChildren.length > 0 && newChildren.length > 0) {
    // 3. 老的有儿子，新的也有儿子，这才是真正的diff算法
        updateChildren(oldChildren,newChildren,el);
    }else if(oldChildren.length > 0) {
    // 1. 老的有儿子，新的没儿子
    el.innerHTML = ''

    }else if(newChildren.length > 0) {
    // 2. 老的没儿子，新的有儿子
        for(let i = 0; i < newChildren.length; i++) {
            let child = newChildren[i];
            // 浏览器有性能优化
            el.appendChild(createElm(child))
        }


    }

    }
    
}
function isSameVnode(oldVnode,newVnode) {
    return (oldVnode.tag == newVnode.tag) && (oldVnode.key == newVnode.key)

}
function updateChildren(oldChildren,newChildren,parent) {
    // diff算法的优化
    // dom操作中有很多常见的逻辑，会吧节点插入到当前儿子的头部，尾部，儿子倒叙正序
    // vue2中diff算法采用的是双指针的方式
    // 在尾部添加
    // 做一个循环，同时循环老的和新的，哪个先结束循环就停止，将多余的删除或者添加进去
    let oldStartIndex = 0; // 老的索引
    let oldStartVnode = oldChildren[0] // 老的索引指向的节点
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex]
    let newStartIndex = 0; // 老的索引
    let newStartVnode = newChildren[0] // 老的索引指向的节点
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[oldEndIndex]
    // 比较新的或者老的循环谁先停止，一个满足条件就停止
    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
       if(isSameVnode(oldStartVnode,newStartVnode)) {
        patch(oldStartVnode,newStartVnode) // 更新属性，和在去更新子节点
        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex]
       }  // 如果节点是相同的，则比较儿子
    }
    if(newStartIndex <= newEndIndex) {
        for(let i = newStartIndex; i<= newEndIndex; i++) {
            // 将新的多余的插入进去
            parent.appendChild(createElm(newChildren[i]))
        }
    }

}
export function createElm(vnode) {
    let {tag,children,key,data,text} = vnode;
    if(typeof tag == 'string' ) { //创建元素，放到vnode.el上
        vnode.el = document.createElement(tag);
        // 只有元素才有属性
        updateProperties(vnode)
        console.log('children',children)
        // children.forEach(child => { // 遍历儿子，将儿子渲染后的结构扔到父亲中
        //     vnode.el.appendChild(createElm(child))
        // })
    }else { // 创建文件，放到vnode.el上
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
// vue的渲染流程 1.初始化数据 2. 将模板进行编译成render函数，生成虚拟节点，生成真是的dom，渲染到页面

function updateProperties(vnode,oldProps={}) {
    // 新的有，直接用新的更新即可
    let newProps = vnode.data || {};
    let el = vnode.el

    // 老的有新的没有，直接删除属性
    for(let key in oldProps) {
        if(!newProps[key]) {
            el.removeAttribute(key)
        }
    }
    // 样式处理 老的style={color: red} 新的 style={background: red}
    let newStyle = newProps.style || {};
    let oldStyle = oldProps.style || {};
    // 老的样式中有，新的没有，删除老的样式
    for(let key in oldProps) {
        if(!newProps[key]) {
            el.style[key] = ''
        }
    }

    for(let key in newProps) {
        if(key == 'style') {
            for(let style in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        }else if(key == 'class') {
            el.className = newProps.class
        }else {
            el.setAttribute(key,newProps[key])
        }
    }
}