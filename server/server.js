const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();
const mongoString = process.env.DATABASE_URL

const User = require('./models/User')
const TodoList = require('./models/TodoList')

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(mongoString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    // .then(() => console.log("connected to DB"))
    // .catch(() => console.log("error"))

app.post('/register', async (req, res) => {
        const {username, password} = req.body

        try {
            const existingUser = await User.findOne({username}).exec()
            if (existingUser) {
                return res.status(409).json({message: 'This username is already taken. Please choose a different username.'})
            }
            const newUser = new User({username, password})
            await newUser.save()

            return res.status(201).json({message: 'User created successfully!'})
        } catch (error) {
            // console.error('Error during registration:', error)
            return res.status(500).json({message: 'Internal Server Error'})
        }
    }
)

app.post('/login', async (req, res) => {
    const {username, password} = req.body

    try {
        const existingUser = await User.findOne({username}).exec()
        if (!existingUser || existingUser.password !== password) {
            return res.status(401).json({message: 'Invalid username or password. Please try again.'})
        }

        return res.json({message: 'Login successful!'})
    } catch (error) {
        // console.error('Error during login:', error)
        return res.status(500).json({message: 'Internal Server Error'})
    }

})

app.get('/todolist', async (req, res) => {
    const {authorization} = req.headers
    const [, token] = authorization?.split(' ')
    const [username, password] = token.split(':')
    const checkUser = await User.findOne({username}).exec()

    if (!checkUser || checkUser.password !== password) {
        return res.status(403).send("Invalid login.")
    }

    const userId = checkUser._id

    try {
        const todoListData = await TodoList.findOneAndUpdate(
            {userId},
            {$set: {updatedAt: new Date()}},
            {new: true}
        ).lean().exec()

        if (todoListData) {
            const {todoList} = todoListData
            res.json(todoList)
        } else {
            const newTodoList = await new TodoList({
                todoList: [],
                userId: userId._id
            })

            await newTodoList.save()
        }
    } catch (error) {
        // console.error('Error fetching todo list:', error)
        res.status(500).send("Internal Server Error")
    }
})

app.post('/todolist', async (req, res) => {
    const {authorization} = req.headers
    const [, token] = authorization?.split(' ')
    const [username, password] = token.split(':')
    const todoListItems = req.body

    try {
        const checkUser = await User.findOne({username}).exec()
        if (!checkUser || checkUser.password !== password) {
            return res.status(403).send("Invalid login.")
        }

        const userId = checkUser._id
        const checkTodos = await TodoList.findOne({userId}).exec()

        if (!checkTodos) {
            const newTodoList = await new TodoList({
                todoList: todoListItems,
                userId: userId._id
            })

            await newTodoList.save()
        } else {
            checkTodos.todoList = todoListItems
            await checkTodos.save()
        }

        return res.status(200).send("Todo list updated successfully.")
    } catch (error) {
        // console.error('Error updating todo list:', error);
        return res.status(500).send("Internal Server Error")
    }

})

app.delete('/todolist/:id', async (req, res) => {
    const {authorization} = req.headers
    const [, token] = authorization?.split(' ')
    const [username, password] = token.split(':')
    const checkUser = await User.findOne({username}).exec()

    if (!checkUser || checkUser.password !== password) {
        return res.status(403).send("Invalid login.")
    }

    const userId = checkUser._id

    try {
        await TodoList.findOneAndUpdate(
            {userId},
            {$pull: {updatedAt: new Date()}},
            {new: true}
        ).lean().exec()

        res.status(200).send("Todo deleted successfully.")

    } catch (err) {
        // console.error('Error fetching todo list:', err)
        res.status(500).send("Internal Server Error")
    }

})
// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
// })
