let normalTableColumn = [
    {
        key: 'index',
        title: '排名',
    },
    {
        key: 'rate',
        title: '占比',
        render: (params) => {
            let width = genVH(14),
                height = genVH(14),
                pieRate = parseInt(params.rate) / 100 * 2,
                dataUrl,
                ctx,
                canvas = document.createElement('canvas')

            canvas.width = width
            canvas.height = height
            ctx = canvas.getContext('2d')
            ctx.moveTo(width / 2, height / 2)
            ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * pieRate, false)
            ctx.closePath()
            ctx.fillStyle = '#6ac8f1'
            ctx.fill()
            dataUrl = canvas.toDataURL('image/png')

            return `
                <div class="table-rate-wrap">
                    <div class="table-pan-icon" style="background-image: url('${dataUrl}');
                        width: ${width}px; height: ${height}px;"></div>
                    <div class="table-rate-num">${params.rate}</div>
                </div>
            `
        },
    },
    {
        key: 'type',
        title: '类型',
        width: '40%',
        align: 'center',
    },
    {
        key: 'num',
        title: '计数',
        align: 'right',
        class: 'normal-table-num',
    },
]

let mapCityConfig = [
    {
        name: '杭州',
        labelConfig: {
            show: true,
            position: 'left-top',
            firstPointOffsetX: 20,
            firstPointOffsetY: 50,
            secondPointLength: 20,
            offset: [0, -30],
        },
        data: [10, 20, 30],
        symbolConfig: {
            x: 119.403576,
            y: 29.987459,
            url: 'image://./images/symbol-icon.png',
            size: [17, 17],
        },
    },
    {
        name: '宁波',
        labelConfig: {
            show: true,
            position: 'right-bottom',
            firstPointOffsetX: 35,
            firstPointOffsetY: 60,
            secondPointLength: 15,
            offset: [0, -40],
        },
        data: [10, 20, 30],
        symbolConfig: {
            x: 121.452111,
            y: 29.900575,
            url: 'image://./images/symbol-icon.png',
            size: [17, 17],
        },
    },
    {
        name: '绍兴',
        labelConfig: {
            show: true,
            position: 'right-top',
            firstPointOffsetX: 30,
            firstPointOffsetY: 40,
            secondPointLength: 25,
            offset: [0, 0],
        },
        data: [10, 20, 30],
        symbolConfig: {
            x: 120.600865,
            y: 30.052653,
            url: 'image://./images/symbol-icon.png',
            size: [17, 17],
        },
    },
    {
        name: '衢州',
        labelConfig: {
            show: true,
            position: 'left-bottom',
            firstPointOffsetX: 10,
            firstPointOffsetY: 50,
            secondPointLength: 20,
            offset: [-10, 0],
        },
        data: [10, 20, 30000],
        symbolConfig: {
            x: 118.75,
            y: 28.960459,
            url: 'image://./images/symbol-icon.png',
            size: [17, 17],
        },
    },
    {
        name: '丽水',
    },
    {
        name: '嘉兴',
    },
    {
        name: '台州',
    },
    {
        name: '金华',
    },
    {
        name: '湖州',
    },
    {
        name: '温州',
    },
]
