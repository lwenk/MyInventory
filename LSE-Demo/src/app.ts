import express from "express";
import cors from "cors"
import { getPlayerInventoryData } from "./mcapi";
import path from "path"

const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, "public")))

app.get("/api/inventory", (req, res) => {
    const data = getPlayerInventoryData(req.query)
    if (data === null) {
        res.status(400).json({ error: "No Data" })
    } else {
        res.status(200).json(data)
    }
})

export { app }