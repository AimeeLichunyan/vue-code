import { generate } from "./generate"
// <div id="my">hello {{name}} <span>world</span> </div>
// {
//     tag: 'div',
//     parent: null,
//     type:1,
//     attrs: [],
//     children: [{
//         tag:null,
//         parent: div,父

import { parseHTML } from "./parse"

//     }]
// }

export function compileToFunctions(template) {
    // console.log(template)
    // 将html模板 =》 render函数
    // ast语法树
    // 1.将html代码转化成ast语法树，可以用ast树描述语言本身
    // 前端必须掌握的数据结构===树
    // 优化静态节点
    let ast = parseHTML(template)
    // 2. 优化静态节点
    // console.log(ast)
    // 3. 通过ast树重新生成代码
    let code= generate(ast)
    console.log(code)
    // 4. 将字符串转换成函数,限制取值范围，通过with来进行取值。调用render函数可以通过改变this，让这个函数内部渠道结果
   let render  =  new Function(`with(this){return ${code}}`)

    // console.log(render)
    return render
    // 虚拟dom是用对象来描述节点，ast也可以描述js余元

    
}