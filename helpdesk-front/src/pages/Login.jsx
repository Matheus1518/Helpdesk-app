import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('cliente');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { email, senha });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        navigate('/dashboard');
      } else {
      await api.post('/auth/cadastrar', { nome, email, senha, tipo });
        setMensagem('Conta criada com sucesso! Faça login.');
        setIsLogin(true);
      }
    } catch (erro) {
      setMensagem(erro.response?.data?.mensagem || 'Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'Login HelpDesk' : 'Criar Conta'}</h2>
        {mensagem && <p style={styles.alert}>{mensagem}</p>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome Completo</label>
              <input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                style={styles.input}
                required 
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input}
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              style={styles.input}
              required 
            />
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tipo de Utilizador</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={styles.input}>
                <option value="cliente">Cliente</option>
                <option value="tecnico">Técnico</option>
              </select>
            </div>
          )}

          <button type="submit" style={styles.button}>
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <p style={styles.toggleText} onClick={() => { setIsLogin(!isLogin); setMensagem(''); }}>
          {isLogin ? 'Não tem conta? Registe-se' : 'Já tem conta? Faça login'}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  card: { backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '350px' },
  title: { color: '#333333', textAlign: 'center', marginBottom: '20px', fontFamily: 'Arial, sans-serif' },
  label: { color: '#555555', marginBottom: '5px', fontSize: '14px', fontFamily: 'Arial, sans-serif' },
  inputGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333', fontSize: '14px', outline: 'none' },
  button: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginTop: '10px' },
  alert: { padding: '8px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '10px', fontSize: '14px', textAlign: 'center' },
  toggleText: { marginTop: '15px', textAlign: 'center', color: '#007bff', cursor: 'pointer', fontSize: '14px', fontFamily: 'Arial, sans-serif' }
};