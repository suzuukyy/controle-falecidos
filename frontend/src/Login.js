import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha })
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('usuarioLogado', JSON.stringify(user));
        onLogin && onLogin(user);
      } else {
        setErro('Usuário ou senha inválidos');
      }
    } catch {
      setErro('Erro ao conectar ao servidor');
    }
  };


  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',background:'#23283b'}}>
      <form onSubmit={handleSubmit} style={{background:'#27304a',padding:36,borderRadius:16,minWidth:320,boxShadow:'0 8px 32px #000a'}}>
        <h2 style={{color:'#00eaff',marginBottom:18,textAlign:'center'}}>Login</h2>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <input type="text" placeholder="Usuário" value={usuario} onChange={e=>setUsuario(e.target.value)} required style={{padding:10,borderRadius:8,border:'none',background:'#222a3b',color:'#e5eaff',fontSize:'1.1rem'}} />
          <input type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} required style={{padding:10,borderRadius:8,border:'none',background:'#222a3b',color:'#e5eaff',fontSize:'1.1rem'}} />
          <button type="submit" style={{background:'#00eaff',color:'#23283b',fontWeight:700,padding:'10px 0',borderRadius:8,border:'none',fontSize:'1.08rem',cursor:'pointer'}}>Entrar</button>
        </div>
        {erro && <div style={{color:'#fa3e3e',marginTop:12,textAlign:'center'}}>{erro}</div>}
      </form>
    </div>
  );
}
