
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { Upload } from "./Components/Upload";

function Home() {
  return <Upload />;
}

function About() {
  return <div className="p-8">About Page</div>;
}

function FAQ() {
  return <div className="p-8">FAQ Page</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </BrowserRouter>
  );
}
