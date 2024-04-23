// catalog-ui/src/utils/helpers/common.js

export function toggleElement(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`toogleElement: No element found with ID '${containerId}'`);
        return;
    }
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

export function toggleVisibility(currentDisplay) {
    return currentDisplay === "none" ? "block" : "none";
  }

export function displayStatusMessage(type, message, status) {
    const statusDiv = document.getElementById(`${type}-status-messages`);
    statusDiv.textContent = message;
    statusDiv.className = status; // Apply different classes for styling based on success or error
}
