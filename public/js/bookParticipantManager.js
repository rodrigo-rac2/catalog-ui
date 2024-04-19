export class BookParticipantManager {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async fetchBookParticipants(bookid) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/books/${bookid}/participants`);
            if (!response.ok) throw new Error('Failed to fetch book participants');
            return await response.json();
        } catch (error) {
            console.error('Error fetching book participants:', error);
            return [];
        }
    }

    async addBookParticipant(bookParticipantData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/books/participants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookParticipantData)
            });
            if (!response.ok) throw new Error('Failed to add book participant');
            return await response.json();
        } catch (error) {
            console.error('Error adding book participant:', error);
            return null;
        }
    }
}
