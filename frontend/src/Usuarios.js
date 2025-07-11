import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => { setErro('Erro ao carregar usuários.'); setUsuarios([]); });
  }, [sucesso, showModal]);

  const adicionarUsuario = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    if (!nome || !senha || !telefone || !email || !cargo) {
      setErro('Preencha todos os campos!');
      return;
    }
    const res = await fetch('http://localhost:3001/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, senha, telefone, email, cargo })
    });
    if (res.ok) {
      setSucesso('Usuário cadastrado!');
      setNome(''); setSenha(''); setTelefone(''); setEmail(''); setCargo(''); setShowModal(false);
    } else {
      const errMsg = await res.json().then(e => e.erro || 'Erro ao cadastrar usuário!').catch(() => 'Erro ao cadastrar usuário!');
      setErro(errMsg);
    }
  };

  return (
    <div style={{maxWidth:600,margin:'32px auto',background:'#23283b',padding:28,borderRadius:14}}>
      <div style={{display:'flex',alignItems:'center',marginBottom:18,gap:10}}>
        <Link to="/" style={{background:'#00eaff',color:'#23283b',fontWeight:700,padding:'8px 20px',borderRadius:8,textDecoration:'none',fontSize:'1.05rem',boxShadow:'0 1px 6px #00eaff33'}}>← Voltar</Link>
        <h2 style={{color:'#00eaff',marginBottom:0,marginLeft:10}}>Usuários</h2>
      </div>
      <button style={{marginBottom:18,background:'#00eaff',color:'#23283b',fontWeight:700,padding:'9px 22px',borderRadius:8,border:'none',fontSize:'1.08rem',cursor:'pointer'}} onClick={()=>setShowModal(true)}>
        Cadastrar Usuário
      </button>
      {showModal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.35)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#27304a',padding:'38px 38px 28px 38px',borderRadius:18,minWidth:350,maxWidth:420,boxShadow:'0 8px 32px #000a  '}}>
            <h2 style={{color:'#00eaff',marginBottom:22,textAlign:'center',fontSize:'2rem',fontWeight:800,letterSpacing:0.5}}>Novo Usuário</h2>
            <form onSubmit={adicionarUsuario} style={{display:'flex',flexDirection:'column',gap:14}}>
              <label style={{color:'#e5eaff',fontWeight:600,marginBottom:2}}>Nome de usuário</label>
              <div style={{display:'flex',alignItems:'center',background:'#222a3b',borderRadius:8,padding:'0 10px'}}>
                <span style={{color:'#00eaff',fontSize:18,marginRight:6}}>&#128100;</span>
                <input placeholder="Digite o nome completo" value={nome} onChange={e=>setNome(e.target.value)} required style={{border:'none',outline:'none',background:'transparent',color:'#e5eaff',padding:'10px 0',width:'100%'}} />
              </div>
              <label style={{color:'#e5eaff',fontWeight:600,marginBottom:2}}>Telefone</label>
              <div style={{display:'flex',alignItems:'center',background:'#222a3b',borderRadius:8,padding:'0 10px'}}>
                <span style={{color:'#00eaff',fontSize:18,marginRight:6}}>&#128222;</span>
                <input placeholder="(99) 99999-9999" value={telefone} onChange={e=>setTelefone(e.target.value)} required style={{border:'none',outline:'none',background:'transparent',color:'#e5eaff',padding:'10px 0',width:'100%'}} />
              </div>
              <label style={{color:'#e5eaff',fontWeight:600,marginBottom:2}}>E-mail</label>
              <div style={{display:'flex',alignItems:'center',background:'#222a3b',borderRadius:8,padding:'0 10px'}}>
                <span style={{color:'#00eaff',fontSize:18,marginRight:6}}>&#9993;</span>
                <input placeholder="usuario@email.com" value={email} onChange={e=>setEmail(e.target.value)} required style={{border:'none',outline:'none',background:'transparent',color:'#e5eaff',padding:'10px 0',width:'100%'}} />
              </div>
              <label style={{color:'#e5eaff',fontWeight:600,marginBottom:2}}>Senha</label>
              <div style={{display:'flex',alignItems:'center',background:'#222a3b',borderRadius:8,padding:'0 10px'}}>
                <span style={{color:'#00eaff',fontSize:18,marginRight:6}}>&#128274;</span>
                <input placeholder="Digite uma senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} required style={{border:'none',outline:'none',background:'transparent',color:'#e5eaff',padding:'10px 0',width:'100%'}} />
              </div>
              <label style={{color:'#e5eaff',fontWeight:600,marginBottom:2}}>Cargo</label>
              <div style={{display:'flex',alignItems:'center',background:'#222a3b',borderRadius:8,padding:'0 10px'}}>
                <span style={{color:'#00eaff',fontSize:18,marginRight:6}}>&#128188;</span>
                <select value={cargo} onChange={e=>setCargo(e.target.value)} required
                  style={{
                    border:'none',
                    outline:'none',
                    background:'#23283b',
                    color:'#00eaff',
                    padding:'10px 0',
                    width:'100%',
                    borderRadius:8,
                    fontWeight:600,
                    fontSize:'1.05rem',
                    boxShadow:'0 1px 6px #00eaff33',
                    appearance:'none',
                    WebkitAppearance:'none',
                    MozAppearance:'none',
                    cursor:'pointer'
                  }}
                >
                  <option value="" style={{background:'#23283b',color:'#e5eaff'}}>Selecione o cargo</option>
                  <option value="Dev" style={{background:'#23283b',color:'#00eaff'}}>Dev</option>
                  <option value="Atendente" style={{background:'#23283b',color:'#00eaff'}}>Atendente</option>
                  <option value="Motorista" style={{background:'#23283b',color:'#00eaff'}}>Motorista</option>
                  <option value="Tanatopraxista" style={{background:'#23283b',color:'#00eaff'}}>Tanatopraxista</option>
                  <option value="Cerimonial" style={{background:'#23283b',color:'#00eaff'}}>Cerimonial</option>
                </select>
              </div>
              <div style={{display:'flex',gap:16,justifyContent:'center',marginTop:16}}>
                <button type="submit" style={{background:'#00eaff',color:'#23283b',fontWeight:700,padding:'10px 28px',borderRadius:8,border:'none',fontSize:'1.08rem',cursor:'pointer',boxShadow:'0 2px 8px #00eaff33'}}>Salvar</button>
                <button type="button" style={{background:'none',color:'#00eaff',fontWeight:700,padding:'10px 28px',borderRadius:8,border:'1.5px solid #00eaff',fontSize:'1.08rem',cursor:'pointer'}} onClick={()=>setShowModal(false)}>Cancelar</button>
              </div>
              {erro && <div style={{color:'#fa3e3e',marginTop:8,textAlign:'center'}}>{erro}</div>}
            </form>
          </div>
        </div>
      )}
      {sucesso && <div style={{color:'#00eaff',marginBottom:10}}>{sucesso}</div>}
      <table style={{width:'100%',marginTop:16}}>
        <thead>
          <tr style={{color:'#00eaff'}}>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(usuarios) ? usuarios : []).map(u => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.telefone}</td>
              <td>{u.email}</td>
              <td>{u.cargo}</td>
              <td>
                {u.nome !== 'admin' && JSON.parse(localStorage.getItem('usuarioLogado')||'{}').cargo === 'Dev' && (
                  <button
                    onClick={async () => {
                      if(window.confirm(`Tem certeza que deseja excluir o usuário '${u.nome}'?`)) {
                        setSucesso('');
                        setErro('');
                        setLoading(true);
                        const res = await fetch(`http://localhost:3001/api/usuarios/${u.id}`, { method: 'DELETE' });
                        if (res.ok) {
                          setUsuarios(usuarios.filter(user => user.id !== u.id));
                          setSucesso('Usuário excluído!');
                        } else {
                          setErro('Erro ao excluir usuário!');
                        }
                        setLoading(false);
                      }
                    }}
                    style={{background:'#fa3e3e',color:'#fff',border:'none',borderRadius:6,padding:'4px 13px',fontWeight:700,cursor:'pointer',boxShadow:'0 1px 6px #fa3e3e33'}}
                  >Excluir</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

