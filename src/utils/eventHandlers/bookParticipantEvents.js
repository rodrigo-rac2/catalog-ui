// bookparticipantevents.js

// bookParticipantEvents.js

import { toggleForm } from "../helpers/common.js";
import { displayBookParticipants } from "../helpers/bookParticipantHelpers.js";
import { displayStatusMessage } from "../helpers/common.js";
import { BookParticipantService } from "../../api-handlers/bookParticipantService.js";

export async function setupBookParticipantEventHandlers(apiBaseUrl) {
  const bookParticipantService = new BookParticipantService(apiBaseUrl);

  document
    .getElementById("addBookParticipantBtn")
    .addEventListener("click", () =>
      toggleForm("book-participants-form-container")
    );

  document
    .getElementById("loadBookParticipants")
    .addEventListener("click", async () => {
      const bookId = document.getElementById("load-book-participant-id").value;
      const participantsListEl = document.getElementById(
        "book-participants-list"
      );
      if (bookId) {
        displayBookParticipants(
          await bookParticipantService.fetchBookParticipants(bookId),
          apiBaseUrl
        );
        participantsListEl.style.display = "block";
      } else {
        console.error("No book ID provided");
        participantsListEl.style.display = "none"; // Hide the list if no book ID is provided
      }
    });

  document
    .getElementById("book-participant-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
      const bookId = parseInt(data.bookid || 0, 10);

      try {
        const addedBookParticipant =
          await bookParticipantService.addBookParticipant(
            bookId,
            parseInt(data.participantid || 0, 10),
            parseInt(data.roleid || 0, 10)
          );

        if (addedBookParticipant) {
          displayStatusMessage(
            "book-participants",
            "Book participant added successfully!",
            "success"
          );
          const participantsListEl = document.getElementById(
            "book-participants-list"
          );
          // Refetch and display the updated list of participants
          displayBookParticipants(
            await bookParticipantService.fetchBookParticipants(bookId),
            apiBaseUrl
          );
          participantsListEl.style.display = "block"; // Ensure the list is shown
        }
      } catch (error) {
        displayStatusMessage(
          "book-participants",
          `Failed to add book participant: ${error.message}`,
          "error"
        );
      }
    });
}
