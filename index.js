const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost/4000"]
  }
});
const handlebars = require("express-handlebars");
const ProductsApi = require("./api.js");

const api = new ProductsApi("productos.json");

const PORT = 4000;

// Config del socket //
io.on("connection", async (socket) => {
  console.log("Usuario conectado");

  //Mandamos los productos apenas se conecta un usuario
  const products = await api.getAll();
  socket.emit("products", products);

  socket.on("new-product", async (product) => {
    await api.save(product);
    const updatedProducts = await api.getAll();
    io.sockets.emit("products", updatedProducts);
  });

  //Mandamos tambien los Mensajes
  const messages = [{ email: "hola@algo.com", content: "Buenas!" }];
  socket.emit("messages", messages);
});

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

httpServer.listen(PORT, () =>
  console.log("Servidor activo en puerto: " + PORT)
);
