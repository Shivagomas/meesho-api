const express = require('express');
const { Category, validate } = require('../models/category');
const router = express.Router();

router.get('/', async(req,res) => {
    const categories = await Category.find().sort('name');
    return res.send(categories);
});

router.get("/:id", async(req,res) => {
    const category = await Category.findById(req.params.id);
    if(!category) return res.status(404).send("Category not found");
    return res.send(category);
});

router.post('/', async(req,res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    let category = new Category({ name: req.body.name });
    if(!category) res.status(400).send("Something failed");
    await category.save();
    return res.send(category);
});

router.put("/:id", async(req,res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {name: req.body.name});
    if(!category) return res.status(404).send("Category not found");
    return res.send(category);
});

router.delete("/:id", async(req,res) => {
    const category = await Category.findByIdAndRemove(req.params.id);
    if(!category) return res.status(404).send("Category not found");
    return res.send(category);
})

module.exports = router;