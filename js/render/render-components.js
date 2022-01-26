const renderNormalTable = (classNameParams, config) => {
    let dom = ''
    let table = document.createElement('table')
    table.className = 'normal-table fontSize12'

    // 表头
    if (!config.hideHeader) {
        dom += `<tr>`
        config.column.forEach(item => {
            const { width, align } = item

            let style = ' style="'
            if (width) style += `width: ${width};`
            if (align) style += `text-align: ${align};`
            style += `"`

            dom += `<th${style}><span>${item.title}</span></th>` 
        })
        dom += `</tr>`
    }

    // 表体
    config.data.forEach((item, index) => {
        dom += `<tr>`
        config.column.forEach(cell => {
            const { render, key, align, class: spanClass } = cell

            let style = ' style="'
            if (align) style += `text-align: ${align};`
            style += `"`

            if (render) {
                dom += `<td${style}>${render(item)}</td>`
            } else if (key === 'index') {
                dom += `<td${style}><span class="${spanClass}">${index + 1}</span></td>`
            } else {
                dom += `<td${style}><span class="${spanClass}">${item[key]}</span></td>`
            }
        })
        dom += `</tr>`
    })

    table.innerHTML = dom
    document.getElementsByClassName(classNameParams.contentDomClass)[0].appendChild(table)
}
