// participantManager.js

export class ParticipantManager {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async fetchParticipants() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/participants/`);
            if (!response.ok) throw new Error('Failed to fetch participants');
            return await response.json();
        } catch (error) {
            console.error('Error fetching participants:', error);
            return [];
        }
    }

    async addParticipant(participantData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/participants/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(participantData)
            });
            if (!response.ok) throw new Error('Failed to add participant');
            return await response.json();
        } catch (error) {
            console.error('Error adding participant:', error);
            return null;
        }
    }
}
