function addButtonToThumbnail(thumbnailElement) {
    // Skip if button already exists
    if (thumbnailElement.querySelector('.thumbnail-url-button')) {
        return;
    }

    // Find the link containing the video URL
    const linkElement = thumbnailElement.querySelector('a#thumbnail');
    if (!linkElement) return;

    // Get video ID from the href
    const videoId = linkElement.href.split('v=')[1]?.split('&')[0];
    if (!videoId) return;

    // Create button
    const button = document.createElement('button');
    button.className = 'thumbnail-url-button';
    button.textContent = 'URL';

    // Add click handler
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const videoUrl = `https://youtube.com/watch?v=${videoId}`;
        
        // Copy to clipboard and show feedback
        navigator.clipboard.writeText(videoUrl).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1000);
        }).catch(() => {
            alert(`Video URL: ${videoUrl}`);
        });
    });

    // Make sure thumbnail container is positioned relatively
    thumbnailElement.style.position = 'relative';
    
    // Add button to thumbnail
    thumbnailElement.appendChild(button);
}

function addButtonsToAllThumbnails() {
    // Find all video thumbnails
    const thumbnails = document.querySelectorAll('ytd-thumbnail:not([hidden])');
    thumbnails.forEach(addButtonToThumbnail);
}

// Initial load
setTimeout(addButtonsToAllThumbnails, 1500);

// Watch for dynamic changes (like scrolling, navigation)
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            addButtonsToAllThumbnails();
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Also check periodically for new thumbnails (for safety)
setInterval(addButtonsToAllThumbnails, 2000);