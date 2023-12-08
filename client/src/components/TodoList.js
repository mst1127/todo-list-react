import "./TodoList.css"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CloseIcon from "@mui/icons-material/Close"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import {useContext, useEffect, useState} from "react"
import axios from "axios"
import {Credentials} from "../App"
import {API_URL} from "../helpers"

const TodoList = () => {
    const [todos, setTodos] = useState([])
    const [todoContent, setTodoContent] = useState("")
    const [credentials] = useContext(Credentials)
    const saveTodos = async (newTodos) => {
        await axios
            .post(`${API_URL}/todolist`, JSON.stringify(newTodos), {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${credentials.username}:${credentials.password}`,
                },
            })
            .then(() => {
            })
    }

    useEffect(() => {
        const fetchTodoList = async () => {
            const res = await axios.get(`${API_URL}/todolist`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${credentials.username}:${credentials.password}`,
                },
            })
            setTodos(res.data)
        }

        fetchTodoList()
    }, [credentials])
    const addNewTodo = (e) => {
        e.preventDefault()
        if (!todoContent) return

        const newTodo = {checked: false, content: todoContent}
        const newTodoList = [...todos, newTodo]

        setTodos(newTodoList)
        setTodoContent("")

        saveTodos(newTodoList)
    }
    const checkHandler = (index) => {
        const newTodoList = [...todos]
        newTodoList[index].checked = !newTodoList[index].checked
        setTodos(newTodoList)
        saveTodos(newTodoList)
    }
    const deleteHandler = async (index) => {
        const newTodoList = [...todos]
        const deleteTodo = newTodoList.splice(index, 1)[0]
        setTodos(newTodoList)

        saveTodos(newTodoList)

        await axios.delete(`${API_URL}/todolist/${deleteTodo.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials.username}:${credentials.password}`,
            },
        })
    }

    return (
        <>
            <div className="todoContainer">
                <form className="addNewTodo" onSubmit={addNewTodo}>
                    <h5>ADD A NEW TASK</h5>
                    <input
                        type="text"
                        onChange={(e) => setTodoContent(e.target.value)}
                        value={todoContent}
                    />
                    <button type="submit">ADD</button>
                </form>

                {todos.map((todo, index) => (
                    <div
                        className={
                            todos[index]?.checked ? "todoItem todoItemCompleted" : "todoItem "
                        }
                        key={index}
                    >
                        {todos[index]?.checked ? (
                            <CheckBoxIcon
                                className="checkbox"
                                onClick={() => checkHandler(index)}
                            />
                        ) : (
                            <CheckBoxOutlineBlankIcon
                                className="checkbox"
                                onClick={() => checkHandler(index)}
                            />
                        )}
                        <div className="todoContent">{todo.content}</div>
                        <CloseIcon
                            className="delTodo"
                            onClick={() => deleteHandler(index)}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

export default TodoList 
