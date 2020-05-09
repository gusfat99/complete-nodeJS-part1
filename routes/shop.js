const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');

router.get("/",shopController.getIndex);

router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", shopController.carts);
router.post("/cart", shopController.postCart);
router.get("/checkout");
router.get("/orders", shopController.getOrders);
router.post("/create-order", shopController.postOrder);
router.get("/delete-cart/:productId", shopController.deleteProductFromCart);

module.exports = router;