import React, { useEffect, useState } from 'react';
import './App.css';

const todasEtapas = ['Atendimento', 'Remoção', 'Tanato', 'Ornamentação', 'Velório', 'Sepultamento'];

export default function FalecidoDetalhe({ id, onVoltar, refresh }) {
  const [falecido, setFalecido] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetalhe = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:3001/api/falecidos`);
    const lista = await res.json();
    const found = lista.find(f => f.id === id);
    setFalecido(found);
    const histRes = await fetch(`http://localhost:3001/api/falecidos/${id}/historico`);
    const hist = await histRes.json();
    setHistorico(hist);
    setLoading(false);
  };

  useEffect(() => {
    fetchDetalhe();
  }, [id, refresh]);

  if (loading) return <div className="app-container"><p>Carregando detalhes...</p></div>;
  if (!falecido) return <div className="app-container"><p>Falecido não encontrado.</p></div>;

  const avancarEtapa = async () => {
    if (!falecido) return;
    const idx = etapas.indexOf(falecido.status);
    if (idx < etapas.length - 1) {
      await fetch(`http://localhost:3001/api/falecidos/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-usuario': localStorage.getItem('usuarioLogado') || '{}'
        },
        body: JSON.stringify({ status: etapas[idx + 1] })
      });
      fetchDetalhe();
    }
  };

  const voltarEtapa = async () => {
    if (!falecido) return;
    const idx = etapas.indexOf(falecido.status);
    if (idx > 0) {
      await fetch(`http://localhost:3001/api/falecidos/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-usuario': localStorage.getItem('usuarioLogado') || '{}'
        },
        body: JSON.stringify({ status: etapas[idx - 1] })
      });
      fetchDetalhe();
    }
  };

  return (
    <div className="app-container">
      <button className="btn-cadastrar" onClick={onVoltar} style={{marginBottom: 18}}>Voltar para lista</button>
      <h2 style={{color:'#00eaff',marginBottom:12}}>Detalhes do Falecido</h2>
      <div style={{marginBottom:18}}>
        <b>Nome:</b> {falecido.nome}<br/>
        <b>Idade:</b> {falecido.idade}<br/>
        <b>Número Familiar:</b> {falecido.documento}<br/>
        <b>Unidade:</b> {falecido.unidade || '-'}<br/>
        <b>Responsável:</b> {falecido.responsavel || '-'}<br/>
        <b>Status Atual:</b> {falecido.status}
      </div>

      <h3 style={{color:'#00eaff',marginBottom:18,marginTop:24}}>Status das Etapas</h3>
      {/* Timeline filtrada pelo cargo do usuário */}
      <div className="etapas-timeline">
        {(() => {
          const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')||'{}');
          let etapas = todasEtapas;
          if (usuarioLogado.cargo === 'Tanatopraxista') {
            etapas = ['Tanato', 'Ornamentação'];
          }
          return etapas.map((etapa, idx) => {
            const realizado = historico.find(h => h.etapa === etapa);
            const isLast = idx === etapas.length - 1;
            return (
              <div className="etapa-card" key={etapa}>
                <div className={"etapa-icone " + (realizado ? 'etapa-ok' : 'etapa-pendente')}>
                  {realizado ? '✔' : '⏳'}
                </div>
                <div className="etapa-info">
                  <div className="etapa-nome">{etapa}</div>
                  <div className="etapa-status">
                    {realizado ? (
                      <span className="etapa-data">Concluída<br/>{new Date(realizado.data).toLocaleString('pt-BR')}</span>
                    ) : (
                      <span className="etapa-pendente-txt">Pendente</span>
                    )}
                  </div>
                </div>
                {!isLast && <div className="etapa-linha" />}
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
