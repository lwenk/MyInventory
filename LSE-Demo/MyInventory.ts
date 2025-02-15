// LiteLoader-AIDS automatic generated
/// <reference path="F:\MC\000_Dev\003_Lib\dts/dts/llaids/src/index.d.ts"/> 

ll.registerPlugin(
    /* name */ "",
    /* introduction */ "",
    /* version */[0, 0, 1],
    /* otherInformation */ {}
);

type itemData = {
    name: string,
    icon: string,
    slot: number,
    count?: number,
    damage?: number,
    maxDamage?: number
}

type InventoryData = {
    playerInventory: itemData[],
    enderChest: itemData[]
}

const BASE_DATA_PATH = "./plugins/LK/InventoryData"
const STATIC_PATH = "./plugins/LK/InventoryWeb"

function getInventoryData(player: Player) {
    if (!player) return
    const inventory = player.getInventory()
    const enderChest = player.getEnderChest()
    const inventoryData: InventoryData = {
        playerInventory: [],
        enderChest: []
    }
    inventory.getAllItems().forEach((item, index) => {
        let { count, type, name, isBlock, isStackable, isDamageableItem, damage, maxDamage } = item
        if (item.isNull()) return
        const data: itemData = {
            name,
            icon: `./images/${isBlock ? "block" : "item"}/${type}.png`,
            slot: index,
            count: isStackable ? count : undefined,
            damage: isDamageableItem ? maxDamage - damage : undefined,
            maxDamage: isDamageableItem ? maxDamage : undefined
        }
        inventoryData.playerInventory.push(data)

    })
    enderChest.getAllItems().forEach((item, index) => {
        let { count, type, name, isBlock, isStackable, isDamageableItem, damage, maxDamage } = item
        if (item.isNull()) return
        const data: itemData = {
            name,
            icon: `./images/${isBlock ? "block" : "item"}/${type}.png`,
            slot: index,
            count: isStackable ? count : undefined,
            damage: isDamageableItem ? maxDamage - damage : undefined,
            maxDamage: isDamageableItem ? maxDamage : undefined
        }
        inventoryData.enderChest.push(data)
    })
    return inventory
}

mc.listen("onLeft", player => {
    const inventory = player.getInventory()
    const enderChest = player.getEnderChest()
    const inventoryData: InventoryData = {
        playerInventory: [],
        enderChest: []
    }
    inventory.getAllItems().forEach((item, index) => {
        let { count, type, name, isBlock, isStackable, isDamageableItem, damage, maxDamage } = item
        if (item.isNull()) return
        const data: itemData = {
            name,
            icon: `./images/${isBlock ? "block" : "item"}/${type}.png`,
            slot: index,
            count: isStackable ? count : undefined,
            damage: isDamageableItem ? maxDamage - damage : undefined,
            maxDamage: isDamageableItem ? maxDamage : undefined
        }
        inventoryData.playerInventory.push(data)

    })
    enderChest.getAllItems().forEach((item, index) => {
        let { count, type, name, isBlock, isStackable, isDamageableItem, damage, maxDamage } = item
        if (item.isNull()) return
        const data: itemData = {
            name,
            icon: `./images/${isBlock ? "block" : "item"}/${type.split("minecraft:")[1]}.png`,
            slot: index,
            count: isStackable ? count : undefined,
            damage: isDamageableItem ? maxDamage - damage : undefined,
            maxDamage: isDamageableItem ? maxDamage : undefined
        }
        inventoryData.enderChest.push(data)
    })
    //这里用的是玩家uuid作为文件名，你也可以用玩家名或xuid作为文件名
    File.writeTo(`${BASE_DATA_PATH}/${player.uuid}.json`, JSON.stringify(inventoryData))
})

const server = new HttpServer();
const LISTEN_ADDRESS = "127.0.0.1"
const LISTEN_PORT = 11451

mc.listen("onServerStarted", () => {
    //这个只是一个示例，并不确定lse的HttpServer可以正常运行
    //你可以使用任何web框架来实现以下功能
    server.onGet("/inventory", (req, resp) => {
        const playerName = req.query["name"]
        if (typeof playerName === "undefined") {
            resp.status = 400;
            resp.reason = "Bad Request";
            return
        }
        const uuid = data.name2uuid(playerName)
        if (uuid === null) {
            resp.status = 400;
            resp.reason = "Bad Request";
            return
        }
        let player = mc.getOnlinePlayers().find(pl => pl.uuid === uuid)
        if (typeof player !== "undefined") {
            resp.body = JSON.stringify(getInventoryData(player))
            resp.status = 200;
            resp.reason = "OK";
            return
        }
        resp.body = File.readFrom(`${BASE_DATA_PATH}/${uuid}.json`)
        resp.status = 200;
        resp.reason = "OK";
    })
    // .onGet("/static/(.+)", (req, resp) => {
    //     const fileName = req.matches[1]
    //     const path = `${STATIC_PATH}/${fileName}`
    //     if (File.exists(path)) {
    //         resp.body = File.readFrom(path)
    //         resp.status = 200;
    //         resp.reason = "OK";
    //         return
    //     }
    //     resp.status = 404;
    //     resp.reason = "Not Found";
    // })
    .onGet("/404", (req, resp) => {
        resp.status = 404;
        resp.reason = "Not Found";
    }).onGet("/(.+)", (req, resp) => {
        resp.status = 404;
        resp.reason = "Not Found";
    }).onPreRouting((req, resp) => {
        logger.info(`onPreRouting [${req.method}] Path ${req.path}\n`, req.query, req.body)
        return true
    }).onPostRouting((req, resp) => {
    }).onError((req, resp) => {
    }).onException((req, resp, error) => {
        logger.error(error)
    }).listen(LISTEN_ADDRESS, LISTEN_PORT);
})

ll.onUnload(() => {
    server.stop()
})