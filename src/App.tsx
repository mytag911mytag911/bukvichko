import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import LearningMode from './pages/LearningMode';
import ChallengeMode from './pages/ChallengeMode';
import ChallengeSelect from './pages/ChallengeSelect';
import Collection from './pages/Collection';
import MemoryGame from './pages/MemoryGame';
import Settings from './pages/Settings';
import Progress from './pages/Progress';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full overflow-hidden">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/learn" element={<LearningMode />} />
          <Route path="/challenge" element={<ChallengeSelect />} />
          <Route path="/challenge/:wordCount" element={<ChallengeMode />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/memory" element={<MemoryGame />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
