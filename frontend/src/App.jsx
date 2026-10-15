
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Components/About";
import FAQ from "./Components/FAQ";
import Download from "./Components/Download";
import Upload from "./Components/Upload";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />

        <Route path="/upload" element={<Upload />} />
        <Route path="/download" element={<Download />} />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default App;