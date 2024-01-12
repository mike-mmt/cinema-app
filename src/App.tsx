import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NavigationBar from "./components/NavigationBar";
import Repertoire from "./components/Repertoire";
import { LoginContext, LoginContextType } from "./contexts/LoginContext";
import { useEffect, useState } from "react";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import { getTokenIfExists } from "./utils/token";

function App() {
  const [loginState, setLoginState] = useState<LoginContextType>({
    isLoggedIn: false,
  });

  useEffect(() => {
    getTokenIfExists()
  }, [])
  

  return (
    <div className="flex flex-col">
      <LoginContext.Provider value={{ loginState, setLoginState }}>
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
