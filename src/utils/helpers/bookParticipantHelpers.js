// catalog-ui/src/utils/helpers/bookParticipantHelpers.js

import { resetStatusMessage } from "./common.js";
import { getBooks } from "../eventHandlers/bookEvents.js";
import { getParticipants } from "../eventHandlers/participantEvents.js";
import { getRoles } from "../eventHandlers/roleEvents.js";
import { getBookParticipants } from "../eventHandlers/bookParticipantEvents.js";

export async function displayBookParticipants(bookParticipants, reset = true) {
  const list = document.getElementById("book-participants-list");
  reset ? resetStatusMessage("book-participants") : null;
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
    const header = document.createElement("p");
    header.textContent = `Participants for book ${bookParticipants[0].book.title}:`;
    header.classList.add("book-participants-header");
    list.appendChild(header);
    bookParticipants.forEach(async (bp) => {
      const item = document.createElement("li");

      item.classList.add("book-participants-item");
      item.id = `book-participants-${bp.id}`;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit-btn");
      editBtn.onclick = () => toggleEditForm(bp, item);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.dataset.bookId = bp.book.bookid;
      deleteBtn.dataset.participantId = bp.participant.participantid;

      const descriptionText = document.createElement("span");
      const book = await getBooks(bp.book.bookid);
      descriptionText.textContent = `Book: ${book.title} (ID: ${book.bookid}), Participant: ${bp.participant.name} (ID: ${bp.participant.participantid}), Role: ${bp.role.description} (ID: ${bp.role.roleid})`;

      item.appendChild(editBtn);
      item.appendChild(deleteBtn);
      item.appendChild(descriptionText);

      list.appendChild(item);
    });
  }
}

export async function loadBooksSelect(
  addNewBook = false,
  preselectedBookId = null
) {
  const books = await getBooks();
  const elementId = addNewBook ? "bp-book-id" : "load-book-id";
  const select = document.getElementById(elementId);
  select.innerHTML = "<option></option>"; // Clear existing options
  books.forEach((book) => {
    let option = document.createElement("option");
    option.value = book.bookid;
    option.text = book.title;
    if (preselectedBookId) {
      option.selected = book.bookid.toString() === preselectedBookId.toString(); // Set selected if it matches the preselectedBookId
    }
    select.appendChild(option);
  });

  // Reinitialize Select2
  $(`#${elementId}`).select2({
    placeholder: "Select a book",
    allowClear: true,
  });
}

export async function loadRolesSelect(preselectedRoleId = null) {
  try {
    const roles = await getRoles();
    const elementId = "bp-role-id";
    const select = document.getElementById(elementId);
    select.innerHTML = "<option></option>"; // Clear existing options
    roles.forEach((role) => {
      let option = document.createElement("option");
      option.value = role.roleid;
      option.text = role.description;
      if (preselectedRoleId) {
        option.selected =
          role.roleid.toString() === preselectedRoleId.toString();
      }
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

export async function loadParticipantsSelect(preselectedParticipantId = null) {
  try {
    const participants = await getParticipants();
    const elementId = "bp-participant-id";
    const select = document.getElementById(elementId);
    select.innerHTML = "<option></option>"; // Clear existing options
    participants.forEach((participant) => {
      let option = document.createElement("option");
      option.value = participant.participantid;
      option.text = participant.name;
      if (preselectedParticipantId) {
        option.selected =
          participant.participantid.toString() ===
          preselectedParticipantId.toString(); // Set selected if it matches the preselectedBookId
      }
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

export async function initializeSelects() {
  const selectOptions = {
    placeholder: "Select an option",
    allowClear: true,
    width: "resolve",
  };

  $("#load-book-participant-id, #bp-book-id")
    .select2(selectOptions)
    .on("select2:select", async function (e) {
      const bookId = e.params.data.id;
      if (bookId) {
        await displayBookParticipants(bookId);
        document.getElementById("book-participants-list").style.display =
          "block";
      } else {
        document.getElementById("book-participants-list").style.display =
          "none";
      }
    });

  $("#bp-participant-id, #bp-role-id").select2(selectOptions);
}

export async function loadBookParticipantsList(bookId) {
  if (bookId) {
    const participantsListEl = document.getElementById(
      "book-participants-list"
    );
    const bookParticipants = await getBookParticipants(bookId);

    await displayBookParticipants(bookParticipants);
    participantsListEl.style.display = "block"; // Show the participants list
  } else {
    document.getElementById("book-participants-list").style.display = "none"; // Hide the list if no book ID is provided
  }
}

function toggleEditForm(bp, item) {
  const existingForm = item.querySelector("form.edit-form");
  if (existingForm) {
    existingForm.remove();
  } else {
    removeAnyExistingForms(item); // Ensures no details form is open
    const bookParticipantsFormContainer = document.getElementById(
      "book-participants-form-container"
    );
    bookParticipantsFormContainer.style.display = "none";
    const editForm = document.querySelector("form.edit-form"); // in case user clicked edit on another item
    if (editForm) {
      editForm.remove();
    }

    const form = document.createElement("form");
    form.className = "edit-form";
    form.innerHTML = `<p class="book-participants-header>Edit Participant for Book:</label>
                      <div class="form-section">
                      <label for="bp-book-id">Book:</label>
                      <select id="bp-book-id" name="bookid" disabled></select>
                      </div>
                      <div class="form-section">
                      <label for="bp-participant-id">Participant:</label>
                      <select
                      id="bp-participant-id"
                      name="participantid"
                      disabled
                      ></select>
                      </div>
                      <div class="form-section">
                      <label for="bp-role-id">Role:</label>
                      <select id="bp-role-id" name="roleid" required></select>
                      </div>
                      </p>
                      <button type="submit">Save</button>
                      <button type="button" onclick="this.parentElement.remove();">Cancel</button>`;
    form.onsubmit = (e) =>
      handleEditSubmit(e, bp.book.bookid, bp.participant.participantid, item);
    item.appendChild(form);
    loadBooksSelect(true, bp.book.bookid);
    loadParticipantsSelect(bp.participant.participantid);
    loadRolesSelect(bp.role.roleid);
  }
}

function handleEditSubmit(event, bookId, participantId) {
  event.preventDefault();
  const newRole = event.target.elements.roleid.value;
  const customEvent = new CustomEvent("editParticipantRole", {
    detail: { bookId, participantId, newRole },
  });
  document.dispatchEvent(customEvent);
  event.target.remove(); // Remove form after submission
}

function removeAnyExistingForms(roleItem) {
  const existingForms = roleItem.querySelectorAll("form");
  existingForms.forEach((form) => form.remove());
}
