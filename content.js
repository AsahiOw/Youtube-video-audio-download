// content.js
function openInEzmp3(videoUrl) {
    try {
      chrome.runtime.sendMessage({
        action: 'openEzmp3',
        videoUrl: videoUrl
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Please refresh the page or reload the extension');
          return;
        }
      });
    } catch (error) {
      console.log('Extension error. Please refresh the page.');
      // Optionally reload the page
      // window.location.reload();
    }
  }
  
  function addButtonToThumbnail(thumbnailElement) {
    try {
      // Skip if button already exists
      if (thumbnailElement.querySelector('.thumbnail-url-button')) {
        return;
      }
  
      // Find the link containing the video URL
      const linkElement = thumbnailElement.querySelector('a#thumbnail');
      if (!linkElement) return;
  
      // Get video ID from the href
      const videoId = linkElement.href?.split('v=')[1]?.split('&')[0];
      if (!videoId) return;
  
      // Create button
      const button = document.createElement('button');
      button.className = 'thumbnail-url-button';
      button.textContent = 'MP3';
  
      // Add click handler
      button.addEventListener('click', (e) => {
        try {
          e.preventDefault();
          e.stopPropagation();
          
          const videoUrl = `https://youtube.com/watch?v=${videoId}`;
          openInEzmp3(videoUrl);
        } catch (error) {
          console.log('Error handling click:', error);
        }
      });
  
      // Make sure thumbnail container is positioned relatively
      thumbnailElement.style.position = 'relative';
      
      // Add button to thumbnail
      thumbnailElement.appendChild(button);
    } catch (error) {
      console.log('Error adding button:', error);
    }
  }
  
  function addButtonsToAllThumbnails() {
    try {
      // Find all video thumbnails
      const thumbnails = document.querySelectorAll('ytd-thumbnail:not([hidden])');
      thumbnails.forEach(addButtonToThumbnail);
    } catch (error) {
      console.log('Error adding buttons:', error);
    }
  }
  
  // Initial load with retry mechanism
  function initializeWithRetry(retries = 3) {
    try {
      if (retries <= 0) return;
      
      setTimeout(() => {
        if (document.readyState === 'complete') {
          addButtonsToAllThumbnails();
        } else {
          initializeWithRetry(retries - 1);
        }
      }, 1500);
    } catch (error) {
      console.log('Error in initialization:', error);
    }
  }
  
  initializeWithRetry();
  
  // Watch for dynamic changes with error handling
  let observer;
  try {
    observer = new MutationObserver((mutations) => {
      try {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            addButtonsToAllThumbnails();
          }
        }
      } catch (error) {
        console.log('Error in mutation observer:', error);
      }
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } catch (error) {
    console.log('Error setting up observer:', error);
  }
  
  // Cleanup when the extension is updated or removed
  window.addEventListener('unload', () => {
    try {
      if (observer) {
        observer.disconnect();
      }
    } catch (error) {
      console.log('Error in cleanup:', error);
    }
  });
  
  // background.js remains the same as the previous version