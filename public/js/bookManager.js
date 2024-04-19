export class BookManager {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async fetchBooks() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/books/`);
            if (!response.ok) throw new Error('Failed to fetch books');
            return await response.json();
        } catch (error) {
            console.error('Error fetching books:', error);
            return [];
        }
    }

    async addBook(bookData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/books/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
            if (!response.ok) throw new Error('Failed to add book');
            return await response.json();
        } catch (error) {
            console.error('Error adding book:', error);
            return null;
        }
    }
}
