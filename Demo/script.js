// 初始化数据
let inventoryCache = {}

// 当前拖拽的物品
let draggedItem = null

// 渲染 Slot
function renderSlot(slotElement, item) {
    let { name, count, icon, damage, maxDamage } = item

    let durability = damage * 100 / maxDamage
    let isShowItemIcon = icon.trim() !== ""
    let isShowItemCount = count > 1 && count <= 64
    let isShowItemDurability = durability < 100 && durability > 0
    slotElement.innerHTML = `
        ${isShowItemIcon ? `<img src="${icon}" alt="${name}" class="item-icon">` : ''}
        ${isShowItemCount ? `<span class="item-count">${count}</span>` : ''}
        ${isShowItemDurability ? `
            <div class="durability-bar">
                <div class="durability-fill" style="width: ${durability}%; background-color: ${getDurabilityColor(durability)};"></div>
            </div>
            ` : ''}
        `
}

// 获取耐久度颜色
function getDurabilityColor(durability) {
    if (durability > 80) return 'limegreen'
    if (durability > 60) return 'green'
    if (durability > 50) return 'lightgreen'
    if (durability > 40) return 'yellowgreen'
    if (durability > 30) return 'yellow'
    if (durability > 20) return 'orange'
    return 'red'
}

function initContainer(type, { size, start = 0 }, title = '') {
    return `
        <div class="${type} container">
            <h2>${title}</h2>
            <div class="grid-container" data-type="${type}">
                ${initSlot(size, start)}
            </div>
        </div>
    `
}

function initSlot(size, start) {
    let r = ''
    for (let i = 0; i < size; i++) {
        r += `<div class="slot" data-slot="${i + start}"></div>\n`
    }
    return r
}

function init() {
    const inventoryElement = document.querySelector('#inventory')
    inventoryElement.innerHTML = `
    ${initContainer('enderChest', { size: 27 }, "末影箱")}
    ${initContainer('playerInventory', { size: 27, start: 9 }, "物品栏")}
    ${initContainer('playerInventory', { size: 9 })}
    <p style="margin:0">Copyright &copy 2025 <a href="https://github.com/lwenk" style=" color: inherit;">LWenK</a></p>
    `
}

function getItemForCache(type, index) {
    let ct = inventoryCache[type]
    if (!ct) return
    let r = ct.find(v => v.slot == index)
    return r

}
// 初始化背包
function initInventory() {
    document.querySelectorAll('.grid-container').forEach(container => {
        const type = container.dataset.type
        container.querySelectorAll('.slot').forEach((slot) => {
            const index = parseInt(slot.dataset.slot)
            //console.log(type, " ", slot.dataset.slot)
            const item = getItemForCache(type, index)
            //console.log(item)
            if (item) {
                renderSlot(slot, item)
            }
        })
    })
}

function getQueryParams(q) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const jsonPath = urlParams.get(q);
    return jsonPath
}

async function loadInventory() {
    try {
        let target = getQueryParams("target")
        if (!target) target = "data"
        let remote = getQueryParams("remote")
        if (!remote) remote = ""
        let api = remote ? remote : `${target}.json?${new Date().getTime()}`
        const response = await fetch(api)
        if (!response.ok) {
            throw new Error('无法加载背包数据')
        }
        inventoryCache = await response.json()
        initInventory() // 初始化背包
    } catch (error) {
        console.error('加载背包数据失败:', error)
    }
}
// 初始化
init()
loadInventory()