// bookParticipantService.js

export class BookParticipantService {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
  }

  async fetchBookParticipants(bookId) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/books/${bookId}/participants`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch book participants: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching book participants:", error);
      throw error;
    }
  }

  async fetchBookParticipantsWithRole(bookId, roleId) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/books/${bookId}/roles/${roleId}/participants`
      );
      if (!response.ok) {
        console.error(
          `Failed to fetch participants for book with ID: ${bookId} and role ID: ${roleId}: ${response.statusText}`
        );
        return;
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching participants:", error);
      throw error;
    }
  }

  async fetchBookParticipantsWithoutRole(bookId, roleId) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/books/${bookId}/filterbyrole/${roleId}/participants`
      );
      if (!response.ok) {
        console.error(
          `Failed to fetch filtered participants for book with ID: ${bookId} and role ID: ${roleId}: ${response.statusText}`
        );
        return;
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching participants:", error);
      throw error;
    }
  }

  async addBookParticipant(bookId, participantId, roleId) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/books/${bookId}/participants`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participant: { participantid: participantId },
            role: { roleid: roleId },
          }),
        }
      );
      if (!response.ok) {
        const errorResponse = await response.json(); // Assuming the server sends back a JSON with error details
        throw new Error(
          `Failed to add book participant: ${errorResponse.message}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding book participant:", error);
      throw error;
    }
  }

  async updateParticipantRole(bookId, participantId, roleId) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/books/${bookId}/participants/${participantId}/role/${roleId}`,
        { method: "PUT" }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to update participant's role: ${errorResponse.message}`
        );
      }
      // Only parse JSON if the server actually sends back data
      if (response.status !== 204) {
        // 204 No Content
        const result = await response.json();
        return result;
      }
      return {}; // Return an empty object dor no content
      return await response.json();
    } catch (error) {
      console.error("Error updating participant's role:", error);
      throw error;
    }
  }

  async deleteBookParticipant(bookId, participantId) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/books/${bookId}/participants/${participantId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to delete book participant with ID: ${participantId}: ${response.statusText}`
        );
      }
      // Only parse JSON if the server actually sends back data
      if (response.status !== 204) {
        // 204 No Content
        const result = await response.json();
        return result;
      }
      return {}; // Return an empty object dor no content
    } catch (error) {
      console.error("Error deleting book participant:", error);
      throw error; // Rethrowing the error to be handled by the caller
    }
  }
}
