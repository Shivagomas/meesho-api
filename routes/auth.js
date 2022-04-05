const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { User, generateAuthToken} = require('../models/user');
const Joi = require('joi');


router.post("/", async(req,res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('invalid email or password');

    const token = generateAuthToken()
    res.send(token);
});

const validate = req => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return schema.validate(req);
}

module.exports = router;