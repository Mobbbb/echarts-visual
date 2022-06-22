const renderNormalTable = (classNameParams, config) => {
    const contentDom = document.getElementsByClassName(classNameParams.contentDomClass)
    let dom = ''
    let table = document.createElement('table')
    let tableHeader = document.createElement('table')
    let tableBodyWrap = document.createElement('div')
    table.className = 'normal-table fontSize12'
    tableHeader.className = 'normal-table fontSize12'
    tableBodyWrap.className = 'normal-table-wrap'

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
    tableHeader.innerHTML = dom
    document.getElementsByClassName(classNameParams.beforeDomClass)[0].appendChild(tableHeader)

    // 表体
    dom = ''
    config.data.forEach((item, index) => {
        dom += `<tr>`
        config.column.forEach(cell => {
            const { render, key, width, align } = cell
            let { class: className = '' } = cell

            let style = ' style="'
            if (width) style += `width: ${width};`
            if (align) style += `text-align: ${align};`
            style += `"`

            if (cell.tooltip) className += ` ${config.domId}-table-overflow-text`

            if (render) {
                dom += `<td${style} class="${className}">${render(item)}</td>`
            } else if (key === 'index') {
                dom += `<td${style} class="${className}"><span>${index + 1}</span></td>`
            } else {
                dom += `<td${style} class="${className}"><span>${item[key]}</span></td>`
            }
        })
        dom += `</tr>`
    })
    if (!config.data.length) dom += `<tr><td colspan="${config.column.length}" style="text-align: center;height: 100%;">暂无数据</td></tr>`
    table.innerHTML = dom
    tableBodyWrap.appendChild(table)
    contentDom[0].appendChild(tableBodyWrap)
    contentDom[0].style.height = `calc(100% - ${tableHeader.getBoundingClientRect().height}px)`

    // scrollbar compensation
    if (tableBodyWrap.scrollHeight > tableBodyWrap.clientHeight) {
        document.getElementsByClassName(classNameParams.beforeDomClass)[0].classList.add('scrollbar-compensation')
    }

    // tooltips
    let tooltips = document.createElement('div')
    tooltips.className = 'table-tootips'
    tooltips.innerHTML = '<span class="tooltips-arrow"></span><span class="tooltips-text"></span>'
    contentDom[0].appendChild(tooltips)

    const tooltipsArrow = document.getElementsByClassName('tooltips-arrow')[0]
    const tooltipsText = document.getElementsByClassName('tooltips-text')[0]
    const tableOverflowTextDom = document.getElementsByClassName(`${config.domId}-table-overflow-text`)
    for (let i = 0; i < tableOverflowTextDom.length; i++) {
        if (tableOverflowTextDom[i].scrollWidth - tableOverflowTextDom[i].clientWidth > 1) {
            tableOverflowTextDom[i].addEventListener('mouseout', () => {
                tooltips.style.display = 'none'
            })

            tableOverflowTextDom[i].addEventListener('mouseover', () => {
                tooltips.style.display = 'block'
                const fontSize = '1.125vh'
                const padding = genVH(8)
                const size = getTextSize(tableOverflowTextDom[i].innerText, fontSize)
                tooltips.style.fontSize = fontSize
                tooltips.style.padding = `${padding}px`
                tooltips.style.left = `${tableOverflowTextDom[i].offsetLeft + (tableOverflowTextDom[i].clientWidth / 2 - size.width / 2 - padding)}px`
                tooltips.style.top = `${tableOverflowTextDom[i].offsetTop - tableBodyWrap.scrollTop - (size.height + padding * 2) - tooltipsArrow.clientHeight}px`
                tooltipsArrow.style.transform = `translate3d(${size.width / 2 + padding - tooltipsArrow.clientWidth / 2}px, 0, 0)`
                tooltipsText.innerHTML = tableOverflowTextDom[i].innerText
            })
        }
    }
}
