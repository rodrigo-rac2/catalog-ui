export function toggleForm(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`toggleForm: No element found with ID '${containerId}'`);
        return;
    }
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

export function displayStatusMessage(message, status) {
    const statusDiv = document.getElementById('status-messages');
    statusDiv.textContent = message;
    statusDiv.className = status; // Apply different classes for styling based on success or error
}
