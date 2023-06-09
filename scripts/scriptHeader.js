USER_TOKEN = localStorage.getItem('token');
USER_NAME = localStorage.getItem('name');

function deconnect(){
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    location.reload();
}

function reload(){
    location.reload();
}

if (USER_TOKEN) {

    const usernameLabel = document.getElementById('username-placeholder');
    
    fetch('https://pokydexapi.cluster-ig3.igpolytech.fr' + '/user/api/user/connected', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + USER_TOKEN
        }
      })
      .then(response => response.json())
      .then(data => {
        usernameLabel.textContent = data[0].name;
        localStorage.setItem('name', data[0].name);
      }) 
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données utilisateur:', error);
        usernameLabel.textContent = USER_NAME;
      });
  
    document.getElementById('login').classList.add('hidden');
    document.getElementById('logout').classList.remove('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('signup').classList.add('hidden');
}
  
  document.getElementById('logout').addEventListener('click', deconnect);
  