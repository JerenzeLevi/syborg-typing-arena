import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AmbientGrid from "./components/AmbientGrid";
import ParticleField from "./components/ParticleField";
import SystemStatus from "./components/SystemStatus";
import CursorGlow from "./components/CursorGlow";
import RandomFlicker from "./components/RandomFlicker";
import HomePage from "./pages/HomePage";
import PlayPage from "./pages/PlayPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import CreatorPage from "./pages/CreatorPage";
import CompetePage from "./pages/CompetePage";
import LiveMatchPage from "./pages/LiveMatchPage";

function App() {
  return (
    <BrowserRouter>
      <div className="relative flex min-h-screen flex-col bg-syb-black">
        <div className="noise-overlay" />
        <AmbientGrid />
        <ParticleField />
        <SystemStatus />
        <CursorGlow />
        <RandomFlicker />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/play" element={<PlayPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/compete" element={<CompetePage />} />
              <Route path="/compete/:code" element={<LiveMatchPage />} />
              <Route path="/creator" element={<CreatorPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
