// catalog-ui/src/utils/helpers/bookParticipantHelpers.js

import { displayStatusMessage } from "./common.js";
import { BookParticipantService } from "../../api-handlers/bookParticipantService.js";
import { BookService } from "../../api-handlers/bookService.js";
import { ParticipantService } from "../../api-handlers/participantService.js";
import { RoleService } from "../../api-handlers/roleService.js";

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

export async function loadBooksSelect(apiBaseUrl, addNewBook = false, preselectedBookId = null) {
  const books = await new BookService(apiBaseUrl).fetchBooks();
  const elementId = addNewBook ? "bp-book-id" : "load-book-id";
  const select = document.getElementById(elementId);
  select.innerHTML = '<option></option>'; // Clear existing options
  books.forEach((book) => {
    let option = document.createElement("option");
    option.value = book.bookid;
    option.text = book.title;
    option.selected = book.bookid.toString() === preselectedBookId; // Set selected if it matches the preselectedBookId
    select.appendChild(option);
  });

  // Reinitialize Select2
  $(`#${elementId}`).select2({
    placeholder: "Select a book",
    allowClear: true
  });
}

export async function loadRolesSelect(apiBaseUrl) {
  try {
    const roles = await new RoleService(apiBaseUrl).fetchRoles();
    const select = document.getElementById("bp-role-id");
    select.innerHTML = '<option></option>'; // Clear existing options
    roles.forEach((role) => {
      let option = new Option(role.description, role.roleid);
      select.appendChild(option);
    });

    // Reinitialize Select2
    $("#bp-role-id").select2({
      placeholder: "Select a role",
      allowClear: true,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
}

export async function loadParticipantsSelect(apiBaseUrl) {
  try {
    const participants = await new ParticipantService(
      apiBaseUrl
    ).fetchParticipants();
    const select = document.getElementById("bp-participant-id");
    select.innerHTML = '<option></option>'; // Clear existing options
    participants.forEach((participant) => {
      let option = new Option(participant.name, participant.participantid);
      select.appendChild(option);
    });

    // Reinitialize Select2
    $("#bp-participant-id").select2({
      placeholder: "Select a participant",
      allowClear: true,
    });
  } catch (error) {
    console.error("Error fetching participants:", error);
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

export async function initializeSelects(apiBaseUrl) {
  const selectOptions = {
    placeholder: "Select an option",
    allowClear: true,
    width: "resolve",
  };

  $("#load-book-participant-id, #bp-book-id")
    .select2(selectOptions)
    .on("select2:select", function (e) {
      const bookId = e.params.data.id;
      if (bookId) {
        displayBookParticipants(bookId, apiBaseUrl);
        document.getElementById("book-participants-list").style.display =
          "block";
      } else {
        document.getElementById("book-participants-list").style.display =
          "none";
      }
    });

  $("#bp-participant-id, #bp-role-id").select2(selectOptions);
}

export async function loadBookParticipantsList(bookId, apiBaseUrl) {
  if (bookId) {
    const participantsListEl = document.getElementById(
      "book-participants-list"
    );
    const bookParticipants = await new BookParticipantService(apiBaseUrl).fetchBookParticipants(
      bookId
    );
    displayBookParticipants(bookParticipants, apiBaseUrl);
    participantsListEl.style.display = "block"; // Show the participants list
  } else {
    document.getElementById("book-participants-list").style.display = "none"; // Hide the list if no book ID is provided
  }
}
