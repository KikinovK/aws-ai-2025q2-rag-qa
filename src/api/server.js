import express from "express";
import cors from "cors";
import router from "./routes.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import process from "process";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", router);


const swaggerDoc = JSON.parse(fs.readFileSync(path.join("docs", "swagger.json"), "utf8"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));


app.use(express.static("src/public"));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
