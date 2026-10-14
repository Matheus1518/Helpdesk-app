import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function Dashboard() {
  const [chamados, setChamados] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Hardware');
  const [prioridade, setPrioridade] = useState('media');
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userLocal = localStorage.getItem('usuario');
    if (!userLocal) {
      navigate('/login');
      return;
    }
    setUsuario(JSON.parse(userLocal));
    carregarChamados();
  }, []);

  const carregarChamados = async () => {
    try {
      const response = await api.get('/chamados');
      setChamados(response.data);
    } catch (erro) {
      console.error('Erro ao carregar chamados:', erro);
    }
  };

  const handleCriarChamado = async (e) => {
    e.preventDefault();
    try {
      await api.post('/chamados', { titulo, descricao, categoria, prioridade });
      setTitulo('');
      setDescricao('');
      carregarChamados();
    } catch (erro) {
      alert(erro.response?.data?.mensagem || 'Erro ao criar chamado.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>HelpDesk - Painel</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Olá, <strong>{usuario?.nome}</strong> ({usuario?.tipo})</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
        </div>
      </header>

      <div style={styles.content}>
        {/* Formulário de Abertura de Chamado (Apenas Clientes) */}
        {usuario?.tipo === 'cliente' && (
          <div style={styles.cardForm}>
            <h3>Abrir Novo Chamado</h3>
            <form onSubmit={handleCriarChamado}>
              <input 
                type="text" 
                placeholder="Título do chamado" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)} 
                style={styles.input} 
                required 
              />
              <textarea 
                placeholder="Descrição detalhada do problema..." 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                style={{ ...styles.input, height: '80px' }} 
                required 
              />
              <div style={styles.row}>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={styles.input}>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Rede">Rede</option>
                  <option value="Outros">Outros</option>
                </select>

                <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)} style={styles.input}>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <button type="submit" style={styles.button}>Abrir Chamado</button>
            </form>
          </div>
        )}

        {/* Lista de Chamados */}
        <div style={styles.cardList}>
          <h3>Chamados em Aberto</h3>
          {chamados.length === 0 ? (
            <p>Nenhum chamado encontrado.</p>
          ) : (
            <div style={styles.grid}>
              {chamados.map((item) => (
                <div key={item.id} style={styles.ticketCard} onClick={() => navigate(`/chamado/${item.id}`)}>
                  <h4>#{item.id} - {item.titulo}</h4>
                  <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>{item.descricao}</p>
                  <div style={styles.badgeRow}>
                    <span style={styles.badge}>Status: {item.status}</span>
                    <span style={styles.badge}>Prioridade: {item.prioridade}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#007bff', color: '#fff', padding: '15px 30px' },
  logoutBtn: { padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  content: { padding: '30px', maxWidth: '1000px', margin: '0 auto' },
  cardForm: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' },
  cardList: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  row: { display: 'flex', gap: '10px' },
  button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  grid: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' },
  ticketCard: { padding: '15px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fafafa' },
  badgeRow: { display: 'flex', gap: '10px', marginTop: '8px' },
  badge: { fontSize: '12px', backgroundColor: '#e9ecef', padding: '4px 8px', borderRadius: '4px', color: '#495057' }
};