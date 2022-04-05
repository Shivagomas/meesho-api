const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { User,validate, generateAuthToken } = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post("/", async(req,res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send("User already registered");

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    const token = generateAuthToken();
    return res.header('x-auth-token',token).send(user);
});


router.get("/me", auth,async(req,res) => {
    const user = await User.findById(req.user._id);
    return res.send(user);
});

router.put("/:id",[auth,admin], async(req,res) => {
    const user  = await User.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        //email: req.body.email,
        //password: req.body.password
    });
    if(!user) return res.status(404).send("user not found");
    return res.send(user);
});

router.delete("/:id",[auth,admin] ,async(req,res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) return res.status(404).send("user not found");
    return res.send(user);
});

module.exports = router;