import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';

export default function App() {
  return (
    <main className="bg-primary text-tertiary">
      <Navbar/>
      <Routes>

      </Routes>
      <Admin/>
    </main>
  )
}