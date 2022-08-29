const express = require('express');
const { Category } = require('../models/category');
const { Product, validate } = require('../models/products');
const router = express.Router();
const multer = require('multer');

/*
const Storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req,file,cb) => {
      cb(null,Date.now() + file.originalname)
    }
  })

const upload = multer({
    storage: Storage
})

*/

router.get("/", async(req,res) => {
    const products = await Product.find().sort('name');
    return res.send(products);
});

router.get("/:id", async(req,res) => {
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).send("Product not found");
    return res.send(product);
});

router.post("/", async(req,res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    const category = await Category.findById(req.body.categoryId);
    if(!category) return res.status(400).send("Category not found")

    let product = new Product({
        name: req.body.name,
        brand: req.body.brand,
        description: req.body.description,
        category: {
            _id: category._id,
            name: category.name
        },
        price: req.body.price,
        inStock: req.body.inStock,
    });

    await product.save();
    return res.send(product);

});

router.put("/:id", async(req,res) => {
    const product = await Product.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        brand: req.body.brand,
        description: req.body.description,
        price: req.body.price,
        inStock: req.body.inStock
    });
    if(!product) return res.status(404).send("Product not found");
    return res.send(product);
});

router.delete("/:id", async(req,res) => {
    const product = await Product.findByIdAndRemove(req.params.id);
    if(!product) return res.status(404).send("porduct not found");
    return res.send(product);
});

module.exports = router;
