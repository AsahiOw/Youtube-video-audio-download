chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openEzmp3') {
      chrome.tabs.create({ 
        url: 'https://ezmp3.cc/', 
        active: false
      }, (tab) => {
        const tabId = tab.id;
        
        // Setup a listener for messages from the injected script
        chrome.runtime.onMessage.addListener(function closeTabListener(message) {
          if (message.action === 'closeTab' && message.tabId === tabId) {
            setTimeout(() => {
              chrome.tabs.remove(tabId);
              chrome.runtime.onMessage.removeListener(closeTabListener);
            }, 3000);
          }
        });
  
        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: injectSearch,
            args: [request.videoUrl, tabId]
          });
        }, 2000);
      });
    }
  });
  
  function injectSearch(videoUrl, tabId) {
    // Function to check if the search input is ready
    function isPageReady() {
      const searchInput = document.querySelector('.MuiOutlinedInput-input');
      return searchInput !== null;
    }
  
    // Function to start the process once page is ready
    function startProcess() {
      console.log('Page loaded, starting process...');
      const searchInput = document.querySelector('.MuiOutlinedInput-input');
      
      if (searchInput) {
        // Setup mutation observer first
        const observer = new MutationObserver((mutations, obs) => {
          const downloadButton = document.querySelector('button[type="button"][class*="MuiButton-containedPrimary"][class*="MuiButton-fullWidth"]:has(svg[data-testid="DownloadIcon"])');
          
          if (downloadButton && downloadButton.textContent.includes('Download MP3')) {
            console.log('Download button found, clicking once...');
            downloadButton.click();
            observer.disconnect();
            
            // Send message to background script to close the tab
            chrome.runtime.sendMessage({
              action: 'closeTab',
              tabId: tabId
            });
          }
        });
  
        // Start observing
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class']
        });
  
        // Set the input value
        searchInput.value = videoUrl;
        
        // Trigger events
        ['input', 'change', 'blur'].forEach(eventType => {
          searchInput.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
  
        // Click convert button
        setTimeout(() => {
          const convertButton = document.querySelector('button.MuiLoadingButton-root.MuiButton-fullWidth');
          if (convertButton) {
            convertButton.click();
          } else {
            console.log('Convert button not found');
            // If convert button is not found, send message to close tab
            chrome.runtime.sendMessage({
              action: 'closeTab',
              tabId: tabId
            });
          }
        }, 500);
      }
    }
  
    // Check if page is ready every 500ms
    let attempts = 0;
    const maxAttempts = 900; // 450 seconds total
  
    const checkInterval = setInterval(() => {
      attempts++;
      console.log(`Checking if page is ready... Attempt ${attempts}/${maxAttempts}`);
  
      if (isPageReady()) {
        clearInterval(checkInterval);
        startProcess();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.log('Timeout waiting for page to load');
        // Send message to close tab if page load times out
        chrome.runtime.sendMessage({
          action: 'closeTab',
          tabId: tabId
        });
      }
    }, 500);
  }
