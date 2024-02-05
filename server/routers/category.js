const express = require("express");
const router = express.Router();
const productController = require("../controllers/category-controller");

router.post("/", productController.createCategory);
router.get("/", productController.readCategory);
router.get("/:id", productController.readCategoryById);
router.put("/:id", productController.updateCategory);
router.delete("/:id", productController.deleteCategory);

module.exports = router;
