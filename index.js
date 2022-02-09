const express = require("express")
const { v4 : uuidv4 } = require('uuid');
const app = express()
const Joi = require('joi');


app.use(express.json())

const Users = []
const Login = []

 
const schema = Joi.object({
    login: Joi.string().required("login is required"),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required("password is required"),
    age: Joi.number().max(130).min(4).required("age is required"),
    })

app.post("/user", (req,res) => {
    console.log(req)
    const {error,value} = schema.validate(req.body)
    if(error) {
        return res.status(400).json({error:error.details[0].message})
    }
    const {login,password,age} = req.body
    const newUser = {
        id:uuidv4(),
        login,
        password,
        age,
        isDeleted:false
    }
    console.log(newUser)
    Login.push(login)
    Users.push(newUser)
    res.status(200).json({message:"Successfully created user",newUser})
})

app.get("/user",(req,res) => {
    console.log(Users)
    const {id} = req.body
    const user = Users.filter((item) => {
        return item.id === id
    })

    if(user) {
        return res.status(200).json({user})
    }

    return res.status(400).json({message:"No user found"})

})

app.delete("/user",(req,res) => {
    const {id} = req.body
    foundUser = false
    Users.map((item) => {
        if(item.id === id) {
            item.isDeleted = true
            foundUser = true
            return
        }
    })

    if(foundUser) {
        return res.status(200).json({message:"Deleted User"})
    }
    return res.status(400).json({message:"user not found"})


})

app.get("/suggestion",(req,res) => {
    const {subStr} = req.body
    const suggestions = Login.filter((names) => {
        return names.startsWith(subStr)
    })

    return res.status(200).json({suggestions})
})

app.listen(3000,() => {
    console.log("I am listening")
})