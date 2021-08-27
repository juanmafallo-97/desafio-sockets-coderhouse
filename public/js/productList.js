const socket = io();

/* Carga de Producto */
document.getElementById("product-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const productTitle = document.getElementById("product-title");
  const productPrice = document.getElementById("product-price");
  const productImage = document.getElementById("product-image");

  const newProduct = {
    title: productTitle.value,
    price: productPrice.value,
    thumbnail: productImage.value
  };

  socket.emit("new-product", newProduct);

  productTitle.value = "";
  productPrice.value = "";
  productImage.value = "";
});

/* Lista de productos */
const renderProducts = (products) => {
  let hayProductos = true;
  if (!products[0]) hayProductos = false;
  const productsHtml = `
  {{#if hayProductos}}
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Nombre</th>
        <th scope="col">Precio</th>
        <th scope="col">Imagen</th>
      </tr>
    </thead>
    <tbody>
      {{#each products}}
        <tr>
          <th scope="row">{{this.title}}</th>
          <td>{{this.price}}</td>
          <td>imagen</td>
        </tr>
      {{/each}}
    </tbody>
  </table>
{{else}}
  <h2>No hay productos</h2>
{{/if}}`;
  const template = Handlebars.compile(productsHtml);
  const html = template({ products, hayProductos });
  document.getElementById("list-container").innerHTML = html;
};

socket.on("products", (products) => {
  renderProducts(products);
});

/* Mensajes */

const renderMessages = (messages) => {
  const chatHtml = `
  {{#each messages}}
        <div>
          <span>{{this.email}} </span><span>{{this.content}} </span>
        </div>
  {{/each}}
  `;
  const template = Handlebars.compile(chatHtml);
  const html = template({ messages });
  document.getElementById("chat-container").innerHTML = html;
};

socket.on("messages", (messages) => {
  console.log(messages);
  renderMessages(messages);
});
