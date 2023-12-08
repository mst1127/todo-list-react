import "./MainPage.css"
import {Link} from "react-router-dom";
import {Credentials} from "../App";
import {useContext} from "react";
import TodoList from "../components/TodoList"

const MainPage = () => {
    const [credentials, setCredentials] = useContext(Credentials)

    const handleLogout = () => {
        setCredentials(null)
    }


    return (
        <div className="mainPageContainer">

            <h1>Welcome! {credentials && credentials.username + '!'}</h1>
            {!credentials && <h2>Register or Login to Start Using TodoList!</h2>}
            {credentials && <h4>YOUR TASKS:</h4>}
            {!credentials && <button><Link to='/register' className='link'>Register</Link></button>}
            <br/>
            {!credentials && <button><Link to='/login' className='link'>Login</Link></button>}

            {credentials && <TodoList/>}

            {credentials && <button className='logoutBtn' onClick={handleLogout}>Logout</button>}

        </div>
    )
        ;
};

export default MainPage;