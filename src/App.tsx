import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NavigationBar from "./components/NavigationBar";
import Repertoire from "./components/repertoire/Repertoire";
import { LoginContext } from "./contexts/LoginContext";
import { useEffect, useState } from "react";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import { getTokenIfExists } from "./utils/token";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    getTokenIfExists(setLoggedIn)
  }, [])
  

  return (
    <div className="flex flex-col">
      <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/repertoire" element={<Repertoire />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
