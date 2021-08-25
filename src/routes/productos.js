const express = require("express");
const ProductsApi = require("../../api.js");

const router = express.Router();
const api = new ProductsApi("productos.json");

router.get("/", async (req, res) => {
  try {
    const productos = await api.getAll();
    res.status(201).json(productos);
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const producto = await api.getById(id);
    res.status(201).json(producto);
  } catch (error) {
    res.send({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const savedProduct = await api.save(newProduct);
    res.json(savedProduct);
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = req.body;
    await api.updateProduct(id, product);
    const updatedProduct = await api.getById(id);
    res.status(201).json(updatedProduct);
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await api.deleteById(id);
    res.json({ success: `Product with id ${id} deleted` });
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
