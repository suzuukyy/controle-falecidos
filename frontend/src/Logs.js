import React, { useEffect, useState } from 'react';

export default function Logs() {
  const [systemTime, setSystemTime] = useState(new Date());
  const [logs, setLogs] = useState([]);
  const [erro, setErro] = useState('');
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado')||'{}');
  const fetchLogs = () => {
    // Buscar logs do backend
    fetch('http://localhost:3001/api/logs', {
      headers: { 'x-cargo': usuario.cargo }
    })
      .then(r => r.json())
      .then(data => {
        let backendLogs = Array.isArray(data) ? data : [];
        // Buscar logs do localStorage
        const localLogs = JSON.parse(localStorage.getItem('logsSistema')||'[]');
        // Adaptar formato dos logs locais para a tabela
        const adaptados = localLogs.map((log, idx) => ({
          id: 'local-'+idx,
          usuario: log.usuario,
          acao: log.tipo === 'USO_PLACA' ? 'Selecionou placa' : log.tipo || 'Ação',
          detalhes: log.placa && log.falecido ? `Placa: ${log.placa} / Falecido: ${log.falecido}` : (log.detalhes || ''),
          data: log.data
        }));
        setLogs([...adaptados, ...backendLogs]);
      })
      .catch(() => {
        // Se falhar o backend, mostrar só os logs locais
        const localLogs = JSON.parse(localStorage.getItem('logsSistema')||'[]');
        const adaptados = localLogs.map((log, idx) => ({
          id: 'local-'+idx,
          usuario: log.usuario,
          acao: log.tipo === 'USO_PLACA' ? 'Selecionou placa' : log.tipo || 'Ação',
          detalhes: log.placa && log.falecido ? `Placa: ${log.placa} / Falecido: ${log.falecido}` : (log.detalhes || ''),
          data: log.data
        }));
        setLogs(adaptados);
      });
  };


  useEffect(() => {
    const interval = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (usuario.cargo !== 'Dev') return setErro('Acesso negado!');
    fetchLogs();
  }, []);

  const limparLogsDia = async () => {
    setErro('');
    // Limpar logs do backend
    const resp = await fetch('http://localhost:3001/api/logs/dia', {
      method: 'DELETE',
      headers: { 'x-cargo': usuario.cargo }
    });
    const data = await resp.json();
    if (data.ok) {
      fetchLogs();
    } else {
      setErro(data.erro || 'Erro ao limpar logs do dia.');
    }
  };


  if (erro) return <div style={{color:'#e53e3e',padding:30}}>{erro}</div>;
  const voltarAdmin = () => {
    window.location.href = '/admin';
  };

  return (
    <div style={{padding:30}}>
      <div style={{ background: '#222', color: '#fff', padding: 16, borderRadius: 8, maxWidth: 700, margin: '32px auto', boxShadow: '0 2px 8px #0008' }}>
        <div style={{fontSize: 16, marginBottom: 10, textAlign: 'right', color: '#ccc'}}>
          Hora do sistema: {systemTime.toLocaleString('pt-BR')}
        </div>
      </div>
      <h2 style={{color:'#00eaff'}}>Logs do Sistema</h2>
      <button onClick={voltarAdmin} style={{marginBottom:20,marginRight:10,background:'#444',color:'#fff',border:'none',padding:'8px 16px',borderRadius:4,cursor:'pointer'}}>Voltar para Administração</button>
      {usuario.cargo === 'Dev' && (
        <button onClick={limparLogsDia} style={{marginBottom:20,background:'#e53e3e',color:'#fff',border:'none',padding:'8px 16px',borderRadius:4,cursor:'pointer'}}>Limpar logs do dia</button>
      )}
      <table style={{width:'100%',marginTop:20,background:'#222',color:'#eee',borderRadius:8}}>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Ação</th>
            <th>Detalhes</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.usuario}</td>
              <td>{log.acao}</td>
              <td>{log.detalhes}</td>
              <td>{(() => { const d = new Date(log.data); d.setMinutes(d.getMinutes() + 60); return d.toLocaleString('pt-BR', { timeZone: 'America/Manaus' }); })()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
