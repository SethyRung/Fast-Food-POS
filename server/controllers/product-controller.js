const { Products, Categories } = require("../models");

module.exports = {
  async createProduct(req, res) {
    const { name, price, photo, categoryId } = req.body;
    if (!name || !price || !photo || !categoryId)
      return res.status(400).json({
        status: "error",
        data: { message: "Insufficient data" },
      });
    try {
      const product = await Products.create({
        name: name,
        price: price,
        photo: photo,
        CategoryId: categoryId,
      });
      res.status(200).json({
        status: "success",
        data: {
          message: "You have successfully added a product.",
          product: product,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        status: "error",
        message: "You have unsuccessfully added a product.",
        product: req.body,
      });
    }
  },
  async readProduct(req, res) {
    try {
      const products = Products.findAll({
        include: [
          {
            model: Categories,
            required: true,
          },
        ],
      });

      res.status(200).json({
        status: "success",
        data: {
          products: products,
        },
      });
    } catch (e) {
      res.status(400).json({
        status: "error",
        data: {
          message: "Something went wrong. Unable to retrieve products.",
        },
      });
    }
  },
  async readProductById(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new Error();
      const product = await Products.findByPk(id, {
        include: [
          {
            model: Categories,
            required: true,
          },
        ],
      });
      res.status(200).json({ status: "success", data: { product: product } });
    } catch (e) {
      res.status(400).json({
        status: "error",
        data: {
          message: "Something went wrong. Unable to retrieve product.",
        },
      });
    }
  },
  async updateProduct(req, res) {
    const id = parseInt(req.params.id);
    const { name, price, photo, categoryId } = req.body;
    if (isNaN(id) || !name || !price || !photo || !categoryId)
      return res.status(400).json({
        status: "error",
        data: { message: "Insufficient data" },
      });

    try {
      const product = await Products.update(
        {
          name: name,
          price: price,
          photo: photo,
          CategoryId: categoryId,
        },
        { where: { id: id } }
      );
      res.status(200).json({
        status: "success",
        data: {
          message: "You have successfully updated a product.",
          product: product,
        },
      });
    } catch (e) {
      res.status(400).json({
        status: "success",
        data: {
          message: "You have unsuccessfully updated a product.",
          product: req.body,
        },
      });
    }
  },
  async deleteProduct(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "Insufficient data" });

    try {
      await Products.destroy({ where: { id: id } });
      res.status(200).json({
        status: "success",
        data: {
          message: "You have successfully updated a product.",
        },
      });
    } catch (e) {
      res.status(400).json({
        status: "error",
        data: {
          message: "You have unsuccessfully updated a product.",
        },
      });
    }
  },
};
