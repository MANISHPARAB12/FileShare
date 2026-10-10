import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";

function Home() {
  return <div className="p-8">Home Page</div>;
}

function About() {
  return <div className="p-8">About Page</div>;
}

function FAQ() {
  return <div className="p-8">FAQ Page</div>;
}

function Upload() {
  return <div className="p-8">Upload Files Page</div>;
}

function Login() {
  return <div className="p-8">Login Page</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}