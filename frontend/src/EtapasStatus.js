import React, { useEffect, useState } from 'react';

const todasEtapas = ['Atendimento', 'Remoção', 'Tanato', 'Ornamentação', 'Velório', 'Sepultamento'];

export default function EtapasStatus({ falecidoId }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function fetchHistorico() {
      setLoading(true);
      setErro('');
      try {
        const res = await fetch(`http://localhost:3001/api/falecidos/${falecidoId}/historico`);
        if (!res.ok) throw new Error('Erro ao buscar histórico');
        const hist = await res.json();
        setHistorico(hist);
      } catch (e) {
        setErro('Erro ao buscar histórico');
      }
      setLoading(false);
    }
    if (falecidoId) fetchHistorico();
  }, [falecidoId]);

  if (!falecidoId) return null;
  if (loading) return <p>Carregando status das etapas...</p>;
  if (erro) return <div style={{color:'#fa3e3e'}}>{erro}</div>;

  // Descobre cargo do usuário logado
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')||'{}');
  let etapas = todasEtapas;
  if (usuarioLogado.cargo === 'Tanatopraxista') {
    etapas = ['Tanato', 'Ornamentação'];
  }

  return (
    <div style={{marginTop:16, marginBottom:12}}>
      <div style={{fontWeight:600, color:'#00eaff', fontSize:'1.09rem', marginBottom:6}}>Status das Etapas</div>
      <table className="tabela-etapas">
        <thead>
          <tr>
            <th>Etapa</th>
            <th>Início</th>
            <th>Fim</th>
          </tr>
        </thead>
        <tbody>
          {etapas.map(etapa => {
            const realizado = historico.find(h => h.etapa === etapa);
            const iniciada = realizado && realizado.inicio;
            const finalizada = realizado && realizado.fim;
            return (
              <tr key={etapa} style={{textAlign:'center',color:realizado?'#fff':'#888'}}>
                <td style={{padding:'8px'}}>{etapa}</td>
                <td style={{padding:'8px'}}>{iniciada ? new Date(realizado.inicio).toLocaleString('pt-BR') : '-'}</td>
                <td style={{padding:'8px'}}>{finalizada ? new Date(realizado.fim).toLocaleString('pt-BR') : '-'}</td>
                <td style={{padding:'8px'}}>
                  <button
                    style={{marginRight:6}}
                    disabled={iniciada}
                    onClick={async () => {
                      await fetch(`http://localhost:3001/api/falecidos/${falecidoId}/etapas/${encodeURIComponent(etapa)}/inicio`, {
      method: 'POST',
      headers: {
        'x-usuario': localStorage.getItem('usuarioLogado') || '{}'
      }
    });
                      setLoading(true); // força recarregar
                      const res = await fetch(`http://localhost:3001/api/falecidos/${falecidoId}/historico`);
                      setHistorico(await res.json());
                      setLoading(false);
                    }}
                  >Iniciar</button>
                  <button
                    disabled={!iniciada || finalizada}
                    onClick={async () => {
                      await fetch(`http://localhost:3001/api/falecidos/${falecidoId}/etapas/${encodeURIComponent(etapa)}/fim`, {
      method: 'POST',
      headers: {
        'x-usuario': localStorage.getItem('usuarioLogado') || '{}'
      }
    });
                      setLoading(true);
                      const res = await fetch(`http://localhost:3001/api/falecidos/${falecidoId}/historico`);
                      setHistorico(await res.json());
                      setLoading(false);
                    }}
                  >Parar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
