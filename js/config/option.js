const getCardOpt1 = (config, chart) => {
    const nameRich = 'name'
    const valueRich = 'value'
    const circleRich = 'circle'
    const colorList = ['#f6dc00', '#00f97d', '#00e3f0', '#4f68f0', '#7418ce', '#fc5800']
    let accTotal = 0, accList = [], colorMap = {}
    let totalNum = eval(config.data.map(item => item.value).join('+'))
    config.data.forEach((item, index) => {
        item.itemStyle = {
            color: colorList[index % 6],
        }
        colorMap[`${circleRich}${index}`] = {
            backgroundColor: colorList[index],
            width: genVH(5),
            height: genVH(5),
            borderRadius: genVH(5),
        }
    })

    return {
        tooltip: {
            show: false,
        },
        legend: {
            show: false,
        },
        series: [
            {
                name: 'Ring',
                type: 'pie',
                startAngle: 90,
                radius: ['50%', '65%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    formatter: (params) => {
                        if (!accList.includes(params.name)) {
                            let preItem = config.data[params.dataIndex - 1]
                            if (preItem) {
                                accTotal += (params.data.value + preItem.value) / 2
                            } else {
                                accTotal += params.data.value / 2
                            }
                            accList.push(params.name)
                        }
                        if (params.dataIndex === config.data.length - 1) {
                            accTotal = 0
                            accList = []
                        }
                        if (accTotal > totalNum / 2 || params.dataIndex === config.data.length - 1) { // 左侧数据
                            return `{${circleRich}${params.dataIndex}|}` + 
                                    `{${nameRich}| ${params.data.name}}\n` + 
                                    `  {${valueRich}|${params.data.value}}`
                        } else { // 右侧数据
                            return `{${nameRich}|${params.data.name} }` + 
                                    `{${circleRich}${params.dataIndex}|}\n` + 
                                    `{${valueRich}|${params.data.value}}  `
                        }
                    },
                    lineHeight: genVH(18),
                    rich: {
                        ...colorMap,
                        name: {
                            fontSize: genVH(10),
                            color: '#fdfeff',
                        },
                        value: {
                            fontSize: genVH(10),
                            color: '#00b9eb',
                        },
                    }
                },
                labelLine: {
                    length: 20,
                    length2: 0,
                    maxSurfaceAngle: 80,
                    lineStyle: {
                        color: '#00649f',
                    },
                },
                labelLayout: (params) => {
                    const isLeft = params.labelRect.x < chart.getWidth() / 2
                    const points = params.labelLinePoints

                    // 调整引导线第三拐点的x坐标
                    points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width

                    return {
                        labelLinePoints: points,
                        x: points[2][0] + (isLeft ? -8 : 8),
                        align: isLeft ? 'left' : 'right',
                    }
                },
                data: config.data,
            },
        ]
    }
}

const getCardOpt2 = (config, chart) => {
    let axisConfig = {
        axisLabel: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    }

    return {
        timeline: { // 必须配置
            show: false,
        },
        baseOption: {
            tooltip: {
                show: false,
            },
            legend: {
                show: false,
            },
            grid: [
                {
                    left: '5%',
                    top: 0,
                    bottom: 0,
                    containLabel: true,
                    width: '40%',
                    show: false,
                },
                {
                    left: '50%',
                    top: '1px',
                    bottom: 0,
                    containLabel: true,
                    width: 0,
                    show: false,
                },
                {
                    right: '5%',
                    top: 0,
                    bottom: 0,
                    containLabel: true,
                    width: '40%',
                    show: false,
                },
            ],
            xAxis: [
                {
                    gridIndex: 0,
                    type: 'value',
                    inverse: true,
                    ...axisConfig,
                },
                {
                    gridIndex: 1,
                    show: true,
                },
                {
                    gridIndex: 2,
                    type: 'value',
                    inverse: false,
                    ...axisConfig,
                },
            ],
            yAxis: [
                {
                    gridIndex: 0,
                    position: 'right',
                    type: 'category',
                    inverse: true,
                    data: [],
                    ...axisConfig,
                },
                {
                    gridIndex: 1,
                    position: 'left',
                    type: 'category',
                    inverse: true,
                    data: config.data.name,
                    ...axisConfig,
                    axisLabel: {
                        show: true,
                        inside: true,
                        fontSize: genVH(10),
                        color: '#fff',
                        align: 'center',
                        margin: 0,
                    },
                },
                {
                    gridIndex: 2,
                    position: 'right',
                    type: 'category',
                    inverse: true,
                    data: [],
                    ...axisConfig,
                },
            ],
        },
        options: [
            {
                series: [
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'left',
                            fontSize: genVH(10),
                            color: '#fff',
                        },
                        barWidth: '33%',
                        name: config.data.legend[0],
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: config.data.leftData,
                        itemStyle: {
                            borderRadius: [60, 0, 0, 60],
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 1, 0,
                                [
                                    { offset: 0, color: '#e54661' },
                                    { offset: 1, color: 'rgba(140, 48, 78, 0.37)' },
                                ]
                            ),
                        },
                    },
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'right',
                            fontSize: genVH(10),
                            color: '#fff',
                        },
                        barWidth: '28%',
                        name: config.data.legend[1],
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        data: config.data.rightData,
                        itemStyle: {
                            borderRadius: [0, 60, 60, 0],
                            color: new echarts.graphic.LinearGradient(
                                1, 0, 0, 0,
                                [
                                    { offset: 0, color: '#32cca4' },
                                    { offset: 1, color: 'rgba(31, 127, 119, 0.32)' },
                                ]
                            ),
                        },
                    },
                ],
            },
        ],
    }
}

const getCardOpt3 = (config, chart) => {
    let legendData = [], series = []
    config.data.legend.forEach((item, index) => {
        let seriesObj = {}
        if (index < config.data.legend.length - 1) {
            legendData.push({
                name: item,
                icon: '',
                lineStyle: {
                    width: 1,
                    dashOffset: 1,
                },
            })
            seriesObj.type = 'line'
            seriesObj.smooth = true
            seriesObj.symbol = 'image://images/circle.png'
            seriesObj.symbolSize = 5
        } else {
            legendData.push({
                name: item,
                icon: 'rect',
            })
            seriesObj.type = 'bar'
            seriesObj.barWidth = '24%'
        }
        seriesObj.name = item
        seriesObj.data = config.data[item]
        seriesObj.lineStyle = {
            color: '#427bde',
            width: 1,
        }
        console.log(seriesObj)
        series.push(seriesObj)
    })

    return {
        legend: {
            data: legendData,
            itemGap: 17,
            right: 0,
            top: -5,
            itemWidth: 14,
            itemHeight: 5,
            borderColor: '#fff',
            textStyle: {
                color: '#fff',
                fontSize: genVH(8),
                padding: [0, 0, 0, 6],
            },
        },
        grid: {
            top: '20%',
            bottom: 0,
            left: 0,
            right: 0,
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: config.data.name,
            axisLabel: {
                show: true,
                textStyle: {
                    fontSize: genVH(8),
                    color: '#fff',
                },
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: '#1b5b67',
                    width: 1,
                    // *$坐标线延长线
                    shadowOffsetX: 8,
                    shadowColor: '#1b5b67',
                },
            },
        },
        yAxis: {
            type: 'value',
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: true,
                margin: 0,
                // *$修改 axisTick 颜色
                formatter: '{value} -',
                textStyle: {
                    fontSize: genVH(8),
                    color: (value) => {
                        // *$隐藏0坐标
                        return value > 0 ? '#fff' : 'rgba(0, 0, 0, 0)'
                    }
                },
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#1b5b67',
                    width: 1,
                    shadowOffsetX: -14,
                    shadowColor: '#1b5b67',
                },
            },
            splitLine: {
                show: false,
            },
        },
        series,
    }
}

const getCardOpt4 = (config, chart) => {
    const totalNum = config.data[0] + config.data[1]

    return {
        tooltip: {
            show: false,
        },
        legend: {
            show: false,
        },
        series: [
            {
                name: 'Ring',
                type: 'pie',
                clockwise: false,
                center: ['50%', '40%'],
                radius: ['45%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    formatter: (params) => {
                        return params.data.value
                    },
                    fontSize: genVH(10),
                    color: 'white',
                },
                labelLine: {
                    length: 8,
                    length2: 0,
                    maxSurfaceAngle: 80,
                },
                labelLayout: (params) => {
                    const textGap = genVH(7)
                    const value = params.text
                    const isLeft = params.labelRect.x < chart.getWidth() / 2
                    const points = params.labelLinePoints

                    // 调整引导线第二/第三拐点的y坐标
                    if (value / totalNum > 0.5) {
                        points[1][1] = chart.getHeight() * 0.65
                        points[2][1] = chart.getHeight() * 0.65
                    } else if (value / totalNum < 0.5) {
                        points[1][1] = params.labelRect.height + textGap
                        points[2][1] = params.labelRect.height + textGap
                    } else {
                        points[1][1] = isLeft ? chart.getHeight() * 0.65 : params.labelRect.height + textGap
                        points[2][1] = isLeft ? chart.getHeight() * 0.65 : params.labelRect.height + textGap
                    }

                    // 调整引导线第三拐点的x坐标
                    points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width

                    return {
                        labelLinePoints: points,
                        x: points[2][0],
                        y: points[2][1] - textGap,
                        align: isLeft ? 'left' : 'right',
                    }
                },
                data: [
                    {
                        value: config.data[0],
                        name: 'a',
                        itemStyle: {
                            color: '#01f4c5',
                            borderWidth: 0,
                        },
                        labelLine: {
                            lineStyle: {
                                color: 'white',
                            },
                        },
                    },
                    {
                        value: config.data[1],
                        name: 'b',
                        itemStyle: {
                            color: '#00b28f',
                            borderWidth: 10,
                            borderColor: '#00b28f',
                        },
                        labelLine: {
                            lineStyle: {
                                color: 'white',
                            },
                        },
                    },
                ],
            },
        ]
    }
}