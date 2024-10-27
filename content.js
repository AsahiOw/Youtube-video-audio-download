function addButtonToVideo() {
    // Remove any existing buttons first
    const existingButtons = document.querySelectorAll('.yt-url-button');
    existingButtons.forEach(button => button.remove());

    // Create button
    const button = document.createElement('button');
    button.className = 'yt-url-button';
    button.textContent = 'Copy Video URL';
    button.style.display = 'block';

    // Add click handler
    button.addEventListener('click', () => {
        const url = window.location.href;
        // Copy to clipboard instead of alert
        navigator.clipboard.writeText(url).then(() => {
            // Change button text temporarily to show success
            const originalText = button.textContent;
            button.textContent = 'URL Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }).catch(() => {
            alert(`Video URL: ${url}`);
        });
    });

    // Add button directly to body
    document.body.appendChild(button);
    console.log('Button added to body');
}

// Function to check if we're on a video page
function isVideoPage() {
    return window.location.pathname === '/watch' ||
           document.querySelector('#movie_player') !== null;
}

// Initial load with a longer delay
if (isVideoPage()) {
    console.log('Video page detected, adding button...');
    setTimeout(addButtonToVideo, 2000);
}

// Watch for URL changes
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        console.log('URL changed, checking for video...');
        if (isVideoPage()) {
            setTimeout(addButtonToVideo, 2000);
        } else {
            // Remove button if not on a video page
            const existingButtons = document.querySelectorAll('.yt-url-button');
            existingButtons.forEach(button => button.remove());
        }
    }
}).observe(document, { subtree: true, childList: true });

// Watch for dynamic changes
const observer = new MutationObserver((mutations) => {
    if (isVideoPage() && !document.querySelector('.yt-url-button')) {
        console.log('Page updated, checking if button needs to be added...');
        addButtonToVideo();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});