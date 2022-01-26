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
