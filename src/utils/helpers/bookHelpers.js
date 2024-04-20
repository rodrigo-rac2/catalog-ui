// catalog-ui/src/utils/helpers/bookHelpers.js

import { displayStatusMessage } from "./common.js";
import { BookService } from "../../api-handlers/bookService.js";

export function displayBooks(books, apiBaseUrl) {
  const list = document.getElementById("books-list");
  list.innerHTML = ""; // Clear previous entries

  if (!list) {
    console.error('displayBooks: No element found with ID "books-list"');
    return;
  }
  list.innerHTML = "";
  books.forEach((book) => {
    const item = document.createElement("li");
    item.classList.add("book-item");
    item.id = `book-${book.bookid}`;

    // Buttons for open and delete
    const openBtn = document.createElement("button");
    openBtn.textContent = "Open";
    openBtn.classList.add("open-btn");
    openBtn.onclick = () => {
      openBookDetails(book);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteBook(book.bookid, apiBaseUrl, item);

    // Book title
    const descriptionText = document.createElement("span");
    descriptionText.textContent = `${book.title}, ISBN: ${book.isbn} `;

    // Details div that will be toggled
    const detailsDiv = document.createElement("div");
    detailsDiv.id = `book-details-${book.bookid}`;
    detailsDiv.style.display = "none"; // Initially hidden

    item.appendChild(openBtn);
    item.appendChild(deleteBtn);
    item.appendChild(descriptionText);
    item.appendChild(detailsDiv); // This div will hold the detailed info

    list.appendChild(item);
  });
}

export function openBookDetails(book) {
  const detailsDiv = document.getElementById(`book-details-${book.bookid}`);
  const isHidden = detailsDiv.style.display === "none";
  detailsDiv.style.display = isHidden ? "block" : "none"; // Toggle display

  // If opening, fetch details and display
  if (isHidden) {
    // Simulated fetch, replace with actual API call
    detailsDiv.innerHTML = `
              <h3>Book: ${book.title} </h3>
              <p>ID: ${book.bookid}</p>
              <p>Description: ${book.description}</p>
              <p>Edition: ${book.editionnumber}</p>
              <p>Publisher: ${book.publisher}</p>
              <p>Date: ${book.publicationdate}</p>
              <p>Location: ${book.publicationplace}</p>
              <p>Pages: ${book.numberofpages}</p>
              <p>ISBN: ${book.isbn}</p>
          `;
  }
}

export function deleteBook(bookid, apiBaseUrl, listItemElement) {
  fetch(`${apiBaseUrl}/books/${bookid}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        listItemElement.remove();
        displayStatusMessage("books", "Book deleted successfully", "success");
      } else {
        displayStatusMessage("books", "Failed to delete book", "error");
      }
    })
    .catch((error) => {
      console.error("Error deleting book:", error);
      displayStatusMessage(
        "books",
        "Error deleting book: " + error.message,
        "error"
      );
    });
}
