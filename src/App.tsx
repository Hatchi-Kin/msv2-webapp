import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import MusicLibraryPage from "./pages/MusicLibraryPage";
import Layout from "@/components/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/library" element={<MusicLibraryPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
