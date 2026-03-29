import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Reading from './pages/Reading'
import Topics from './pages/Topics'
import Sources from './pages/Sources'
import Position from './pages/Position'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/reading" replace />} />
          <Route path="reading" element={<Reading />} />
          <Route path="topics" element={<Topics />} />
          <Route path="sources" element={<Sources />} />
          <Route path="position" element={<Position />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
