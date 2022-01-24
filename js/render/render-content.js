/**
 * @description 渲染标题内容
 * @param {*} title 
 */
 function renderTitle(renderBasic, config) {
    let { domId, name } = config
    document.getElementById(domId).innerHTML = name
    document.title = name
}
