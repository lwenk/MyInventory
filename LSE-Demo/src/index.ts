// LiteLoader-AIDS automatic generated
/// <reference path="F:\MC\000_Dev\003_Lib\dts/dts/llaids/src/index.d.ts"/> 

ll.registerPlugin(
    /* name */ "MyInventory",
    /* introduction */ "Web-Inventory",
    /* version */[0, 0, 1],
    /* otherInformation */ {}
);

import { onPlayerLeft } from "./mcapi"
import { app } from "./app"

const LISTEN_PORT = 11451

mc.listen("onLeft", onPlayerLeft)

mc.listen("onServerStarted", () => {
    app.listen(LISTEN_PORT, () => {
        logger.info(`背包API服务已启动 http://localhost:${LISTEN_PORT}`)
    })
})
