// browser-extension/content.js
function detectLoginForms() {
  const forms = document.querySelectorAll('form[action*="login"], form[action*="signin"], input[type="password"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      const username = form.querySelector('input[type="email"], input[type="text"][name*="user"]')?.value;
      const password = form.querySelector('input[type="password"]')?.value;
      
      if (username && password) {
        const domain = window.location.hostname;
        const payload = {
          service: domain,
          username,
          password,
          url: window.location.href
        };
        
        try {
          await chrome.runtime.sendMessage({
            type: 'SAVE_CREDENTIAL',
            data: payload
          });
        } catch (error) {
          console.error('Failed to save credential:', error);
        }
      }
    });
  });
}

// Run detection when page loads
document.addEventListener('DOMContentLoaded', detectLoginForms);

// Also run detection for dynamically loaded content
const observer = new MutationObserver(detectLoginForms);
observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});
