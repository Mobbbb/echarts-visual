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
    const labelCircleSemidiameter = 10, borderDiameterRate = 0.85
    const boxContentWidth = document.getElementById(domId).getElementsByClassName('chart-wrap')[0].clientWidth
    const boxContentHeight = document.getElementById(domId).getElementsByClassName('chart-wrap')[0].clientHeight
    // 获取图表容器最大内切直径
    const maxDiameter = boxContentWidth > boxContentHeight ? boxContentHeight : boxContentWidth
    // 文本标签引导线直径
    const borderDiameter = maxDiameter * borderDiameterRate
    // 引导线圆心坐标
    const circleCenterPonint = [boxContentWidth / 2, boxContentHeight / 2]

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
            let x = Math.floor(borderDiameter / 2 * Math.cos((Theta / 180) * Math.PI))
            let y = Math.floor(borderDiameter / 2 * Math.sin((Theta / 180) * Math.PI))
            // 坐标原点平移
            x = Math.floor(x + circleCenterPonint[0])
            y = Math.floor(Math.abs(y - circleCenterPonint[1]))
            // 自身中心点平移
            x = Math.floor(x - labelCircleSemidiameter)
            y = Math.floor(y - labelCircleSemidiameter)

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
            style="width: ${borderDiameter}px;
            height: ${borderDiameter}px;
            left: ${circleCenterPonint[0] - borderDiameter / 2}px;
            top: ${circleCenterPonint[1] - borderDiameter / 2}px;">
        </div>
        ${labelDom}
    `
}

const registerMap = () => {
    echarts.registerMap('ZJ-MAP', zhejiang)
}

const createCanvas = (config, size) => {
    const labelName = '示例数据：'
    const canvasFontSize = `${genVH(8)}px`
    const canvasTextSize = getTextSize(labelName, canvasFontSize)
    const { width: canvasTextWidth, height: canvasTextHeight } = canvasTextSize
    const { width, height } = size // 画布大小

    const { labelConfig = {}, data = [] } = config
    let canvasValueWidth = 0
    data.forEach(item => {
        let itemWidth = getTextSize(item, canvasFontSize).width
        canvasValueWidth = itemWidth > canvasValueWidth ? itemWidth : canvasValueWidth
    })

    const { position, firstPointOffsetX, firstPointOffsetY, secondPointLength } = labelConfig // 引导线配置

    let firstPoint = [] // 折线拐点坐标
    let secondPoint = [] // 横线末端坐标
    let thirdPoint = [] // 矩形左上角顶点坐标
    const textGap = genVMin(4) // 文本上线间距
    const rectPadding = [genVMin(4), genVMin(8), genVMin(8), genVMin(8)] // 文本容器的padding

    const rectWidth = canvasTextWidth + canvasValueWidth + rectPadding[1] + rectPadding[3] // 矩形宽度
    const rectHeight = canvasTextHeight * data.length + textGap * (data.length - 1) + rectPadding[0] + rectPadding[2] // 矩形高度

    if (position === 'left-top') {
        firstPoint = [width / 2 - firstPointOffsetX, height / 2 - firstPointOffsetY]
        secondPoint = [firstPoint[0] - secondPointLength, firstPoint[1]]
        thirdPoint = [width / 2 - rectWidth - firstPointOffsetX - secondPointLength, firstPoint[1] - rectHeight / 2, rectWidth, rectHeight]
    } else if (position === 'left-bottom') {
        firstPoint = [width / 2 - firstPointOffsetX, height / 2 + firstPointOffsetY]
        secondPoint = [firstPoint[0] - secondPointLength, firstPoint[1]]
        thirdPoint = [width / 2 - rectWidth - firstPointOffsetX - secondPointLength, firstPoint[1] - rectHeight / 2, rectWidth, rectHeight]
    } else if (position === 'right-top') {
        firstPoint = [width / 2 + firstPointOffsetX, height / 2 - firstPointOffsetY]
        secondPoint = [firstPoint[0] + secondPointLength, firstPoint[1]]
        thirdPoint = [width / 2 + firstPointOffsetX + secondPointLength, firstPoint[1] - rectHeight / 2, rectWidth, rectHeight]
    } else { // right-bototm
        firstPoint = [width / 2 + firstPointOffsetX, height / 2 + firstPointOffsetY]
        secondPoint = [firstPoint[0] + secondPointLength, firstPoint[1]]
        thirdPoint = [width / 2 + firstPointOffsetX + secondPointLength, firstPoint[1] - rectHeight / 2, rectWidth, rectHeight]
    }

    const canvas = createHiDPICanvas(width, height, 3)
    const ctx = canvas.getContext('2d')
    ctx.moveTo(width / 2, height / 2)
    ctx.lineTo(firstPoint[0], firstPoint[1])
    ctx.lineTo(secondPoint[0], secondPoint[1])

    // 矩形绘制
    ctx.strokeStyle = '#08d7e1'
    ctx.fillStyle = 'rgba(12, 46, 59, 0.7)'
    ctx.lineWidth = 1
    ctx.strokeRect(thirdPoint[0], thirdPoint[1], thirdPoint[2], thirdPoint[3])
    ctx.fillRect(thirdPoint[0], thirdPoint[1], thirdPoint[2], thirdPoint[3])
    ctx.stroke()
    
    // 文字内容绘制
    data.forEach((item, index) => {
        const textY = thirdPoint[1] + canvasTextHeight * (index + 1) + rectPadding[0] + textGap * index
        ctx.beginPath()
        ctx.font = `${canvasFontSize} Arial, "Microsoft Yahei"`
        ctx.fillStyle = '#fdfdfd'
        ctx.fillText(labelName, thirdPoint[0] + rectPadding[3], textY)
        ctx.stroke()
        ctx.beginPath()
        ctx.fillStyle = '#07cdf5'
        ctx.fillText(item, thirdPoint[0] + rectPadding[3] + canvasTextWidth, textY)
        ctx.stroke()
    })

    return canvas
}

const renderTransBar = (classNameParams, config) => {
    var domHeight = $(`.${classNameParams.contentDomClass}`)[0].clientHeight
    var contentHeight = domHeight * 0.7
    var totalNumWrapHeight = genVH(70)

    var dataArr = config.data.map(item => item.value)
    var totalNum = dataArr.reduce((prev, curr) => prev + curr)

    // 转化箭头渲染
    var customBarArrowWrap = '<div class="custom-bar-arrow-wrap">'
    config.data.forEach(item => {
        customBarArrowWrap += `
            <div style="position: relative;">
                <div class="custom-bar-arrow-label">
                    <span class="letter-spacing">标签</span>
                    <span style="color: #00eaff;font-size: 2.75vh;margin: 0 -2px;">${item.transValue}</span>
                    <span style="color: #00ebff;">人</span></div>
                <div class="custom-bar-arrow"></div>
            </div>
        `
    })
    customBarArrowWrap += '</div>'

    // 图例渲染
    var colorClass = ['yellow-point', 'green-point', 'blue-point']
    var legendWrap = '<div class="custom-bar-legend-wrap">'
    config.data.forEach((item, index) => {
        legendWrap += `
            <div class="custom-bar-legend-line">
                <div class="custom-bar-legend-point ${colorClass[index]}"></div>
                <div class="custom-bar-legend-title letter-spacing">${item.label}</div>
                <div class="custom-bar-legend-value">${item.value}人</div>
            </div>
        `
    })
    legendWrap += '</div>'
    
    $(`.${classNameParams.contentDomClass}`).append(`
        <div style="padding-top: ${totalNumWrapHeight}px;flex-shrink: 0;">
            ${renderCustomBar(contentHeight - totalNumWrapHeight, config.data)}
            <div class="total-num-wrap" style="height: ${totalNumWrapHeight}px;">
                <div class="total-num-left">${totalNum}人</div>
                <div class="custom-bar-legend-wrap">${legendWrap}</div>
            </div>
        </div>
        ${customBarArrowWrap}
        <div class="custom-bar-right-wrap">
            ${renderCustomBar(domHeight * 0.3, config.data)}
            ${renderCustomBar(domHeight * 0.3, config.data)}
            ${renderCustomBar(domHeight * 0.3, config.data)}
        </div>
    `)
}

const renderCustomBar = (totalHeight, data) => {
    var dataArr = data.map(item => item.value)
    var totalNum = dataArr.reduce((prev, curr) => prev + curr)
    var customBarWidth = genVW(64) // 柱宽
    var topBottomHeight = genVH(16) // 上下底高度
    var highlightHeight = totalHeight * 9 / 15 // 高亮条高度
    var valueTotalHeihgt = totalHeight - topBottomHeight

    var minBarHeight = topBottomHeight + 2 // 数据条最小高度
    var yellowBarHeight = data[0].value / totalNum * valueTotalHeihgt
    yellowBarHeight = yellowBarHeight < minBarHeight ? minBarHeight : yellowBarHeight
    var greenBarHeight = data[1].value / (data[1].value + data[2].value) * (valueTotalHeihgt - yellowBarHeight)
    greenBarHeight = greenBarHeight < minBarHeight ? minBarHeight : greenBarHeight
    var blueBarHeight = valueTotalHeihgt - yellowBarHeight - greenBarHeight
    blueBarHeight = blueBarHeight < minBarHeight ? minBarHeight : blueBarHeight
    
    const getCustomBar = ({ height, topHeight, color, zIndex }, data) => {
        var lineWidth = genVH(30)
        var lineHeight = genVH(25)
        var lineAngle = 30
        var pointLeft = Math.tan(Math.PI * lineAngle / 180) * (lineHeight / 2)
        var pointRadius = 1.5

        var textFontSize = '1.875vh'
        var textContent = `${data.label} ${data.value}人`
        var textConfig = getTextSize(textContent, textFontSize)
        var textGap = genVH(4)
        var lineGap = genVH(8)
        var mistakeHeight = genVH(5)
        return {
            dom: `
                <div class="custom-bar-item-wrap" style="height: ${topBottomHeight + height}px;width: ${customBarWidth}px;top: ${topHeight}px;z-index: ${zIndex};">
                    <div class="${color}-bar-top bar-top" style="height: ${topBottomHeight}px;"></div>
                    <div class="${color}-bar-middle bar-middle" style="height: ${height + mistakeHeight}px;top: ${topBottomHeight / 2}px;"></div>
                    <div class="${color}-bar-bottom bar-bottom" style="height: ${topBottomHeight}px;"></div>
                    <div class="custom-bar-label-wrap" style="right: -${lineWidth}px;top: ${(height + topBottomHeight) / 2 - lineHeight + lineGap}px;">
                        <div class="custom-bar-label-line" style="width: ${lineWidth}px;height: ${lineHeight}px;transform: skewX(-${lineAngle}deg);"></div>
                        <div class="custom-bar-line-point" style="left: -${pointLeft + pointRadius}px;top: ${lineHeight - pointRadius}px;
                            width: ${pointRadius * 2}px;height: ${pointRadius * 2}px;
                            border-radius: ${pointRadius}px;"></div>
                        <div class="custom-bar-label-text" style="top: -${textConfig.height + textGap}px;left: ${pointLeft + textGap}px;font-size: ${textFontSize};width: ${textConfig.width}px;">
                            <span class="custom-bar-label-title">${data.label}</span>
                            <span class="custom-bar-label-value">${data.value}人</span>
                        </div>
                    </div>
                </div>
            `,
            width: textConfig.width + textGap + pointLeft,
        }
    }

    var bar1 = getCustomBar({ height: yellowBarHeight, topHeight: 0, color: 'yellow', zIndex: 4 }, data[0])
    var bar2 = getCustomBar({ height: greenBarHeight, topHeight: yellowBarHeight, color: 'green', zIndex: 3 }, data[1])
    var bar3 = getCustomBar({ height: blueBarHeight, topHeight: yellowBarHeight + greenBarHeight, color: 'blue', zIndex: 2 }, data[2])

    var customBarWrapWidth = Math.max(bar1.width, bar2.width, bar3.width) + customBarWidth

    return `
        <div class="custom-bar-wrap" style="height: ${totalHeight}px;width: ${customBarWrapWidth}px;">
            ${bar1.dom}
            ${bar2.dom}
            ${bar3.dom}
            <div class="custom-bar-shadow" style="height: calc(100% - ${topBottomHeight}px);top: ${topBottomHeight / 2}px;width: ${customBarWidth}px;"></div>
            <div class="custom-bar-highlight" style="height: ${highlightHeight}px;top: ${(valueTotalHeihgt - highlightHeight) / 2 + topBottomHeight}px;"></div>
        </div>
    `
}
