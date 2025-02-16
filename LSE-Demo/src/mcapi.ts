// LiteLoader-AIDS automatic generated
/// <reference path="F:\MC\000_Dev\003_Lib\dts/dts/llaids/src/index.d.ts"/> 
export type ItemData = {
    name: string,
    icon: string,
    slot: number,
    count?: number,
    damage?: number,
    maxDamage?: number
}

export type InventoryData = {
    playerInventory: ItemData[],
    enderChest: ItemData[]
}

const BASE_DATA_PATH = __dirname + "/public/data"

function getItemData(container: LLSE_Container) {
    const data: ItemData[] = []
    container.getAllItems().forEach((item, index) => {
        let { count, type, name, isBlock, isStackable, isDamageableItem, damage, maxDamage } = item
        if (item.isNull()) return
        const idata: ItemData = {
            name,
            icon: `./images/${isBlock ? "block" : "item"}/${type}.png`,
            slot: index,
            count: isStackable ? count : undefined,
            damage: isDamageableItem ? maxDamage - damage : undefined,
            maxDamage: isDamageableItem ? maxDamage : undefined
        }
        data.push(idata)
    })
    return data
}

export function getInventoryData(player: Player) {
    if (!player) return null
    const inventory = player.getInventory()
    const enderChest = player.getEnderChest()
    const inventoryData: InventoryData = {
        playerInventory: getItemData(inventory),
        enderChest: getItemData(enderChest)
    }
    return inventoryData
}

export function onPlayerLeft(player: Player) {
    const inventory = player.getInventory()
    const enderChest = player.getEnderChest()
    const inventoryData: InventoryData = {
        playerInventory: getItemData(inventory),
        enderChest: getItemData(enderChest)
    }
    File.writeTo(`${BASE_DATA_PATH}/${player.uuid}.json`, JSON.stringify(inventoryData))
}

export function getPlayerInventoryData(id: { name?: string, xuid?: string, uuid?: string }) {
    let { name, xuid, uuid } = id
    if (typeof name !== "undefined") {
        uuid = data.name2uuid(name) ?? uuid
    } else if (typeof xuid !== "undefined") {
        uuid = data.xuid2uuid(xuid) ?? uuid
    }
    if (typeof uuid === "undefined") return null
    const player = mc.getOnlinePlayers().find(player => player.uuid === uuid)
    if (typeof player !== "undefined") {
        const inventoryData = getInventoryData(player)
        return inventoryData
    }
    const fileData = File.readFrom(`${BASE_DATA_PATH}/${uuid}.json`)
    if(fileData===null) return null
    try{
        return JSON.parse(fileData)
    }catch(err){
        return null
    }
}


