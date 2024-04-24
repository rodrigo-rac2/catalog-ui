// /src/api-handlers/participantService.js

export class ParticipantService {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async fetchParticipants() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/participants/`);
            if (!response.ok) {
                console.error('Failed to fetch participants');
                return [];
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching participants:', error);
            return [];
        }
    }

    async fetchParticipant(participantId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/participants/${participantId}`);
            if (!response.ok) {
                console.error('Failed to fetch participant');
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching participant:', error);
            return null;
        }
    }

    async addParticipant(participantData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/participants/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(participantData)
            });
            if (!response.ok) {
                const errorResponse = await response.json(); // Assuming the server sends back a JSON with error details
                throw new Error(`Failed to add participant: ${errorResponse.message}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error adding participant:', error);
            return null;
        }
    }

    async updateParticipant(participantId, participantData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/participants/${participantId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(participantData)
            });
            if (!response.ok) {
                const errorResponse = await response.json(); // Assuming the server sends back a JSON with error details
                throw new Error(`Failed to update participant: ${errorResponse.message}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating participant:', error);
            return null;
        }
    }

    async deleteParticipant(participantId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/participants/${participantId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(`Failed to delete participant: ${errorResponse.message}`);
            }
            return response.ok;
        } catch (error) {
            console.error('Error deleting participant:', error);
            throw error; // Re-throw to handle it in the calling context
        }
    }
}
