// browser-extension/background.js
let authToken = null;
let credentials = [];

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'GET_CREDENTIALS':
      sendResponse(credentials);
      break;
      
    case 'SAVE_CREDENTIAL':
      saveCredential(request.data)
        .then(() => sendResponse({ success: true }))
        .catch(err => sendResponse({ success: false, error: err.message }));
      return true;
      
    case 'AUTHENTICATE':
      authenticate(request.token)
        .then(token => {
          authToken = token;
          syncCredentials();
          sendResponse({ success: true });
        })
        .catch(err => sendResponse({ success: false, error: err.message }));
      return true;
  }
});

// Sync credentials with server
async function syncCredentials() {
  if (!authToken) return;
  
  try {
    const response = await fetch('https://your-server-domain.com/api/credentials', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    credentials = await response.json();
    chrome.storage.local.set({ credentials });
  } catch (error) {
    console.error('Failed to sync credentials:', error);
  }
}

// Save credential to server
async function saveCredential(credential) {
  if (!authToken) throw new Error('Not authenticated');
  
  const response = await fetch('https://your-server-domain.com/api/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(credential)
  });
  
  if (!response.ok) throw new Error('Failed to save credential');
  await syncCredentials();
}

// Authenticate with server
async function authenticate(token) {
  const response = await fetch('https://your-server-domain.com/api/auth/verify', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('Authentication failed');
  return token;
}

// Auto-sync every 5 minutes
setInterval(syncCredentials, 5 * 60 * 1000);
