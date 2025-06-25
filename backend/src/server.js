import express from "express";
import cors from "cors";
import router from "./api/routes.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import process from "process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", router);


const swaggerPath = resolve(__dirname, "..", "docs", "swagger.json");
const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));


const publicPath = resolve(__dirname, "..", "src", "public");

app.use(express.static(publicPath));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
