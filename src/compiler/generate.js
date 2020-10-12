const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// dom结构转换成js语法
function genProps(attrs) {
    let str = '';
    for(let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if(attr.name === 'style') {
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key,value] = item.split(':');
                obj[key] = value
            })
            attr.value = obj
        }
        str += `${attr.name} : ${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0,-1)}}`

}
function gen(node) {
    if(node.type == 1) {
        return generate(node) // 生成元素节点的字符串
    } else {
        let text = node.text
        // 如果是普通文本，不带{{}}
        if(!defaultTagRE.test(text)) {
        return `_v(${JSON.stringify(text)})`

        }
        let tokens = [];
        let lastIndex = defaultTagRE.lastIndex = 0
        let match,index;
        while(match = defaultTagRE.exec(text)) {
            index = match.index; // 保存匹配到的索引
            if(index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex,index)))
            }
            tokens.push(`_s(${match[1].trim()})`);
            lastIndex = index + match[0].length
        }
        if(lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_v(${tokens.join('+')})`
    }
}
function getChildren(el) {
    const children = el.children;
    if(children) { // 将所有转化后的儿子，用逗号拼接
        return children.map(child => gen(child)).join(',')
    }
}
export function generate(el) {
    let children = getChildren(el)
    let code= `_c('${el.tag}',${el.attrs.length?`${genProps(el.attrs)}`: 'undefined'}${children?`,${children}`:''})`

    return code
}   