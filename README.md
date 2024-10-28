# Personal Project: Youtube Audio Download Chrome Extension

A personal project inspired by a friend who wants to download music from YouTube without the hassle of copying directories and pasting to other websites. This Chrome extension will do just that.

## Features
- Simple, plug-and-play
- All processes are automated, from conversion to download

## Technology Used
- Plain CSS and JS

## Requirements
- Chrome Browser
- Other Chromium-based Browsers should work as well

## Setup
1. Clone the repository or use the download link in the [Link](#link) section
2. Type `chrome://extensions/` in the address bar
3. Click the "Load unpacked" button in the top left
4. Select the extension folder containing the files

## How to use
1. Go to Youtube.com
2. Look for the MP3 button on each video thumbnail or next to the like button
3. Click it, and the extension will open a browser tab to https://ezmp3.cc/
4. The process on ezmp3.cc will be fully automated, and the browser tab will automatically close when the download starts

## Link
- **GitHub**: [Link](https://github.com/AsahiOw/Youtube-video-audio-download)
- **Downloads**:
  - Version 1.0: [Download](https://drive.google.com/file/d/1ThX7qY1tl3HhQmTmSgnWyCmR6ZDCK57H)
  - Version 1.1: [Download](https://drive.google.com/file/d/1CQ5kxKszGDKCXpfVVec7m9cDNt-JtnaR)
  - Version 1.1.1: [Download](https://drive.google.com/file/d/1K6z2vm-6FCTEJzReV87dFCem6KwDNZUx/view?usp=drive_link)

## Update History
### Version 1.1
- Updated manifest.json
- Added Button to `youtube.com/watch`

### Version 1.1.1
- Move the button location on the thumbnail to the left side, to prevent conflict between elements on the thumbnail.
- The button only shows up when the cursor hovers over that button location.

## Known Issues
- The Button in the watch view messes up with some videos' YouTube overflow components.
- There is a chance that the mp3 downloaded is a different video.

## Current Resolve
- Press the "I" button 2 times or resize the window when you need additional options, other than that it should not affect your experience in any way.

## Acknowledgments
Thanks to ezmp3.cc and its creator fiverrpeao on Reddit for this amazing ad-free website. Please support them on [Ko-fi](https://ko-fi.com/ezmp3)

## Contact
For any inquiries about this project, please contact:  
nguyenhatuannguyen4104@gmail.com  
Please don't mention the Icon.

*Nguyen Ha Tuan Nguyen - 2024*
