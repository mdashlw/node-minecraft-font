import fs from "fs/promises";
import Canvas from "canvas";
import { drawMinecraftText } from "./lib/index.js";

const canvas = Canvas.createCanvas(200, 100);
const context = canvas.getContext("2d");

drawMinecraftText(context, "§cHello world!", 0, 0, 2);
drawMinecraftText(context, "§1C§2o§3l§4o§5r§6m§7a§8t§9i§ac", 0, 10, 2);
drawMinecraftText(context, "§6§lBold!", 0, 20, 2);
drawMinecraftText(context, "§fПривет Россия!", 0, 30, 2);

await fs.writeFile("example.png", canvas.toBuffer());
