import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ChamadoDetalhes } from './pages/ChamadoDetalhes'; // <-- Importe aqui

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rota dinâmica para os detalhes do chamado */}
        <Route path="/chamado/:id" element={<ChamadoDetalhes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;