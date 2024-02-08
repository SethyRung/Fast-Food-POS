const { Products, Categories } = require("../models");

module.exports = {
  async createCategory(req, res) {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({
        status: "error",
        data: { message: "Insufficient data" },
      });
    try {
      const category = await Categories.create({
        name: name,
      });
      res.status(200).json({
        status: "success",
        data: {
          message: "You have successfully added a category.",
          category: category,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        status: "error",
        data: {
          message: "You have unsuccessfully added a category.",
          category: req.body,
        },
      });
    }
  },
  async readCategory(req, res) {
    try {
      const categories = await Categories.findAll({
        attributes: ["id", "name"],
      });

      res.status(200).json({
        status: "success",
        data: {
          categories: categories,
        },
      });
    } catch (e) {
      res.status(400).json({
        status: "error",
        data: {
          message: "Something went wrong. Unable to retrieve categories.",
        },
      });
    }
  },
  async readCategoryById(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new Error();
      const category = await Categories.findByPk(id);
      res.status(200).json({ status: "success", data: { category: category } });
    } catch (e) {
      res.status(400).json({
        status: "error",
        data: {
          message: "Something went wrong. Unable to retrieve category.",
        },
      });
    }
  },
  async updateCategory(req, res) {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (isNaN(id) || !name)
      return res.status(400).json({
        status: "error",
        data: { message: "Insufficient data" },
      });

    try {
      await Categories.update(
        {
          name: name,
        },
        { where: { id: id } }
      );
      res.status(200).json({
        status: "success",
        data: {
          message: "You have successfully updated a category.",
        },
      });
    } catch (e) {
      res.status(400).json({
        status: "success",
        data: {
          message: "You have unsuccessfully updated a category.",
        },
      });
    }
  },
  async deleteCategory(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "Insufficient data" });

    try {
      await Categories.destroy({ where: { id: id } });
      res.status(200).json({
        status: "success",
        data: {
          message: "You have successfully deleted a category.",
        },
      });
    } catch (e) {
      res.status(400).json({
        status: "error",
        data: {
          message: "You have unsuccessfully deleted a category.",
        },
      });
    }
  },
};
