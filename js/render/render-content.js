/**
 * @description 渲染标题内容
 * @param {*} renderBasic 是否渲染基础样式
 * @param {*} config 配置
 */
const renderTitle = (renderBasic, config) => {
    let { domId, name } = config
    document.getElementById(domId).innerHTML = name
    document.title = name
}

/**
 * @description 渲染玫瑰图的标签引导线及标签
 * @param {*} classNameParams card子容器的类名
 * @param {*} config 配置
 */
const renderPieRoundLabel = (classNameParams, config) => {
    const { domId, data, startAngle = 0 } = config
    const widthRate = 1
    const boxContentWidth = document.getElementById(domId).getElementsByClassName('chart-wrap')[0].clientWidth
    const boxContentHeight = document.getElementById(domId).getElementsByClassName('chart-wrap')[0].clientHeight
    // 图表容器宽度
    const pieContentWidth = boxContentWidth * widthRate
    // 获取图表容器最大内切半径
    const minRadius = pieContentWidth > boxContentHeight ? boxContentHeight : pieContentWidth
    // 文本标签引导线直径
    const borderWidth = minRadius * 0.85
    // 引导线圆心坐标
    const circleCenterPonint = [pieContentWidth / 2, boxContentHeight / 2]

    let totalNum = 0, labelDom = '', maxValue = 0
    data.forEach(item => {
        totalNum += item.value
        maxValue = item.value > maxValue ? item.value : maxValue
    })

    if (totalNum) {
        let sumAngle = 0, percent = 100
        data.forEach((item, index) => {
            // 逆时针计算
            const reverseItem = data[data.length - index - 1]
            // 计算扇形中线的极角（减去起始转动的偏差值）
            let Theta = 360 * (sumAngle + reverseItem.value / 2) / totalNum + startAngle
            if (Theta > 360) Theta = Theta - 360
            // 转化为直角坐标
            let x = Math.floor(borderWidth / 2 * Math.cos((Theta / 180) * Math.PI))
            let y = Math.floor(borderWidth / 2 * Math.sin((Theta / 180) * Math.PI))
            // 坐标原点平移
            x = Math.floor(x + circleCenterPonint[0])
            y = Math.floor(Math.abs(y - circleCenterPonint[1]))
            // 自身中心点平移
            x = Math.floor(x - 10)
            y = Math.floor(y - 10)

            let currentPercent = Math.round(reverseItem.value * 100 / totalNum)
            if (index < config.data.length - 1) {
                percent -= currentPercent
            } else {
                // 防止最终所有百分比累加值超过100
                currentPercent = percent < 0 ? 0 : percent
            }

            labelDom += `
                <div class="rose-pie-label-wrap" style="left: ${x}px;top: ${y}px;">
                    <span class="rose-pie-label fontSize8">${currentPercent}%</span>
                </div>
            `
            // 累加之前的扇形角度
            sumAngle += reverseItem.value
        })
    }

    document.getElementsByClassName(classNameParams.beforeDomClass)[0].innerHTML = `
        <div class="rose-pie-label-line" 
            style="width: ${borderWidth}px;
            height: ${borderWidth}px;
            left: ${circleCenterPonint[0] - borderWidth / 2}px;
            top: ${circleCenterPonint[1] - borderWidth / 2}px;">
        </div>
        ${labelDom}
    `
}
