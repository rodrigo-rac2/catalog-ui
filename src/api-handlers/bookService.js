// bookService.js

export class BookService {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
  }

  async fetchBooks(searchParams = null) {
    const url = new URL(`${this.apiBaseUrl}/books/`);
    if (searchParams) {
      url.searchParams.append('search', searchParams.search);  // Assume the API expects a query parameter named 'search'
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Failed to fetch books");
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching books:", error);
      return [];
    }
  }

  async fetchBook(bookId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/books/${bookId}`);
      if (!response.ok) {
        console.error("Failed to fetch book with ID: " + bookId);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching book:", error);
      return null;
    }
  }

  async addBook(bookData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/books/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) {
        const errorResponse = await response.json(); // Assuming the server sends back a JSON with error details
        throw new Error(`Failed to add book: ${errorResponse.message}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding book:", error);
      throw error; // Rethrowing the error to be handled by the caller
    }
  }

  async updateBook(bookId, bookData) {
    try {
        const response = await fetch(`${this.apiBaseUrl}/books/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        if (!response.ok) {
            const errorResponse = await response.json(); // Assuming the server sends back a JSON with error details
            throw new Error(`Failed to update book: ${errorResponse.message}`);
        }
        return response.status;
    } catch (error) {
        console.error('Error updating book:', error);
        return null;
    }
}

  async deleteBook(bookId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/books/${bookId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Failed to delete book: ${errorResponse.message}`);
    }
    return response.ok;
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error; // Rethrowing the error to be handled by the caller
    }
  }
}
