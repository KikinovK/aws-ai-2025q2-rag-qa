import fs from "fs";
import path from "path";
import process from "process";


const logFilePath = path.resolve("log.txt");

const logStream = fs.createWriteStream(logFilePath, { flags: "a" });



export function log(message, silent = false) {
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] ${message}\n`;

  logStream.write(fullMessage);

  if (!silent) {
    console.log(message);
  }
}


process.on("exit", () => {
  logStream.end();
});
