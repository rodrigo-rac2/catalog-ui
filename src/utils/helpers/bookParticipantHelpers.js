// catalog-ui/src/utils/helpers/bookParticipantHelpers.js

import { displayStatusMessage } from "./common.js";
import { BookParticipantService } from "../../api-handlers/bookParticipantService.js";
import { BookService } from "../../api-handlers/bookService.js";

export async function displayBookParticipants(bookParticipants, apiBaseUrl) {
  const list = document.getElementById("book-participants-list");
  list.innerHTML = "";

  if (!list) {
    console.error(
      'displayBookParticipants: No element found with ID "book-participants-list"'
    );
    return;
  }
  if (!bookParticipants || bookParticipants.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No participants found for this book.";
    list.appendChild(item);
    return;
  }
  if (Array.isArray(bookParticipants) && bookParticipants.length > 0) {
    bookParticipants.forEach(async (bp) => {
      const item = document.createElement("li");

      item.classList.add("book-participants-item");
      item.id = `book-participants-${bp.id}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.onclick = () =>
        deleteBookParticipant(
          bp.book.bookid,
          bp.participant.participantid,
          apiBaseUrl,
          item
        );

      const descriptionText = document.createElement("span");
      const book = await new BookService(apiBaseUrl).fetchBook(bp.book.bookid);
      descriptionText.textContent = `Book: ${book.title} (ID: ${book.bookid}), Participant: ${bp.participant.name} (ID: ${bp.participant.participantid}), Role: ${bp.role.description} (ID: ${bp.role.roleid})`;

      item.appendChild(deleteBtn);
      item.appendChild(descriptionText);

      list.appendChild(item);
    });
  }
}

export async function deleteBookParticipant(
  bookid,
  participantid,
  apiBaseUrl,
  listItemElement
) {
  try {
    await new BookParticipantService(apiBaseUrl).deleteBookParticipant(
      bookid,
      participantid
    );
    listItemElement.remove(); // Directly remove the list item element from DOM
    displayStatusMessage(
      "book-participants",
      "Participant deleted from book successfully",
      "success"
    );
  } catch (error) {
    console.error("Error deleting book participant:", error);
    displayStatusMessage(
      "book-participants",
      "Error deleting participant from book: " + error.message,
      "error"
    );
  }
}
