import http from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express"
import sqlite3 from "sqlite3";
const app = express();
const __dirname = process.cwd();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.get("/games/", (req, res) => {
  res.sendFile("/public/games.html", { root: __dirname });
});

app.get("/", (req, res) => {
  res.sendFile("/public/index.html", { root: __dirname });
});

app.get("/search/", (req, res) => {
  res.sendFile("/public/search.html", { root: __dirname });
});

app.get("/settings/", (req, res) => {
  res.sendFile("/public/settings.html", { root: __dirname });
});

app.get('*', function(req, res){
  res.sendFile("/public/404.html", { root: __dirname });
});

const httpServer = http.createServer();
const bareServer = createBareServer("/bare/");

httpServer.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

httpServer.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});
const port = 8080;

httpServer.on("listening", () => {
  console.log("HTTP server listening");
  console.log(`View your server at http://localhost:${port}`);
});

httpServer.listen({
  port: port,
});
