import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export function ChamadoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chamado, setChamado] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [loading, setLoading] = useState(true);

  // Carregar dados do chamado e comentários
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        // 1. Procurar o chamado
        let chamadoData = null;
        try {
          const res = await api.get(`/chamados/${id}`);
          chamadoData = res.data;
        } catch {
          const resLista = await api.get('/chamados');
          chamadoData = resLista.data.find((c) => String(c.id) === String(id));
        }

        setChamado(chamadoData || null);

        // 2. Procurar os comentários
        try {
          const resComentarios = await api.get(`/comentarios/${id}`);
          setComentarios(resComentarios.data || []);
        } catch (errCom) {
          console.error('Erro ao buscar comentários:', errCom);
          setComentarios([]);
        }
      } catch (err) {
        console.error('Erro ao carregar detalhes:', err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id]);

  // Função para enviar novo comentário
  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    try {
      await api.post('/comentarios', {
        chamado_id: id,
        mensagem: novoComentario
      });

      setNovoComentario('');

      // Recarregar lista de comentários após envio
      const resComentarios = await api.get(`/comentarios/${id}`);
      setComentarios(resComentarios.data || []);
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
      alert('Não foi possível enviar o comentário. Verifique os dados e tente novamente.');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>A carregar detalhes do chamado...</div>;

  if (!chamado) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <p>Chamado não encontrado.</p>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
      >
        ← Voltar ao Painel
      </button>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>#{chamado.id} - {chamado.titulo}</h2>
        <p><strong>Descrição:</strong> {chamado.descricao}</p>
        <p><strong>Categoria:</strong> {chamado.categoria || 'Geral'}</p>
        <p><strong>Prioridade:</strong> {chamado.prioridade || 'Média'}</p>
        <p><strong>Status:</strong> {chamado.status || 'aberto'}</p>
      </div>

      <div style={{ background: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Comentários / Histórico</h3>

        <form onSubmit={handleEnviarComentario} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Escreva um comentário..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Enviar
          </button>
        </form>

        {comentarios.length === 0 ? (
          <p style={{ color: '#777' }}>Nenhum comentário registado.</p>
        ) : (
          comentarios.map((c) => (
            <div key={c.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#555' }}>
                <strong>{c.autor || 'Utilizador'}</strong> ({c.tipo_usuario || 'comentário'}):
              </p>
              <p style={{ margin: 0 }}>{c.mensagem}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}