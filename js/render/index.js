/**
 * @description 渲染card模块的修饰内容
 * @param {*} config 
 */
function renderContentBox(config = {}) {
    let { border = true, background = true } = config
    let domInnerHTML = ''
    if (border) {
        domInnerHTML += `
            <div class="_border_left_top left0 top0"></div>
            <div class="_border_left_bottom left0 bottom0"></div>
            <div class="_border_right_top right0 top0"></div>
            <div class="_border_right_bottom right0 bottom0"></div>
        `
    }
    if (background) {
        domInnerHTML += `<div class="content-box-bg"></div>`
    }
    if (domInnerHTML) {
        let contentBoxs = document.getElementsByClassName(CARD_WRAP_NAME)
        for (let i = 0; i < contentBoxs.length; i++) {
            contentBoxs[i].innerHTML = domInnerHTML
        }
    }
}

/**
 * @description 根据config配置渲染对应的echarts可视化组件
 * @param {*} config 
 * @returns 
 */
function renderChartModule(config) {
    let domMap = renderContentBasic(config)
    if (!config.optDispatch) return
    let chartDom = document.getElementsByClassName(domMap.contentDomClass)[0]
    let myChart = echarts.init(chartDom)
    let option = config.optDispatch(config, myChart)

    myChart.setOption(option)
    window.addEventListener('resize', () => {
        myChart.resize()
    })

    // 回调方法执行
    if (config.render) {
        config.render(domMap, config)
    }
    if (config.onMouserover) {
        myChart.on('mouseover', (params) => {
            config.onMouserover(params, option, myChart)
        })
    }
    if (config.onMouserout) {
        myChart.on('mouseout', (params) => {
            config.onMouserout(params, option. myChart)
        })
    }
    if (config.onResize) {
        window.addEventListener('resize', () => {
            emptySubDom(domMap)
            config.onResize(domMap, config)
        })
    }
}

/**
 * @description 根据config配置渲染可视化组件之外的组件
 * @param {*} config 
 */
function renderOtherModule(config) {
    let domMap = renderContentBasic(config)

    if (config.render) {
        config.render(domMap, config)
    }
    if (config.onResize) {
        window.addEventListener('resize', () => {
            emptyAllDom(domMap)
            config.onResize(domMap, config)
        })
    }
}

/**
 * @description 渲染card模块标题并设置高度
 * @param {*} config
 * @returns 
 */
function renderContentBasic(config) {
    let { domHeight = 200, domId, renderBasic, renderTitle, name } = config
    let dom = document.getElementById(domId)
    let domInnerHTML = '', domWrapClassName = `${domId}-inner-wrap`
    let domWrap = document.getElementsByClassName(domWrapClassName)
    
    if (renderBasic === false) return renderBasic
    dom.style.height = `${domHeight / CONFIG.BASE_HEIGHT * 100}vh`

    if (renderTitle !== false) {
        domInnerHTML = `
            <div class="content-box-title-wrap ${domId}-title">
                <div class="content-box-title-icon"></div>
                <div class="content-box-title-text fontSize14">${name}</div>
            </div>
        `
    }

    domInnerHTML += `
        <div class="before-${domId}"></div>
        <div class="chart-wrap _${domId}"></div>
        <div class="after-${domId}"></div>
    `

    if (domWrap.length) {
        domWrap.innerHTML = domInnerHTML
    } else {
        domWrap = document.createElement('div')
        domWrap.className = `${domWrapClassName} content-box-inner-wrap`
        domWrap.innerHTML = domInnerHTML
        dom.appendChild(domWrap)
    }

    return {
        beforeDomClass: `before-${domId}`,
        contentDomClass: `_${domId}`,
        afterDomClass: `after${domId}`,
        titleClass: `${domId}-title`,
    }
}

/**
 * @description 用于window.resize时，清空节点，避免重复渲染
 * @param {'*'} classNameParams 
 */
function emptySubDom(classNameParams) {
    document.getElementsByClassName(classNameParams.beforeDomClass)[0].innerHTML = ''
    document.getElementsByClassName(classNameParams.afterDomClass)[0].innerHTML = ''
}

/**
 * @description 用于window.resize时，清空节点，避免重复渲染
 * @param {*} classNameParams 
 */
function emptyAllDom(classNameParams) {
    document.getElementsByClassName(classNameParams.beforeDomClass)[0].innerHTML = ''
    document.getElementsByClassName(classNameParams.afterDomClass)[0].innerHTML = ''
    document.getElementsByClassName(classNameParams.contentDomClass)[0].innerHTML = ''
}
