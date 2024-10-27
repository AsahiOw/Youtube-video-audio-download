// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openEzmp3') {
      chrome.tabs.create({ url: 'https://ezmp3.cc/', active: true }, (tab) => {
        // Wait for the page to be fully loaded before injecting
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: waitForPageLoad,
          args: [request.videoUrl]
        });
      });
    }
  });
  
  function waitForPageLoad(videoUrl) {
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
            // Disconnect the observer after clicking once
            observer.disconnect();
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
          }
        }, 500);
      }
    }
  
    // Check if page is ready every 500ms for up to 30 seconds
    let attempts = 0;
    const maxAttempts = 60; // 30 seconds total
  
    const checkInterval = setInterval(() => {
      attempts++;
      console.log(`Checking if page is ready... Attempt ${attempts}/${maxAttempts}`);
  
      if (isPageReady()) {
        clearInterval(checkInterval);
        startProcess();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.log('Timeout waiting for page to load');
      }
    }, 500);
  }
  
  // content.js remains the same