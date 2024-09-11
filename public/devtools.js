// To add ::before of Trail btn to increase hover area

var browser = browser || chrome;

if (browser.devtools.panels.elements) {
  browser.devtools.panels.elements.createSidebarPane('TRAIL AMS', (sidebar) => {
    sidebar.setPage(chrome.runtime.getURL("index.html"));
  });
}


browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'inspect') {
    console.log(message)

    browser.devtools.inspectedWindow.eval(
      `inspect(window.document.querySelector('${message.payload}'))`,
      (result, exceptionInfo) => {
        console.log(result, exceptionInfo);
      }
    )

    sendResponse({ success: true })
  } else if (message.type === 'capture-screenshot-node') {
    console.log(message, 'capture-screenshot-node')
    browser.devtools.inspectedWindow.eval(
      `
      const node = window.document.querySelector('${message.payload}')
      node.style.border = '2px solid red'
      node.style.borderRadius = '5px'
      node.style.padding = '5px'
      node.style.boxShadow = '0 0 5px 5px rgba(255, 0, 0, 0.5)
      
      const canvas = window.document.createElement('canvas')
      canvas.width = node.offsetWidth
      canvas.height = node.offsetHeight
      canvas.getContext('2d').drawImage(node, 0, 0)
      canvas.toDataURL('image/png')

    
      `,
      (result, exceptionInfo) => {
        console.log(result, exceptionInfo);
      }
    )

    sendResponse({ success: true })
  }
});

// browser.devtools.inspectedWindow.eval(
//   `
//   inspect(window.document.querySelector('.formContainer'))
//   `,
//   (result, exceptionInfo) => {
//     console.log(result, exceptionInfo);
//   }
// );