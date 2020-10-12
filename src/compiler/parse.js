const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名，比如<aa-aa></aa-aa>
// ?匹配不捕获 my:xx 
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >


export function parseHTML(html) {

    function creatAstElement(tagName,attrs) {
        return {
            tag: tagName,
            children: [],
            attrs,
            type: 1, //类型，本文还是标签
            parent: null,// 父级元素
        }
    }
    let root;
    let currentParent;
    let stack = []
    // 校验标签是否合法
    function start(tagName,attrs) {
        let element = creatAstElement(tagName,attrs)
        if(!root) {
            root = element
        }
        currentParent = element
        stack.push(element)
    }
    function end(tagName) { // 在结尾标签处，创建父子关系
        let element = stack.pop(); //取出栈中的最后一个元素
        currentParent = stack[stack.length - 1];
        if(currentParent) { // 在闭合时，知道这个标签的父级是哪个
            element.parent = currentParent
            currentParent.children.push(element)
        }
    }
    function chars(text) {
        text = text.replace(/\s/g,"");
        if(text) {
            currentParent.children.push({
                type:3,
                text
            })
        }
    }



    while(html) { //只要html不为空，则一直解析
        let textEnd = html.indexOf('<') // indexOf如果没有返回-1，如果有返回元素的位置
        if(textEnd == 0) {
            const startTagMatch =  parseStartTag(); //开始标签匹配的结果
            if(startTagMatch) {
                start(startTagMatch.tagName,startTagMatch.attrs)
                continue
            }
            const endTagMatch =  html.match(endTag)
            if(endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]) // 将结束标签传入
                continue
            }
        }
        let text;
        if(textEnd > 0) {// 如果是文本
            text = html.substring(0,textEnd);
        }
        if(text) {
            advance(text.length)
            chars(text);
        }
        // break
    }
    function advance(n) { // 将字符串进行截取操作，再更新html内容
        html = html.substring(n)
    }
    function parseStartTag() {
        const start = html.match(startTagOpen);
        if(start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length) // 删除开始标签
            // 如果是闭合标签，说明没有属性
            let end ;
            let attr
            // 不是结束标签，能匹配到属性
            while(!(end=html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({name: attr[1],value:attr[3] || attr[4]|| attr[5]})
                advance(attr[0].length)
            }
            if(end) {
                advance(end[0].length);
                return match
            }
            // console.log(html)
        }
    }

    return root;
}
