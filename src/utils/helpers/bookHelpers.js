// catalog-ui/src/utils/helpers/bookHelpers.js

import {
  getAuthorsForBook,
  getNonAuthorsForBook,
} from "../eventHandlers/bookEvents.js";

export async function displayBooks(books) {
  const bookList = document.getElementById("books-list");
  bookList.innerHTML = ""; // Clear previous entries

  if (!bookList) {
    console.error('displayBooks: No element found with ID "books-list"');
    return;
  }
  bookList.innerHTML = "";
  books.forEach(async (book) => {
    const bookItem = document.createElement("li");
    bookItem.classList.add("book-item");
    bookItem.id = `book-${book.bookid}`;

    const bookDescriptionSpan = document.createElement("span");
    bookDescriptionSpan.textContent = `${
      book.title
    } by ${await getAuthorsListText(book)}, ISBN: ${book.isbn}`;
    bookDescriptionSpan.classList.add("book-description");

    // Buttons for open and delete
    const openBtn = document.createElement("button");
    openBtn.textContent = "Open";
    openBtn.classList.add("open-btn");
    openBtn.onclick = () => {
      toggleBookDetails(book, bookItem);
    };

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.onclick = () => toggleEditForm(book, bookItem);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.dataset.bookId = book.bookid;

    bookItem.append(openBtn, editBtn, deleteBtn, bookDescriptionSpan);
    bookList.appendChild(bookItem);
  });
}

async function toggleBookDetails(book, bookItem) {
  const bookFormClassName = `book-details-form-${book.bookid}`;
  const existingForm = bookItem.querySelector(`form.${bookFormClassName}`);
  if (existingForm) {
    existingForm.remove();
  } else {
    removeAnyExistingForms(bookItem); // Ensures no edit form is open
    const details = document.createElement("form");
    details.className = bookFormClassName;
    const authorListText = await getAuthorsListText(book);
    const nonAuthorInnerHtml = (await getNonAuthorsListText(book))
      ? `<br />And: <br/><input type="text" value="${await getNonAuthorsListText(
          book
        )}" name="participants" disabled/>`
      : "";
    details.innerHTML = `<label>Book details:</label>
                             <p>
                             Title: <br /><input type="text" value="${book.title}" name="title" disabled/>
                             <br />By: <br /><input type="text" value="${authorListText}" name="authors" disabled/>
                             ${nonAuthorInnerHtml}
                             <br />ID: <br /><input type="text" value="${book.bookid}" name="id" disabled/>
                             <br />Description: <br /><input type="text" value="${book.description}" name="description" disabled/>
                             <br />Publisher: <br /><input type="text" value="${book.publisher}" name="publisher" disabled/>
                             <br />Edition: <br /><input type="text" value="${book.editionnumber}" name="editionnumber" disabled/>
                             <br />Date: <br /><input type="date" value="${book.publicationdate}" name="publicationdate" disabled/>
                             <br />Location: <br /><input type="text" value="${book.publicationplace}" name="publicationplace" disabled/>
                             <br />Pages: <br /><input type="text" value="${book.numberofpages}" name="numberofpages" disabled/>
                             <br />ISBN: <br /><input type="text" value="${book.isbn}" name="isbn" disabled/>
                             </p>
                             <button type="button" onclick="this.parentElement.remove();">Close</button>`;
    bookItem.appendChild(details);
  }
}

async function toggleEditForm(book, bookItem) {
  const existingForm = bookItem.querySelector("form.edit-form");
  if (existingForm) {
    existingForm.remove();
  } else {
    removeAnyExistingForms(bookItem); // Ensures no details form is open
    const form = document.createElement("form");
    form.className = "edit-form";
    const authorListText = await getAuthorsListText(book);
    const nonAuthorInnerHtml = (await getNonAuthorsListText(book))
      ? `<br />And: <br /><input type="text" value="${await getNonAuthorsListText(
          book
        )}" name="participants" disabled/>`
      : "";
    form.innerHTML = `<label>Edit Book:</label>
                          <p>
                          Title: <br /><input type="text" value="${book.title}" name="title"/>
                          <br />By: <br /><input type="text" value="${authorListText}" name="authors" disabled/>
                          ${nonAuthorInnerHtml}
                          <br />ID: <br /><input type="text" value="${book.bookid}" name="id" disabled/>
                          <br />Description: <br /><input type="text" value="${book.description}" name="description"/>
                          <br />Publisher: <br /><input type="text" value="${book.publisher}" name="publisher"/>
                          <br />Edition: <br /><input type="text" value="${book.editionnumber}" name="editionnumber"/>
                          <br />Date: <br /><input type="date" value="${book.publicationdate}" name="publicationdate"/>
                          <br />Location: <br /><input type="text" value="${book.publicationplace}" name="publicationplace"/>
                          <br />Pages: <br /><input type="text" value="${book.numberofpages}" name="numberofpages"/>
                          <br />ISBN: <br /><input type="text" value="${book.isbn}" name="isbn"/>
                          </p>
                          <button type="submit">Save</button>
                          <button type="button" onclick="this.parentElement.remove();">Cancel</button>`;
    form.onsubmit = (e) => handleEditSubmit(e, book.bookid, bookItem);
    bookItem.appendChild(form);
  }
}

function handleEditSubmit(event, bookId, bookItem) {
  event.preventDefault();
  const newTitle = event.target.elements.title.value;
  const newDescription = event.target.elements.description.value;
  const newEditionNumber = event.target.elements.editionnumber.value;
  const newPublisher = event.target.elements.publisher.value;
  const newPublicationDate = event.target.elements.publicationdate.value;
  const newPublicationPlace = event.target.elements.publicationplace.value;
  const newNumberOfPages = event.target.elements.numberofpages.value;
  const newIsbn = event.target.elements.isbn.value;

  const customEvent = new CustomEvent("editBook", {
    detail: {
      bookId,
      newTitle,
      newDescription,
      newEditionNumber,
      newPublisher,
      newPublicationDate,
      newPublicationPlace,
      newNumberOfPages,
      newIsbn
    },
  });
  document.dispatchEvent(customEvent);
  event.target.remove(); // Remove form after submission
}

function removeAnyExistingForms(bookItem) {
  const existingForms = bookItem.querySelectorAll("form");
  existingForms.forEach((form) => form.remove());
}

async function getAuthorsListText(book) {
  // Fetch authors asynchronously
  const authorList = await getAuthorsForBook(book.bookid, 1);

  if (authorList.length === 0) {
    return `Please add authors for ${book.title}`;
  }

  if (authorList.length === 1) {
    return authorList[0].participant.name;
  }

  let authorListText = authorList.map((author) => author.participant.name).join(", ");

  const lastCommaIndex = authorListText.lastIndexOf(",");
  if (lastCommaIndex !== -1) {
    authorListText =
      authorListText.substring(0, lastCommaIndex) +
      " and" +
      authorListText.substring(lastCommaIndex + 1);
  }

  return authorListText;
}

async function getNonAuthorsListText(book) {
  // Fetch authors asynchronously
  const participantList = await getNonAuthorsForBook(book.bookid, 1);

  if (!participantList || participantList.length === 0) {
    return;
  }

  if (participantList.length === 1) {
    return `${participantList[0].participant.name} (${participantList[0].role.description})`;
  }

  let participantListText = participantList
    .map(
      (participant) =>
        `${participant.participant.name} (${participant.role.description})`
    )
    .join(", ");

  const lastCommaIndex = participantListText.lastIndexOf(",");
  if (lastCommaIndex !== -1) {
    participantListText =
      participantListText.substring(0, lastCommaIndex) +
      " and" +
      participantListText.substring(lastCommaIndex + 1);
  }

  return participantListText;
}
