import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NavigationBar from "./components/NavigationBar";
import Repertoire from "./components/Repertoire";

function App() {
  return (
    <div className="flex flex-col">
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repertoire" element={<Repertoire />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </div>
  );
}

export default App;
