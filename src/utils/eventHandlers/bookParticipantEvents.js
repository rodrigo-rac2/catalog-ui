// bookParticipantEvents.js

import { fetchConfig } from "../../main.js";
import {
  displayBookParticipants,
  loadBookParticipantsList,
  initializeSelects,
  loadBooksSelect,
  loadParticipantsSelect,
  loadRolesSelect,
} from "../helpers/bookParticipantHelpers.js";
import {
  displayStatusMessage,
  resetStatusMessage,
  toggleVisibility,
} from "../helpers/common.js";
import { BookParticipantService } from "../../api-handlers/bookParticipantService.js";

export async function setupBookParticipantEventHandlers(apiBaseUrl) {
  const bookParticipantService = new BookParticipantService(apiBaseUrl);
  let lastLoadedBookId = "null"; // To keep track of the last loaded book ID
  loadBooksSelect();

  document
    .getElementById("addBookParticipantBtn")
    .addEventListener("click", async () => {
      resetStatusMessage("book-participants");
      const bookId = document.getElementById("load-book-id").value;
      const participantsListEl = document.getElementById(
        "book-participants-list"
      );
      const bookParticipantsFormContainer = document.getElementById(
        "book-participants-form-container"
      );
      const editForm = document.querySelector("form.edit-form");
      if (editForm) {
        editForm.remove();
      }

      loadBooksSelect(true, bookId); // Load with preselected book if any
      loadParticipantsSelect();
      loadRolesSelect();

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
        await loadBookParticipantsList(bookId);
        participantsListEl.style.display = "block";
        bookParticipantsFormContainer.style.display = "block";
        lastLoadedBookId = bookId;
      }

      initializeSelects();
    });

  document
    .getElementById("loadBookParticipants")
    .addEventListener("click", async function () {
      resetStatusMessage("book-participants");
      const bookId = document.getElementById("load-book-id").value;
      const participantsListEl = document.getElementById(
        "book-participants-list"
      );
      const bookParticipantsFormContainer = document.getElementById(
        "book-participants-form-container"
      );

      if (!bookId) {
        console.error("No book ID provided");
        displayStatusMessage(
          "book-participants",
          "Please select a book to load participants.",
          "error"
        );
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
        await loadBookParticipantsList(bookId);
        participantsListEl.style.display = "block";
        if (bookParticipantsFormContainer.style.display === "block") {
          loadBooksSelect(true, bookId); // Load with preselected book if any
          loadParticipantsSelect();
          loadRolesSelect();
        }
        lastLoadedBookId = bookId;
      }
    });

    document.addEventListener("editParticipantRole", async (event) => {
      const { bookId, participantId, newRole } = event.detail;
      try {
        await bookParticipantService.updateParticipantRole(bookId, participantId, newRole);
        displayStatusMessage("book-participants", "Participant's role updated successfully", "success");
        const bookParticipants = await bookParticipantService.fetchBookParticipants(bookId);
        await displayBookParticipants(bookParticipants, false);
      } catch (error) {
        console.error("Error updating participant's role:", error);
        displayStatusMessage(
          "roles",
          `Error updating participant's role: ${error.message}`,
          "error"
        );
      }
    });

  document
    .getElementById("book-participants-list")
    .addEventListener("click", async (event) => {
      const target = event.target;
      if (target.classList.contains("delete-btn")) {
        const bookId = target.dataset.bookId;
        const participantId = target.dataset.participantId;
        try {
          await bookParticipantService.deleteBookParticipant(
            bookId,
            participantId
          );
          target.closest(".book-participants-item").remove();
          displayStatusMessage(
            "book-participants",
            "Participant deleted from book",
            "success"
          );
        } catch (error) {
          console.error("Error deleting participant from book:", error);
          displayStatusMessage(
            "book-participants",
            `Error deleting participant from book: ${error.message}`,
            "error"
          );
        }
      }
    });

  document
    .getElementById("book-participant-form")
    .addEventListener("submit", async (event) => {
      resetStatusMessage("book-participants");
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
          await displayBookParticipants(
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

export async function getBookParticipants(bookId) {
  try {
    const bookParticipantService = new BookParticipantService(await fetchConfig());
    return await bookParticipantService.fetchBookParticipants(bookId);
  } catch (error) {
    console.error("Error fetching book participants:", error);
    throw error;
  }
}