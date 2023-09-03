const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  // Listen for progress update messages from the main process
  ipcRenderer.on('update-progress', (event, data) => {
    updateProgressBar(data.index, data.progress);
  });
});

// Function to update the progress bar for a specific file
function updateProgressBar(index, progress) {
  const progressBar = document.getElementById(`progress-bar-${index}`);
  if (progressBar) {
    const progressBarInner = progressBar.querySelector('.progress');
    progressBarInner.style.width = `${progress}%`;

    // Update the progress label
    const progressLabel = progressBar.querySelector('.progress-label');
    progressLabel.textContent = `File ${index} (${progress}%)`;

    // Update the download speed if available
    const progressSpeed = progressBar.querySelector('.progress-speed');
    if (progressSpeed) {
      progressSpeed.textContent = `Speed: ${getFormattedSpeed()}`
    }
  }
}

// Function to format the download speed
function getFormattedSpeed(speed) {
  if (speed < 1024) {
    return `${speed.toFixed(2)} B/s`;
  } else if (speed < 1024 * 1024) {
    return `${(speed / 1024).toFixed(2)} KB/s`;
  } else {
    return `${(speed / 1024 / 1024).toFixed(2)} MB/s`;
  }
}
