const http = require("http");
const socketIO = require("socket.io");
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let filePath = "." + req.url;
  if (filePath === "./") {
    filePath = "./index.html";
  }

  const extname = path.extname(filePath);
  let contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".svg":
      contentType = "image/svg+xml";
      break;
    case ".woff2":
      contentType = "font/woff2";
      break;
    case ".eot":
      contentType = "application/vnd.ms-fontobject";
      break;
    case ".ttf":
      contentType = "application/x-font-ttf";
      break;
    case ".woff":
      contentType = "font/woff";
      break;
    case ".otf":
      contentType = "font/otf";
      break;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Server error");
      }
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(port, () => {
  console.log(
    "Apăsați ctrl + click stânga pe link: " + "\x1b[36m%s\x1b[0m",
    `http://localhost:${port}`
  );
});

const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("watch", () => {
    console.log("Watching index.html");
    fs.watch(path.join(__dirname, "index.html"), { recursive: true }, () => {
      console.log("File changed");
      socket.emit("reload");
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
