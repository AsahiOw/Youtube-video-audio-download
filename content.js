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
  }
}

function findLikeButton() {
  const targetSection = document.querySelector('#above-the-fold #top-level-buttons-computed');
  if (!targetSection) {
    console.log('Target section not found');
    return null;
  }
  return targetSection.firstElementChild;
}

function createMP3ButtonForWatchPage() {
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'watch-view-mp3-button style-scope ytd-menu-renderer';
  buttonContainer.style.cssText = `
    display: inline-flex !important;
    align-items: center !important;
    margin-right: 8px !important;
  `;

  const innerButton = document.createElement('button');
  innerButton.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m mp3-download-btn';
  
  const style = document.createElement('style');
  style.textContent = `
    .mp3-download-btn {
      display: flex !important;
      align-items: center !important;
      padding: 0 16px !important;
      height: 36px !important;
      font-size: 14px !important;
      line-height: 36px !important;
      border-radius: 18px !important;
      border: none !important;
      background: var(--yt-spec-badge-chip-background, #0000000d) !important;
      color: var(--yt-spec-text-primary, #0f0f0f) !important;
      cursor: pointer !important;
      font-family: "Roboto","Arial",sans-serif !important;
      transition: all 0.2s ease !important;
    }

    .mp3-download-btn:hover {
      background-color: #ff0000 !important;
      color: #ffffff !important;
    }
  `;
  document.head.appendChild(style);

  const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  iconSvg.setAttribute("height", "24");
  iconSvg.setAttribute("viewBox", "0 0 24 24");
  iconSvg.setAttribute("width", "24");
  iconSvg.style.marginRight = "6px";
  iconSvg.innerHTML = `
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="currentColor">
      <title>Music</title>
    </path>
  `;

  const textSpan = document.createElement('span');
  textSpan.className = 'yt-spec-button-shape-next--button-text';
  textSpan.textContent = 'MP3';
  textSpan.style.cssText = `
    font-family: "Roboto","Arial",sans-serif !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    letter-spacing: 0.5px !important;
  `;

  innerButton.appendChild(iconSvg);
  innerButton.appendChild(textSpan);
  buttonContainer.appendChild(innerButton);

  return buttonContainer;
}

function addButtonToWatchPage() {
  if (document.querySelector('.watch-view-mp3-button')) {
    return;
  }

  const targetSection = findLikeButton();
  if (!targetSection) {
    return;
  }

  const mp3Button = createMP3ButtonForWatchPage();
  
  mp3Button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const videoUrl = window.location.href;
    openInEzmp3(videoUrl);
  });

  targetSection.parentElement.insertBefore(mp3Button, targetSection);
}

function getVideoUrl(container) {
  // Try to find the video link in order of reliability
  const videoLink = container.querySelector('a#video-title-link') || 
                   container.querySelector('a#video-title') ||
                   container.querySelector('a#thumbnail');
                   
  if (!videoLink || !videoLink.href) return null;

  // Extract and validate video ID
  const videoId = videoLink.href.match(/(?:\/watch\?v=|\/shorts\/)([^&?/]+)/)?.[1];
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
}

function addButtonToThumbnail(thumbnailElement) {
  // Remove existing button if present
  const existingButton = thumbnailElement.querySelector('.thumbnail-url-button');
  if (existingButton) {
    existingButton.remove();
  }

  const button = document.createElement('button');
  button.className = 'thumbnail-url-button';
  button.textContent = 'MP3';

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Find the video container at click time
    const videoContainer = thumbnailElement.closest('ytd-rich-item-renderer, ytd-compact-video-renderer');
    if (!videoContainer) return;

    // Get the video URL at click time
    const videoUrl = getVideoUrl(videoContainer);
    if (videoUrl) {
      console.log('Opening MP3 download for:', videoUrl);
      openInEzmp3(videoUrl);
    }
  });

  thumbnailElement.style.position = 'relative';
  thumbnailElement.appendChild(button);
}

function addButtonsToAllThumbnails() {
  const thumbnails = document.querySelectorAll(`
    ytd-rich-item-renderer ytd-thumbnail:not([hidden]),
    ytd-compact-video-renderer ytd-thumbnail:not([hidden]),
    ytd-grid-video-renderer ytd-thumbnail:not([hidden])
  `);
  thumbnails.forEach(addButtonToThumbnail);
}

function checkAndAddButtons() {
  addButtonsToAllThumbnails();
  
  if (window.location.pathname === '/watch') {
    let attempts = 0;
    const maxAttempts = 20;
    const addButtonInterval = setInterval(() => {
      if (document.querySelector('.watch-view-mp3-button')) {
        clearInterval(addButtonInterval);
        return;
      }

      const targetSection = document.querySelector('#above-the-fold #top-level-buttons-computed');
      if (targetSection) {
        addButtonToWatchPage();
        if (document.querySelector('.watch-view-mp3-button')) {
          clearInterval(addButtonInterval);
        }
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(addButtonInterval);
      }
    }, 1000);
  }
}

function initializeWithRetry(retries = 3) {
  try {
    if (retries <= 0) return;
    
    setTimeout(() => {
      if (document.readyState === 'complete') {
        checkAndAddButtons();
      } else {
        initializeWithRetry(retries - 1);
      }
    }, 1500);
  } catch (error) {
    console.log('Error in initialization:', error);
  }
}

// Initialize
initializeWithRetry();

// Observer for content changes
const contentObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.tagName?.toLowerCase() === 'ytd-thumbnail') {
            addButtonToThumbnail(node);
          } else {
            const thumbnails = node.querySelectorAll('ytd-thumbnail:not([hidden])');
            thumbnails.forEach(addButtonToThumbnail);
          }
        }
      });
    }
  });
});

contentObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Handle navigation changes
let lastUrl = location.href;
const navigationObserver = new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(() => {
      checkAndAddButtons();
    }, 1000);
  }
});

navigationObserver.observe(document, { subtree: true, childList: true });