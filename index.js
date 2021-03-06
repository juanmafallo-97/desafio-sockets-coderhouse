const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost/4000"]
  }
});
const handlebars = require("express-handlebars");
const ProductsApi = require("./ProductsApi.js");
const MessagesApi = require("./MessagesApi.js");

const productsApi = new ProductsApi("products.json");
const messagesApi = new MessagesApi("messages.json");

const PORT = 4000;

/*  Config del socket  */
io.on("connection", async (socket) => {
  console.log("Usuario conectado");

  //Mandamos los productos apenas se conecta un usuario
  const products = await productsApi.getAll();
  socket.emit("products", products);

  socket.on("new-product", async (product) => {
    await productsApi.save(product);
    const updatedProducts = await productsApi.getAll();
    io.sockets.emit("products", updatedProducts);
  });

  //Mandamos tambien los Mensajes
  const messages = await messagesApi.getAll();
  socket.emit("messages", messages);

  socket.on("new-message", async (message) => {
    await messagesApi.save(message);
    const updatedMessages = await messagesApi.getAll();
    io.sockets.emit("messages", updatedMessages);
  });
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
