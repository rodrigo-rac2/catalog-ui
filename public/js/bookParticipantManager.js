// bookparticipantmanager.js

export class BookParticipantManager {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async fetchBookParticipants(bookId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/books/${bookId}/participants`);
            if (!response.ok) {
                throw new Error('Failed to fetch book participants');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching book participants:', error);
            throw error;  // Rethrow to handle it further up the call stack if needed
        }
    }

    async addBookParticipant(participantData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/books/${participantData.bookId}/participants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    participantId: participantData.participantId,
                    roleId: participantData.roleId
                })
            });
            if (!response.ok) {
                throw new Error('Failed to add participant to book');
            }
            return await response.json();
        } catch (error) {
            console.error('Error adding participant to book:', error);
            throw error;
        }
    }
}
