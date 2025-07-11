import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Carros() {
  const [placa, setPlaca] = useState('');
  const [carros, setCarros] = useState(() => {
    const salvo = localStorage.getItem('carrosCadastrados');
    return salvo ? JSON.parse(salvo) : [];
  });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const cadastrarPlaca = (e) => {
    e.preventDefault();
    setErro('');
    const placaFormatada = placa.trim().toUpperCase();
    if (!placaFormatada) {
      setErro('Digite uma placa válida!');
      return;
    }
    if (carros.includes(placaFormatada)) {
      setErro('Placa já cadastrada!');
      return;
    }
    const novosCarros = [placaFormatada, ...carros];
    setCarros(novosCarros);
    localStorage.setItem('carrosCadastrados', JSON.stringify(novosCarros));
    setPlaca('');
  };

  return (
    <div style={{padding:30, maxWidth:400, margin:'0 auto'}}>
      <button onClick={() => navigate('/')} style={{marginBottom:24,background:'#444',color:'#fff',border:'none',padding:'8px 16px',borderRadius:6,cursor:'pointer',fontWeight:700}}>Voltar para Administração</button>
      <h2 style={{color:'#00eaff'}}>Gestão de Carros</h2>
      <form onSubmit={cadastrarPlaca} style={{display:'flex',gap:10,marginBottom:24}}>
        <input
          type="text"
          placeholder="Digite a placa"
          value={placa}
          onChange={e => setPlaca(e.target.value)}
          style={{flex:1,padding:10,borderRadius:6,border:'1.5px solid #00eaff',fontSize:16}}
          maxLength={8}
        />
        <button type="submit" style={{background:'#00eaff',color:'#19202e',border:'none',borderRadius:6,padding:'10px 22px',fontWeight:700,fontSize:16,cursor:'pointer'}}>Cadastrar</button>
      </form>
      {erro && <div style={{color:'#e53e3e',marginBottom:12}}>{erro}</div>}
      <h3 style={{color:'#00eaff',marginBottom:10}}>Placas cadastradas</h3>
      <ul style={{listStyle:'none',padding:0}}>
        {carros.length === 0 && <li style={{color:'#eee'}}>Nenhuma placa cadastrada.</li>}
        {carros.map((p, idx) => (
          <li key={p} style={{background:'#23283b',color:'#fff',marginBottom:8,padding:'8px 16px',borderRadius:6,fontWeight:600,letterSpacing:2,display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
            <span>{p}</span>
            <button onClick={() => {
              const novosCarros = carros.filter(placaItem => placaItem !== p);
              setCarros(novosCarros);
              localStorage.setItem('carrosCadastrados', JSON.stringify(novosCarros));
            }} style={{background:'#e53e3e',color:'#fff',border:'none',borderRadius:6,padding:'4px 12px',fontWeight:700,cursor:'pointer'}}>Apagar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
