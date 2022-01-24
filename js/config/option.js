function getCardOpt1(config, chart) {
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
                    fontSize: 10,
                    color: 'white',
                },
                labelLine: {
                    length: 8,
                    length2: 0,
                    maxSurfaceAngle: 80,
                },
                labelLayout: (params) => {
                    const textGap = 7
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