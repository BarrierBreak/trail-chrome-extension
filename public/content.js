/*global chrome*/

//To inject Trail extension button on load
const extensionBtn = new DOMParser().parseFromString(
  "<button  id='trail-btn' style='display: flex; align-items: center; justify-content: center; gap: 5px; position: fixed; width: 92px; height: 40px; font-size: 16px; color: #FEFEFE; background: #5928ED; border: 1px solid #FEFEFE; border-bottom: 0; top: 244px; right: -26px; border-radius: 4px 4px 0px 0px !important; cursor: pointer; transform: rotate(-90deg); z-index: 9999'><svg xmlns='http://www.w3.org/2000/svg' width='39' height='16' viewBox='0 0 39 16' fill='none'><path d='M0.101074 3.62114V1.40676H10.387V3.62114H6.4481V15.3021H3.95768V3.62114H0.101074Z' fill='#FEFEFE'/><path d='M10.4897 4.79113H12.4895L12.7348 6.29492C13.1835 5.12492 14.1834 4.47626 15.2034 4.47626C15.8151 4.47626 16.4486 4.62251 16.8368 4.87372L16.4083 6.94186C15.9999 6.73367 15.4908 6.56505 14.9597 6.56505C13.8574 6.56505 13.1432 7.46319 13.1028 8.67448V15.2987H10.6746V6.4601L10.4914 4.78769L10.4897 4.79113Z' fill='#FEFEFE'/><path d='M17.2451 10.4966C17.2451 6.81796 19.0213 4.47798 22.5301 4.47798C23.2241 4.47798 24.7129 4.64488 26.1632 5.20923V13.2959L26.3666 15.3021H24.2643L24.1214 14.1941L24.0391 14.1734C23.488 14.989 22.5906 15.6153 21.2227 15.6153C18.1408 15.6153 17.2434 13.234 17.2434 10.4966H17.2451ZM23.7753 11.9797V6.56849C23.4694 6.42224 22.8561 6.27599 22.2242 6.27599C20.285 6.27599 19.633 8.15658 19.633 10.414C19.633 12.1277 20.0615 13.7777 21.7554 13.7777C23.0611 13.7777 23.7753 12.8796 23.7753 11.9814V11.9797Z' fill='#FEFEFE'/><path d='M28.5088 1.76119C28.5088 1.0093 29.0599 0.381287 29.8968 0.381287C30.7337 0.381287 31.305 0.986933 31.305 1.76119C31.305 2.53545 30.7135 3.16174 29.8968 3.16174C29.0801 3.16174 28.5088 2.57675 28.5088 1.76119ZM31.1218 4.79113V15.3021H28.6936V4.79113H31.1218Z' fill='#FEFEFE'/><path d='M33.6531 11.8952V0.778549H36.1014V11.8539C36.1014 13.1701 36.367 13.6502 37.2038 13.6502C37.592 13.6502 38.0406 13.5039 38.4692 13.3164L39.0002 14.9888C38.4289 15.3863 37.4492 15.6151 36.572 15.6151C33.8178 15.6151 33.6531 13.7758 33.6531 11.8952Z' fill='#FEFEFE'/></svg> |<svg style = 'transform: rotate(90deg);' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M11.1499 18.415V20.2856H12.8202V18.415C12.8202 16.1428 13.5252 15.0743 19.9575 15.0743H23.6026C22.244 20.2113 17.5657 24 12.0005 24C6.43537 24 1.71775 20.1793 0.380914 15.0114H10.8443V13.341H0.0753561C0.0247732 12.9002 0 12.4522 0 12C0 11.5478 0.0247732 11.0998 0.0753561 10.659H3.99397C7.37992 10.659 9.29589 10.3864 10.609 9.72058C12.1037 8.96181 12.8006 7.66724 12.8006 5.64797V3.77529H11.1303V5.64797C11.1303 7.9181 10.4252 8.98864 3.99397 8.98864H0.380914C1.71671 3.81865 6.41266 0 12.0005 0C17.5884 0 22.3215 3.84859 23.6346 9.05059H13.1061V10.7209H23.9319C23.9773 11.1421 24 11.5675 24 12C24 12.4759 23.9711 12.9436 23.9184 13.405H19.9575C14.1157 13.405 11.1499 14.1803 11.1499 18.416V18.415Z' fill='#FEFEFE'/></svg></button>",
  'text/html'
).body.firstElementChild
document.body.insertBefore(extensionBtn, document.body.firstChild)

//To inject Trail extension iframe on load
const iframe = new DOMParser().parseFromString(
  "<iframe id='trail-iframe' title='trail-extension' style = 'width: 0px; height: 100vh; position: fixed; top: 0; right: 0; border-radius: 5px; border: 1px solid #e6e6e6; z-index: 9999999999; box-shadow: 0 16px 30px rgba(12, 15, 28, 0.12);'></iframe>",
  'text/html'
).body.firstElementChild
iframe.src = chrome.runtime.getURL('index.html')
document.body.insertBefore(iframe, document.body.firstChild.nextSibling)

//Onclick functionality for extension button
extensionBtn.addEventListener('click', () => {
  showIframe()

  window.addEventListener('message', (event) => {
    if (event.data === 'close-button-clicked') {
      hideIframe()
    }
  })
})

//Functions to show extension iframe
function showIframe() {
  iframe.style.width = '648px'
}

//Functions to hide extension iframe
function hideIframe() {
  iframe.style.width = '0px'
  document.querySelector('#trail-btn').focus()
}
