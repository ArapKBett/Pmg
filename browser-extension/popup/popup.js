// browser-extension/popup/popup.js
document.addEventListener('DOMContentLoaded', initPopup);

async function initPopup() {
  const token = await getAuthToken();
  
  if (token) {
    showMainView();
    loadCredentials();
  } else {
    showLoginView();
  }
  
  document.getElementById('open-web').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://your-server-domain.com' });
  });
  
  document.getElementById('refresh').addEventListener('click', loadCredentials);
  document.getElementById('add-new').addEventListener('click', showAddForm);
  document.getElementById('search').addEventListener('input', filterCredentials);
}

async function getAuthToken() {
  const result = await chrome.storage.local.get(['authToken']);
  return result.authToken;
}

function showLoginView() {
  document.getElementById('login-view').classList.remove('hidden');
  document.getElementById('main-view').classList.add('hidden');
}

function showMainView() {
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('main-view').classList.remove('hidden');
}

async function loadCredentials() {
  const credentials = await chrome.runtime.sendMessage({ type: 'GET_CREDENTIALS' });
  renderCredentials(credentials);
}

function renderCredentials(credentials) {
  const container = document.getElementById('credentials-list');
  container.innerHTML = '';
  
  credentials.forEach(cred => {
    const item = document.createElement('div');
    item.className = 'credential-item';
    item.innerHTML = `
      <strong>${cred.service}</strong><br>
      <span>${cred.username}</span>
    `;
    
    item.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'AUTOFILL', 
          username: cred.username, 
          password: cred.password 
        });
      });
    });
    
    container.appendChild(item);
  });
}

function filterCredentials() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const items = document.querySelectorAll('.credential-item');
  
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? 'block' : 'none';
  });
}

function showAddForm() {
  // Implementation for adding new credentials from popup
  chrome.tabs.create({ url: 'https://your-server-domain.com/credentials' });
}
