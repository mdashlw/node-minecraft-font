import { Canvas } from "skia-canvas";
import { drawMinecraftText } from "./lib/index.js";

const canvas = new Canvas(150, 40);
const context = canvas.getContext("2d");

drawMinecraftText(context, "§cHello world!", 0, 0, 2);
drawMinecraftText(context, "§1C§2o§3l§4o§5r§6m§7a§8t§9i§ac", 0, 10, 2);

canvas.saveAs("example.png");
