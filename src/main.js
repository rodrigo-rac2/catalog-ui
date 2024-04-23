// /src/main.js
import { setupBookEventHandlers } from './utils/eventHandlers/bookEvents.js';
import { setupParticipantEventHandlers } from './utils/eventHandlers/participantEvents.js';
import { setupRoleEventHandlers } from './utils/eventHandlers/roleEvents.js';
import { setupBookParticipantEventHandlers } from './utils/eventHandlers/bookParticipantEvents.js';

let apiBaseUrl;

async function fetchConfig() {
    try {
        // Assuming your server provides this endpoint
        const response = await fetch('/config');
        const config = await response.json();
        apiBaseUrl = config.apiBaseUrl; // Adjust according to the actual property name
    } catch (error) {
        console.error('Failed to load configuration:', error);
        throw new Error('Failed to load configuration');
    }
}

async function initializeApplication() {
    try {
        await fetchConfig(); // Ensure config is loaded before proceeding
        console.log('Initializing application with base API URL:', apiBaseUrl);

        // Initialize event handlers with the API base URL
        setupBookEventHandlers(apiBaseUrl);
        setupParticipantEventHandlers(apiBaseUrl);
        setupRoleEventHandlers(apiBaseUrl);
        setupBookParticipantEventHandlers(apiBaseUrl);
        
        console.log('Application initialized successfully.');
    } catch (error) {
        console.error('Error during application initialization:', error);
        // Handle initialization errors (e.g., show a user-friendly message, send error reports)
    }
}

document.addEventListener('DOMContentLoaded', initializeApplication);
