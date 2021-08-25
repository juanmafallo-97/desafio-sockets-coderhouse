const app = require("express");
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const PORT = 8080;

app.use(express.json);
app.use(express.urlencoded({ extended: true }));
app.engine("hbs", {
  extname: ".hbs",
  defaultLayout: "index.hbs",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials"
});

app.get("/", (req, res) => {
  res.render("home");
});



httpServer.listen(PORT, "Servidor activo en puerto: " + port);
