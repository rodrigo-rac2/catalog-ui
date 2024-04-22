// bookParticipantEvents.js

import {
  displayBookParticipants,
  loadBookParticipantsList,
  initializeSelects,
  loadBooksSelect,
  loadParticipantsSelect,
  loadRolesSelect,
} from "../helpers/bookParticipantHelpers.js";
import { displayStatusMessage, toggleVisibility } from "../helpers/common.js";
import { BookParticipantService } from "../../api-handlers/bookParticipantService.js";

export async function setupBookParticipantEventHandlers(apiBaseUrl) {
  const bookParticipantService = new BookParticipantService(apiBaseUrl);
  let lastLoadedBookId = "null"; // To keep track of the last loaded book ID
  loadBooksSelect(apiBaseUrl);

  document
    .getElementById("addBookParticipantBtn")
    .addEventListener("click", async () => {
      const bookId = document.getElementById("load-book-id").value;
      const participantsListEl = document.getElementById(
        "book-participants-list"
      );
      const bookParticipantsFormContainer = document.getElementById(
        "book-participants-form-container"
      );

      loadBooksSelect(apiBaseUrl, true, bookId); // Load with preselected book if any
      loadParticipantsSelect(apiBaseUrl);
      loadRolesSelect(apiBaseUrl);

      if (!bookId) {
        console.error("No book ID provided");
        participantsListEl.style.display = "none";
        bookParticipantsFormContainer.style.display = "none";
        return;
      }

      // In case the user didn't select a new book but clicked the button again, toggle form visibility
      if (bookId === lastLoadedBookId) {
        bookParticipantsFormContainer.style.display = toggleVisibility(
          bookParticipantsFormContainer.style.display
        );
        // Hide the participants list if the form is hidden
        bookParticipantsFormContainer.style.display === "none"
          ? (participantsListEl.style.display = "none")
          : (participantsListEl.style.display = "block");
      } else {
        await loadBookParticipantsList(bookId, apiBaseUrl);
        participantsListEl.style.display = "block";
        bookParticipantsFormContainer.style.display = "block";
        lastLoadedBookId = bookId;
      }
      initializeSelects(apiBaseUrl);
    });

  document
    .getElementById("loadBookParticipants")
    .addEventListener("click", async function () {
      const bookId = document.getElementById("load-book-id").value;
      const participantsListEl = document.getElementById(
        "book-participants-list"
      );
      const bookParticipantsFormContainer = document.getElementById(
        "book-participants-form-container"
      );

      if (!bookId) {
        console.error("No book ID provided");
        participantsListEl.style.display = "none";
        return;
      }
      // In case the user didn't select a new book but clicked the button again, toggle list visibility
      if (bookId === lastLoadedBookId) {
        // Toggle visibility of the participants list only if the form is hidden.
        // If the form is displayed, the list should be always displayed.
        // This is to avoid hiding the list when the form is displayed.
        bookParticipantsFormContainer.style.display === "none"
          ? (participantsListEl.style.display = toggleVisibility(
              participantsListEl.style.display
            ))
          : (participantsListEl.style.display = "block");
      } else {
        await loadBookParticipantsList(bookId, apiBaseUrl);
        participantsListEl.style.display = "block";
        if (bookParticipantsFormContainer.style.display === "block") {
          loadBooksSelect(apiBaseUrl, true, bookId); // Load with preselected book if any
          loadParticipantsSelect(apiBaseUrl);
          loadRolesSelect(apiBaseUrl);
        }
        lastLoadedBookId = bookId;
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
