window.addEventListener('load', ()=>{
  const email = localStorage.getItem('usuarioActivo');
  if(!email){ window.location.href='index.html'; return; }
});
