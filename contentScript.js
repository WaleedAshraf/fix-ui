const twitterHots = ['twitter.com', 'x.com']
const twitterPaths = ['/home']
const windowURL = new URL(window.location.href)

function getOS() {
  const userAgent = window.navigator.userAgent
  if (userAgent.indexOf('Mac') !== -1) {
    return 'macos'
  } else if (userAgent.indexOf('Win') !== -1) {
    return 'windows'
  }
  return 'unknown'
}

function applyCustomClass() {
  if (!twitterHots.includes(windowURL.hostname) || !twitterPaths.includes(windowURL.pathname)) return

  const os = getOS()
  const style = document.createElement('style')
  style.type = 'text/css'

  if (os === 'macos') {
    style.innerHTML = `
          .custom-urdu-font-macos {
              font-size: 15px !important;
              font-family: 'Noto Nastaliq Urdu', serif !important;
              line-height: 1.9 !important;
          }
      `
  } else if (os === 'windows') {
    style.innerHTML = `
          .custom-urdu-font-windows {
              font-size: 16px !important;
              line-height: 1.5 !important;
          }
      `
  }

  document.head.appendChild(style)

  const urduElements = document.querySelectorAll('[lang="ur"]')
  urduElements.forEach(element => {
    if (os === 'macos') {
      element.classList.add('custom-urdu-font-macos')
    } else if (os === 'windows') {
      element.classList.add('custom-urdu-font-windows')
    }
  })
}

// MutationObserver to monitor for new tweets being added to the DOM
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length > 0) {
      applyCustomClass()
    }
  })
})

// Configuration for the observer
const config = {
  childList: true,
  subtree: true
}

// Start observing the main feed for changes
const targetNode = document.querySelector('div[aria-label="Timeline: Your Home Timeline"]')
if (targetNode) {
  observer.observe(targetNode, config)
}

// Apply the custom class to any existing tweets
applyCustomClass()
