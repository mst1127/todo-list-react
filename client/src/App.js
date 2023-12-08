import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import {createContext, useState} from "react";


export const Credentials = createContext()

function App() {
    const currentUser = useState(null)

    return (
        <div className="App">
            <Credentials.Provider value={currentUser}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/'>
                            <Route index element={<MainPage/>}></Route>
                            <Route path='/register' element={<Register/>}></Route>
                            <Route path='/login' element={<Login/>}></Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Credentials.Provider>


        </div>
    );
}

export default App;