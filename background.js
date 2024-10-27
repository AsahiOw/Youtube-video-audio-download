chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openEzmp3') {
      chrome.tabs.create({ url: 'https://ezmp3.cc/', active: true }, (tab) => {
        // Wait for the page to load then inject the script
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
    // Find the input using the class name since the ID might be dynamic
    const searchInput = document.querySelector('.MuiOutlinedInput-input');
    
    if (searchInput) {
      // Set the value
      searchInput.value = videoUrl;
      
      // Trigger necessary events for React to recognize the change
      const events = ['input', 'change', 'blur'];
      events.forEach(eventType => {
        searchInput.dispatchEvent(new Event(eventType, { bubbles: true }));
      });
  
      // Find and click the convert button using more specific classes
      setTimeout(() => {
        const convertButton = document.querySelector('button.MuiLoadingButton-root.MuiButton-fullWidth');
        if (convertButton) {
          convertButton.click();
          // Start watching for the download button after clicking convert
          waitForDownloadButton();
        } else {
          console.log('Convert button not found');
        }
      }, 500);
    } else {
      console.log('Search input not found');
    }
  }
  
  function waitForDownloadButton() {
    let attempts = 0;
    const maxAttempts = 120; // Maximum 2 minutes of waiting (120 * 1000ms)
    
    const checkForButton = setInterval(() => {
      // Look for the download button with specific classes and text content
      const downloadButtons = Array.from(document.querySelectorAll('button.MuiButton-containedPrimary.MuiButton-fullWidth'));
      const downloadButton = downloadButtons.find(button => button.textContent.includes('Download MP3'));
      
      if (downloadButton) {
        console.log('Download button found!');
        clearInterval(checkForButton);
        downloadButton.click();
      } else {
        attempts++;
        console.log(`Waiting for download button... (${attempts}/${maxAttempts})`);
        
        if (attempts >= maxAttempts) {
          console.log('Timed out waiting for download button');
          clearInterval(checkForButton);
        }
      }
    }, 1000); // Check every second
  }