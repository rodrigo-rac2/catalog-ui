import { toggleForm } from "../helpers/common.js";
import { displayBookParticipants } from "../helpers/bookParticipantHelpers.js";
import { BookParticipantService } from "../../api-handlers/bookParticipantService.js";

export function setupBookParticipantEventHandlers(apiBaseUrl) {
  const bookParticipantService = new BookParticipantService(apiBaseUrl);

  document.getElementById("addBookParticipantBtn")
    .addEventListener("click", () => toggleForm("book-participant-form-container"));

  document.getElementById("loadBookParticipants")
    .addEventListener("click", async () => {
      const bookId = document.getElementById("load-book-participant-id").value;
      if (bookId) {
        displayBookParticipants(
          await bookParticipantService.fetchBookParticipants(bookId),
          bookId
        );
      } else {
        console.error("No book ID provided");
      }
    });

  document.getElementById("book-participant-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      await bookParticipantService.addBookParticipant(data);
      toggleForm("book-participant-form-container");
      displayBookParticipants(
        await bookParticipantService.fetchBookParticipants(data.bookId),
        data.bookId
      );
    });
}
