import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, type, price, contact } = req.body;

    const product = new Product({
      seller: req.user.id,
      name,
      description,
      type,
      price,
      contact,
      image: req.file ? req.file.path : null,
    });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

export const getProductsByLocation = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name listedPlace role");
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
