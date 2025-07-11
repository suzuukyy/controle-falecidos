import React, { useEffect, useState } from 'react';

const etapas = ['Atendimento', 'Remoção', 'Tanato', 'Ornamentação', 'Velório', 'Sepultamento'];

export default function FalecidoTimeline({ falecidoId, statusAtual }) {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const res = await fetch(`http://localhost:3001/api/falecidos/${falecidoId}/historico`);
        if (!res.ok) throw new Error('Erro ao buscar histórico');
        setHistorico(await res.json());
      } catch {
        setHistorico([]);
      }
    }
    fetchHistorico();
  }, [falecidoId]);

  async function iniciarEtapa(etapa) {
    await fetch(`http://localhost:3001/api/falecidos/${falecidoId}/etapas/${encodeURIComponent(etapa)}/inicio`, {
      method: 'POST',
      headers: {
        'x-usuario': localStorage.getItem('usuarioLogado') || '{}'
      }
    });
    // Atualiza timeline
    const res = await fetch(`http://localhost:3001/api/falecidos/${falecidoId}/historico`);
    setHistorico(await res.json());
  }
  async function pararEtapa(etapa) {
    await fetch(`http://localhost:3001/api/falecidos/${falecidoId}/etapas/${encodeURIComponent(etapa)}/fim`, {
      method: 'POST',
      headers: {
        'x-usuario': localStorage.getItem('usuarioLogado') || '{}'
      }
    });
    // Atualiza timeline
    const res = await fetch(`http://localhost:3001/api/falecidos/${falecidoId}/historico`);
    setHistorico(await res.json());
  }

  return (
    <div style={{display:'flex',alignItems:'flex-end',gap:10}}>
      {etapas.map((etapa, idx) => {
        const realizado = historico.find(h => h.etapa === etapa && h.fim);
        const atual = etapa === statusAtual;
        const iniciado = historico.find(h => h.etapa === etapa && h.inicio && !h.fim);
        return (
          <div key={etapa} style={{display:'flex',alignItems:'center',gap:0,position:'relative'}}>
            <div key={etapa} style={{display:'flex', flexDirection:'column', alignItems:'center', position:'relative', minWidth:60}}>
              <div style={{fontSize:12, color:'#00eaff', fontWeight:600, marginBottom:2, textAlign:'center', minHeight:16}}>{etapa}</div>
              <div
                title={etapa}
                style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: realizado ? '#00eaff' : atual ? '#fff' : iniciado ? '#00eaff33' : '#23283b',
                  border: realizado ? '2.5px solid #00eaff' : atual ? '2.5px solid #00eaff' : iniciado ? '2.5px solid #00eaff88' : '2.5px solid #444d5d',
                  boxShadow: realizado ? '0 0 8px #00eaff99' : '',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  color: realizado ? '#19202e' : atual ? '#00eaff' : iniciado ? '#00eaff' : '#888',
                  fontWeight:700,
                  fontSize: atual ? 16 : 13,
                  transition:'all .2s',
                  cursor:'pointer',
                  position:'relative',
                  zIndex:2,
                  marginBottom: 2
                }}
              >
                {realizado ? '✔' : iniciado ? '▶' : atual ? '●' : ''}
              </div>
              {/* Botões de ação sempre visíveis abaixo da bolinha */}
              {!realizado && !iniciado && (
                <button style={{background:'#00eaff',color:'#19202e',border:'none',borderRadius:5,padding:'2px 8px',fontWeight:600,fontSize:12,cursor:'pointer',marginTop:2}} onClick={()=>iniciarEtapa(etapa)}>Iniciar</button>
              )}
              {iniciado && !realizado && (
                <button style={{background:'#e53e3e',color:'#fff',border:'none',borderRadius:5,padding:'2px 8px',fontWeight:600,fontSize:12,cursor:'pointer',marginTop:2}} onClick={()=>pararEtapa(etapa)}>Parar</button>
              )}
            </div>
            {idx < etapas.length - 1 && (
              <div style={{width:22,height:3,background:realizado ? 'linear-gradient(90deg,#00eaff 60%,#23283b 100%)' : '#444d5d',margin:'0 0 0 0',borderRadius:2}} />
            )}
          </div>
        );
      })}
    </div>
  );
}
