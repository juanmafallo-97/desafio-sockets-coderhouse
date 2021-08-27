const socket = io();

document.getElementById("product-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const newProduct = {
    title: document.getElementById("product-title").value,
    price: document.getElementById("product-price").value,
    thumbnail: document.getElementById("product-image").value
  };

  socket.emit("new-product", newProduct);
});
