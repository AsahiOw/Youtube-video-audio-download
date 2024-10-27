// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openEzmp3') {
      chrome.tabs.create({ url: 'https://ezmp3.cc/', active: true }, (tab) => {
        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: injectSearch,
            args: [request.videoUrl]
          });
        }, 2000);
      });
    }
  });
  
  function injectSearch(videoUrl) {
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
  
    // Find and set the input
    const searchInput = document.querySelector('.MuiOutlinedInput-input');
    
    if (searchInput) {
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
        }
      }, 500);
    }
  }
  
  // content.js remains the same