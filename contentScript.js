const twitterHosts = ['twitter.com', 'x.com']
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

function createCustomStyles() {
  const os = getOS()
  const style = document.createElement('style')
  style.type = 'text/css'

  if (os === 'macos') {
    style.innerHTML = `
      .custom-urdu-font {
        font-size: 15px !important;
        font-family: 'Noto Nastaliq Urdu', serif !important;
        line-height: 1.9 !important;
      }
    `
  } else if (os === 'windows') {
    style.innerHTML = `
      .custom-urdu-font {
        font-size: 16px !important;
        line-height: 1.5 !important;
      }
    `
  }

  document.head.appendChild(style)
}

function applyCustomClass() {
  const urduElements = document.querySelectorAll('[lang="ur"]')
  urduElements.forEach(element => {
    element.classList.add('custom-urdu-font')
  })
}

function startObserving(targetNode, observer, config) {
  if (targetNode) {
    observer.observe(targetNode, config)
    applyCustomClass()
  } else {
    targetNode = document.querySelector('div[aria-label="Timeline: Your Home Timeline"]')
    setTimeout(() => startObserving(targetNode, observer, config), 500)
  }
}

function initializeObserverAndListeners() {
  const config = { childList: true, subtree: true }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        applyCustomClass()
      }
    })
  })

  const checkAndObserve = () => {
    const targetNode = document.querySelector('div[aria-label="Timeline: Your Home Timeline"]')
    startObserving(targetNode, observer, config)
  }

  checkAndObserve()

  const addClickListeners = () => {
    const tabsAndLists = document.querySelectorAll('[role="presentation"] a')
    if (tabsAndLists.length > 3) {
      tabsAndLists.forEach(element => {
        element.addEventListener('click', () => {
          setTimeout(() => {
            applyCustomClass()
            checkAndObserve()
          }, 500)
        })
      })
    } else {
      setTimeout(addClickListeners, 500)
    }
  }

  addClickListeners()
}

window.onload = () => {
  createCustomStyles()
  initializeObserverAndListeners()
}
