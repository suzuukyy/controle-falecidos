import React, { useEffect, useState } from 'react';
import './App.css';

const etapas = ['Atendimento', 'Remoção', 'Tanato', 'Ornamentação', 'Velório', 'Sepultamento'];

export default function StatusFamiliar() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const token = params.get('token');
  const [falecido, setFalecido] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErro('');
      try {
        // Aqui você pode validar o token se quiser
        const res = await fetch(`http://localhost:3001/api/falecidos`);
        const lista = await res.json();
        const found = lista.find(f => String(f.id) === String(id) && (!token || String(f.documento) === String(token)));
        if (!found) throw new Error('Falecido não encontrado ou acesso não autorizado.');
        setFalecido(found);
        const histRes = await fetch(`http://localhost:3001/api/falecidos/${id}/historico`);
        const hist = await histRes.json();
        setHistorico(hist);
      } catch (e) {
        setErro(e.message);
      }
      setLoading(false);
    }
    fetchData();
  }, [id, token]);

  if (loading) return <div className="app-container"><p>Carregando informações...</p></div>;
  if (erro) return <div className="app-container"><p style={{color:'#ff5252'}}>{erro}</p></div>;
  if (!falecido) return <div className="app-container"><p>Falecido não encontrado.</p></div>;

  return (
    <div className="app-container">
      <img src="/logo-sao-francisco.png" alt="Logo Grupo São Francisco" className="logo" style={{marginBottom:16}} />
      <h2 style={{color:'#00eaff',marginBottom:12}}>Acompanhamento do Serviço</h2>
      <div style={{marginBottom:18}}>
        <b>Nome:</b> {falecido.nome}<br/>
        <b>Idade:</b> {falecido.idade}<br/>
        <b>Número Familiar:</b> {falecido.documento}<br/>
        <b>Unidade:</b> {falecido.unidade || '-'}<br/>
        <b>Responsável:</b> {falecido.responsavel || '-'}
      </div>
      <h3 style={{color:'#00eaff',marginBottom:18,marginTop:24}}>Status das Etapas</h3>
      <table className="tabela-etapas" style={{width:'100%',marginTop:18,background:'#23283c',borderRadius:8}}>
        <thead>
          <tr style={{color:'#00eaff',fontWeight:'bold'}}>
            <th style={{padding:'8px'}}>Etapa</th>
            <th style={{padding:'8px'}}>Início</th>
            <th style={{padding:'8px'}}>Fim</th>
          </tr>
        </thead>
        <tbody>
          {etapas.map(etapa => {
            const realizado = historico.find(h => h.etapa === etapa);
            return (
              <tr key={etapa} style={{textAlign:'center',color:realizado?'#fff':'#888'}}>
                <td style={{padding:'8px'}}>{etapa}</td>
                <td style={{padding:'8px'}}>{realizado && realizado.inicio ? (() => { const d = new Date(realizado.inicio + 'Z'); d.setMinutes(d.getMinutes() + 1.2); return d.toLocaleString('pt-BR'); })() : '-'}</td>
                <td style={{padding:'8px'}}>{realizado && realizado.fim ? (() => { const d = new Date(realizado.fim + 'Z'); d.setMinutes(d.getMinutes() + 1.2); return d.toLocaleString('pt-BR'); })() : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
