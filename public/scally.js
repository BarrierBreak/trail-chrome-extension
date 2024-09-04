let scallyLoaded = false;

async function loadScallyScript() {
  if (scallyLoaded) return;

  try {
    const response = await fetch('https://cdn.jsdelivr.net/gh/greasy-monk/pagesnow/scally.js');
    const scallyCode = await response.text();
    
    const script = document.createElement('script');
    script.textContent = scallyCode;
    (document.head || document.documentElement).appendChild(script);

    return new Promise((resolve) => {
      script.onload = () => {
        scallyLoaded = true;
        console.log('Scally.js loaded successfully');
        if (window.__a11y) {
          console.log('__a11y is defined');
          resolve();
        } else {
          console.error('__a11y is not defined after loading Scally.js');
          resolve();
        }
      };
    });
  } catch (error) {
    console.error('Error loading Scally.js:', error);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Scally script received message:', message);
  if (message.type === 'RUN_AUDIT') {
    loadScallyScript().then(() => {
      if (window.__a11y) {
        console.log('Running audit with options:', message.options);
        window.__a11y.run(message.options).then(auditData => {
          console.log('Audit completed, sending results:', auditData);
          chrome.runtime.sendMessage({
            type: 'AUDIT_RESULTS',
            payload: auditData,
            tabId: message.tabId,
          }, response => {
            console.log('Response from background script:', response);
          });
        });
      } else {
        console.error('__a11y is still not defined after loading Scally.js');
      }
    });
  }
  return true; // Indicates that the response is sent asynchronously
});

loadScallyScript(); // Load Scally script when the content script is injected