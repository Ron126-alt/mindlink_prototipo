function getUsers(){ return JSON.parse(localStorage.getItem('mindlink_users')||'[]'); }
function getActive(){ return localStorage.getItem('usuarioActivo'); }

window.addEventListener('load', ()=>{
  const email = getActive();
  if(!email){ window.location.href='index.html'; return; }

  const users = getUsers();
  const user = users.find(u=>u.email===email);
  const list = document.getElementById('recomendaciones-list');
  if(user && user.emotions){
    const lastMood = user.emotions.slice(-1)[0];
    if(lastMood){
      const li = document.createElement('li');
      li.textContent = `Basado en tu último estado "${lastMood.mood}", te recomendamos tomarte un descanso breve.`;
      list.appendChild(li);
    } else {
      list.innerHTML = '<li>No hay recomendaciones aún.</li>';
    }
  } else list.innerHTML = '<li>No hay recomendaciones aún.</li>';
});
