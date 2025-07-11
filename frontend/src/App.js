import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StatusFamiliar from './StatusFamiliar';
import Logs from './Logs';
import './App.css';
import FalecidoDetalhe from './FalecidoDetalhe';
import EtapasStatus from './EtapasStatus';
import Usuarios from './Usuarios';
import Carros from './Carros';

// Componente para selecionar placa de carro em cada card
function PlacaSelector({ falecidoId }) {
  const [placaSelecionada, setPlacaSelecionada] = React.useState('');
  const [placas, setPlacas] = React.useState([]);
  const [falecidoNome, setFalecidoNome] = React.useState('');
  const usuarioLogado = React.useMemo(() => {
    return JSON.parse(localStorage.getItem('usuarioLogado')||'{}');
  }, []);

  // Carregar placas e placa previamente selecionada
  React.useEffect(() => {
    const salvas = localStorage.getItem('carrosCadastrados');
    setPlacas(salvas ? JSON.parse(salvas) : []);
    // Carregar placa salva para esse falecido
    const placasUsadas = JSON.parse(localStorage.getItem('placasUsadas')||'{}');
    if (placasUsadas[falecidoId]) setPlacaSelecionada(placasUsadas[falecidoId].placa);
    // Buscar nome do falecido
    const falecidos = JSON.parse(localStorage.getItem('falecidosCache')||'[]');
    const f = falecidos.find(f => f.id === falecidoId);
    if (f) setFalecidoNome(f.nome);
  }, [falecidoId]);

  // Salvar placa selecionada e logar ação
  function handleChange(e) {
    const novaPlaca = e.target.value;
    setPlacaSelecionada(novaPlaca);
    // Salvar seleção
    const placasUsadas = JSON.parse(localStorage.getItem('placasUsadas')||'{}');
    placasUsadas[falecidoId] = { placa: novaPlaca, data: new Date().toISOString() };
    localStorage.setItem('placasUsadas', JSON.stringify(placasUsadas));
    // Logar ação
    if (novaPlaca) {
      const logs = JSON.parse(localStorage.getItem('logsSistema')||'[]');
      logs.unshift({
        tipo: 'USO_PLACA',
        usuario: usuarioLogado.nome || 'Desconhecido',
        placa: novaPlaca,
        falecido: falecidoNome || falecidoId,
        data: new Date().toISOString()
      });
      localStorage.setItem('logsSistema', JSON.stringify(logs));
    }
  }

  return (
    <select
      value={placaSelecionada}
      onChange={handleChange}
      style={{padding:'6px 12px',borderRadius:6,border:'1.5px solid #00eaff',fontWeight:600,background:'#23283b',color:'#00eaff',marginRight:12,minWidth:120}}
    >
      <option value="">Selecione a placa</option>
      {placas.map(placa => (
        <option key={placa} value={placa}>{placa}</option>
      ))}
    </select>
  );
}


import FalecidoTimeline from './FalecidoTimeline';
import Login from './Login';

const etapas = ['Atendimento', 'Remoção', 'Tanato', 'Ornamentação', 'Velório', 'Sepultamento'];

function PainelAdmin({ onLogout }) {
  // Usuário logado
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')||'{}');
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [confirmacao, setConfirmacao] = useState({ tipo: '', falecido: null });
  const [sucesso, setSucesso] = useState('');
  const [falecidos, setFalecidos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;
  const totalPaginas = Math.ceil(falecidos.length / porPagina);
  const falecidosPagina = falecidos.slice((pagina - 1) * porPagina, pagina * porPagina);
  const [detalheId, setDetalheId] = useState(null);
  const [refreshDetalhe, setRefreshDetalhe] = useState(0);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [documento, setDocumento] = useState('');
  const [unidade, setUnidade] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [showCadastro, setShowCadastro] = useState(false);

  const fetchFalecidos = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/falecidos');
      const data = await res.json();
      setFalecidos(data);
    } catch (e) {
      setErro('Erro ao carregar falecidos');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFalecidos();
  }, []);

  // Salva lista de falecidos no localStorage para uso do PlacaSelector
  useEffect(() => {
    if (falecidos.length > 0) {
      localStorage.setItem('falecidosCache', JSON.stringify(falecidos));
    }
  }, [falecidos]);
  useEffect(() => {
    // Se a página atual ficar inválida após exclusão, volta para a última página válida
    if (pagina > Math.ceil(falecidos.length / porPagina) && falecidos.length > 0) {
      setPagina(Math.ceil(falecidos.length / porPagina));
    }
  }, [falecidos]);

  const cadastrarFalecido = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('idade', idade);
      formData.append('documento', documento);
      formData.append('unidade', unidade);
      formData.append('responsavel', responsavel);
      if (foto) formData.append('foto', foto);

      const res = await fetch('http://localhost:3001/api/falecidos', {
        method: 'POST',
        headers: {
          'x-usuario': localStorage.getItem('usuarioLogado') || '{}'
        },
        body: formData
      });
      if (!res.ok) throw new Error('Erro ao cadastrar');
      setNome(''); setIdade(''); setDocumento(''); setUnidade(''); setResponsavel(''); setFoto(null); setFotoPreview(null);
      setShowCadastro(false);
      fetchFalecidos();
    } catch {
      setErro('Erro ao cadastrar');
    }
  };


  const avancarEtapa = async (id, etapaAtual) => {
    const idx = etapas.indexOf(etapaAtual);
    if (idx < etapas.length - 1) {
      const proxima = etapas[idx + 1];
      await fetch(`http://localhost:3001/api/falecidos/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: proxima })
      });
      fetchFalecidos();
      setSucesso('Ação realizada com sucesso!');
      setTimeout(() => setSucesso(''), 1800);
      setRefreshDetalhe(r => r + 1);
    }
  };

  const voltarEtapa = async (id, etapaAtual) => {
    const idx = etapas.indexOf(etapaAtual);
    if (idx > 0) {
      const anterior = etapas[idx - 1];
      await fetch(`http://localhost:3001/api/falecidos/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: anterior })
      });
      fetchFalecidos();
      setSucesso('Ação realizada com sucesso!');
      setTimeout(() => setSucesso(''), 1800);
      setRefreshDetalhe(r => r + 1);
    }
  };


  const excluirFalecido = async (id) => {
    await fetch(`http://localhost:3001/api/falecidos/${id}`, {
      method: 'DELETE',
      headers: {
        'x-usuario': localStorage.getItem('usuarioLogado') || '{}'
      }
    });
    fetchFalecidos();
    setSucesso('Falecido excluído com sucesso!');
    setTimeout(() => setSucesso(''), 1800);
    setRefreshDetalhe(r => r + 1);
  };

  function abrirConfirmacao(tipo, falecido) {
    setConfirmacao({ tipo, falecido });
  }

  function fecharConfirmacao() {
    setConfirmacao({ tipo: '', falecido: null });
  }

  async function confirmarAcao() {
    if (!confirmacao.falecido) return;
    if (confirmacao.tipo === 'voltar') await voltarEtapa(confirmacao.falecido.id, confirmacao.falecido.status);
    if (confirmacao.tipo === 'avancar') await avancarEtapa(confirmacao.falecido.id, confirmacao.falecido.status);
    if (confirmacao.tipo === 'excluir') await excluirFalecido(confirmacao.falecido.id);
    fecharConfirmacao();
  }

  if (detalheId) {
    return <FalecidoDetalhe id={detalheId} onVoltar={() => { setDetalheId(null); fetchFalecidos(); }} refresh={refreshDetalhe} />;
  }

  return (
    <div className="app-container" style={{position:'relative'}}>
      <button
        className="btn-logout"
        style={{position:'absolute',top:18,right:18,background:'linear-gradient(90deg,#00eaff 0%,#005d7a 100%)',color:'#fff',border:'none',borderRadius:8,padding:'8px 22px',fontWeight:700,fontSize:'1.05rem',boxShadow:'0 2px 12px #00eaff33',cursor:'pointer',letterSpacing:'1px',transition:'filter 0.2s',zIndex:2000}}
        onClick={onLogout}
      >Logout</button>

      {confirmacao.falecido && (
        <div className="modal-bg">
          <div className="modal-form" style={{maxWidth:340}}>
            <h2>Confirmação</h2>
            <p style={{marginBottom:18}}>
              {confirmacao.tipo === 'voltar' && 'Deseja realmente voltar a etapa deste falecido?'}
              {confirmacao.tipo === 'avancar' && 'Deseja realmente avançar a etapa deste falecido?'}
              {confirmacao.tipo === 'excluir' && 'Deseja realmente excluir este falecido?'}
            </p>
            <div style={{display:'flex',gap:14,justifyContent:'center'}}>
              <button className="btn-cadastrar" onClick={confirmarAcao}>Confirmar</button>
              <button className="btn-cadastrar" style={{background:'#23283b',color:'#00eaff',border:'1.5px solid #00eaff'}} onClick={fecharConfirmacao}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {sucesso && <div className="sucesso-msg">{sucesso}</div>}
      <div style={{display:'flex', gap:16, marginBottom: 30 }}>
        <Link to="/" style={{
          color: window.location.pathname === '/' ? '#00eaff' : '#fff',
          fontWeight: 700,
          fontSize: 18,
          textDecoration: 'none',
          padding: '7px 18px',
          borderRadius: '8px',
          background: window.location.pathname === '/' ? '#19202e' : 'none',
          boxShadow: window.location.pathname === '/' ? '0 2px 12px #00eaff22' : 'none'
        }}>
          Painel
        </Link>
        {(usuarioLogado.cargo === 'Dev' || usuarioLogado.cargo === 'Atendente') && (
           <>
             <Link to="/usuarios" style={{
               color: window.location.pathname === '/usuarios' ? '#00eaff' : '#fff',
               fontWeight: 700,
               fontSize: 18,
               textDecoration:'none',
               padding:'7px 18px',
               borderRadius:'8px',
               background: window.location.pathname === '/usuarios' ? '#19202e' : 'none',
               boxShadow: window.location.pathname === '/usuarios' ? '0 2px 12px #00eaff22' : 'none'
             }}>
               Usuários
             </Link>
             <Link to="/carros" style={{
               color: window.location.pathname === '/carros' ? '#00eaff' : '#fff',
               fontWeight: 700,
               fontSize: 18,
               textDecoration:'none',
               padding:'7px 18px',
               borderRadius:'8px',
               background: window.location.pathname === '/carros' ? '#19202e' : 'none',
               boxShadow: window.location.pathname === '/carros' ? '0 2px 12px #00eaff22' : 'none'
             }}>
               Carros
             </Link>
           </>
         )}
      </div>
      <img src="/logo-sao-francisco.png" alt="Logo Grupo São Francisco" className="logo" />
      <h1>Grupo São Francisco - Painel de Administração</h1>
      {(usuarioLogado.cargo === 'Dev' || usuarioLogado.cargo === 'Atendente') && (
        <button className="btn-cadastrar" onClick={() => setShowCadastro(true)} style={{marginBottom: 24}}>
          Cadastrar Falecido
        </button>
      )}

      {loading && <div>Carregando...</div>}
      {erro && <div style={{color:'red'}}>{erro}</div>}
      {falecidos.length === 0 && !loading && <div>Nenhum falecido cadastrado.</div>}
      {falecidos.length > 0 && (
        <>
        <div className="lista-falecidos">
          {falecidosPagina.map(falecido => (
            <div key={falecido.id} className="card-falecido" style={{background:'#23283b', margin:'18px 0', padding:24, borderRadius:14, boxShadow:'0 2px 12px #00eaff22', display:'flex', alignItems:'center', gap:24, position:'relative'}}>
              <img 
                src={`http://localhost:3001/api/falecidos/${falecido.id}/foto`} 
                alt={falecido.nome} 
                style={{width:80, height:80, borderRadius:'50%', objectFit:'cover', boxShadow:'0 1px 8px #00eaff55', border:'2.5px solid #00eaff55', background:'#111'}} 
                onError={e => { e.target.onerror = null; e.target.src = '/foto-generica.png'; }}
              />
              <div style={{flex:1}}>
                <div style={{fontWeight:700, fontSize:'1.15rem', color:'#00eaff'}}>{falecido.nome}</div>
                <div style={{fontSize:'1.05rem', color:'#e5eaff', margin:'2px 0 4px 0'}}>{falecido.idade} anos</div>
                <div style={{fontSize:'0.98rem', color:'#aeeaff'}}>Nº Familiar: {falecido.documento}</div>
                <div style={{marginTop:16, display:'flex', alignItems:'center', gap:12}}>
                  <FalecidoTimeline falecidoId={falecido.id} statusAtual={falecido.status} />
                </div>
              </div>
              <div style={{position:'absolute', top:10, right:10, display:'flex', flexDirection:'row', gap:10, alignItems:'center', zIndex:2}}>
                <PlacaSelector falecidoId={falecido.id} />
                <a
                  href={`/status?id=${falecido.id}&token=${falecido.documento}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{background:'#19202e',color:'#00eaff',border:'1.5px solid #00eaff',borderRadius:6,padding:'6px 18px',fontWeight:700,cursor:'pointer',textDecoration:'none'}}
                >Página Pública</a>
                {(usuarioLogado.cargo === 'Dev' || usuarioLogado.cargo === 'Atendente') && (
                  <button onClick={() => abrirConfirmacao('excluir', falecido)} style={{background:'#e53e3e',color:'#fff',border:'none',borderRadius:6,padding:'6px 18px',fontWeight:700,cursor:'pointer'}}>Excluir</button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Controles de paginação */}
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:16,marginTop:16}}>
          <button onClick={()=>setPagina(p=>Math.max(1,p-1))} disabled={pagina===1} style={{padding:'6px 18px',borderRadius:8,background:'#222a3b',color:'#00eaff',border:'none',fontWeight:700,cursor:pagina===1?'not-allowed':'pointer'}}>Anterior</button>
          <span style={{color:'#e5eaff',fontWeight:600,fontSize:'1.07rem'}}>Página {pagina} / {totalPaginas||1}</span>
          <button onClick={()=>setPagina(p=>Math.min(totalPaginas,p+1))} disabled={pagina===totalPaginas||totalPaginas===0} style={{padding:'6px 18px',borderRadius:8,background:'#222a3b',color:'#00eaff',border:'none',fontWeight:700,cursor:pagina===totalPaginas||totalPaginas===0?'not-allowed':'pointer'}}>Próxima</button>
        </div>
        </>
      )}

      {showCadastro && (
        <div className="modal-bg">
          <div className="modal-form">
            <h2>Novo Falecido</h2>
            <form onSubmit={cadastrarFalecido} style={{display:'flex',flexDirection:'column',gap:18,alignItems:'stretch'}} encType="multipart/form-data">
              <input required placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
              <input required type="number" placeholder="Idade" value={idade} onChange={e => setIdade(e.target.value)} />
              <input required placeholder="Número Familiar" value={documento} onChange={e => setDocumento(e.target.value)} />
              <select required value={unidade} onChange={e => setUnidade(e.target.value)} style={{background:'#23283b',color:'#e5eaff',border:'1.5px solid #00eaff55',borderRadius:6,padding:'8px 10px',fontSize:'1rem',marginBottom:8}}>
                <option value="" disabled>Unidade</option>
                <option value="Cachoeirinha">Cachoeirinha</option>
                <option value="Santo Antônio">Santo Antônio</option>
                <option value="Santa Rita">Santa Rita</option>
              </select>
              <input required placeholder="Nome do Responsável" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files[0];
                setFoto(file);
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setFotoPreview(reader.result);
                  reader.readAsDataURL(file);
                } else {
                  setFotoPreview(null);
                }
              }} style={{marginTop:4}} />
              {fotoPreview && (
                <div style={{display:'flex',justifyContent:'center',margin:'10px 0'}}>
                  <img src={fotoPreview} alt="preview" style={{width:80,height:80,borderRadius:'50%',objectFit:'cover',boxShadow:'0 1px 6px #00eaff55'}} />
                </div>
              )}
              <div style={{display:'flex',gap:16,justifyContent:'center',marginTop:8}}>
                <button type="submit">Cadastrar</button>
                <button type="button" onClick={() => { setShowCadastro(false); setNome(''); setIdade(''); setDocumento(''); setFoto(null); setFotoPreview(null); }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Link para Logs (apenas Dev) */}
      {usuarioLogado.cargo === 'Dev' && (
        <div style={{position:'fixed',top:18,left:18,zIndex:2000}}>
          <Link to="/logs" style={{background:'#23283b',color:'#00eaff',padding:'10px 22px',borderRadius:12,textDecoration:'none',fontWeight:700,boxShadow:'0 2px 12px #00eaff44'}}>Ver Logs do Sistema</Link>
        </div>
      )}
      {/* Notificador de usuário online */}
      <div style={{position:'fixed',top:18,right:18,zIndex:2000,display:'flex',alignItems:'center',gap:10,background:'#23283b',padding:'10px 22px',borderRadius:12,boxShadow:'0 2px 12px #00eaff44'}}>
        <span style={{width:13,height:13,borderRadius:'50%',background:'#00eaff',display:'inline-block',marginRight:7,boxShadow:'0 0 6px #00eaff'}}></span>
        <span style={{color:'#e5eaff',fontWeight:700,fontSize:'1.08rem'}}>{usuarioLogado.nome || 'Usuário'}</span>
        <span style={{color:'#00eaff',fontWeight:600,fontSize:'0.95rem',marginLeft:8}}>{usuarioLogado.cargo ? `(${usuarioLogado.cargo})` : ''}</span>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';

function App() {
  const [autenticado, setAutenticado] = React.useState(() => {
    // Persistência: verifica se há usuário logado no localStorage
    return !!localStorage.getItem('usuarioLogado');
  });
  const navigate = useNavigate();

  const handleLogin = (user) => {
    localStorage.setItem('usuarioLogado', JSON.stringify(user));
    setAutenticado(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setAutenticado(false);
    navigate('/'); // Redireciona para login
  };

  return (
    <Routes>
      {!autenticado && <Route path="/*" element={<Login onLogin={handleLogin} />} />}
      {autenticado && <>
        <Route path="/status" element={<StatusFamiliar />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/carros" element={<Carros />} />
        {/* Rota Logs só para Dev */}
        {JSON.parse(localStorage.getItem('usuarioLogado')||'{}').cargo === 'Dev' && (
          <Route path="/logs" element={<Logs />} />
        )}
        <Route path="/*" element={<PainelAdmin onLogout={handleLogout} />} />
      </>}
    </Routes>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
