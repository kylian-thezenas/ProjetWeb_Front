USER_TOKEN = localStorage.getItem('token');

function deconnect(){
    localStorage.removeItem('token');
    location.reload();
}


if (USER_TOKEN) {

    const usernameLabel = document.getElementById('username-placeholder');
    
    fetch('http://localhost:8000/user/api/user/connected', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + USER_TOKEN
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        usernameLabel.textContent = data[0].name;
        console.log(usernameLabel.textContent);
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données utilisateur:', error);
      });
  
    document.getElementById('login').classList.add('hidden');
    document.getElementById('logout').classList.remove('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('signup').classList.add('hidden');
  }
  
  document.getElementById('logout').addEventListener('click', deconnect);
  
  const menuToggle = document.querySelector('.menu-toggle input[type="checkbox"]');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('change', function() {
        if (this.checked) {
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
    });
