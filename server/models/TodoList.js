const mongoose = require('mongoose')
// const {ObjectId} = require("mongodb")
const Schema = mongoose.Schema

const TodoListSchema = new Schema({
    todoList: [
        {
            checked: Boolean,
            content: String
        }
    ],
    userId: Schema.ObjectId
})

const TodoList = mongoose.model('TodoList', TodoListSchema)

module.exports = TodoList