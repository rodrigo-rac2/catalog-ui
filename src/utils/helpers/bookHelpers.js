// catalog-ui/src/utils/helpers/bookHelpers.js

import { displayStatusMessage } from "./common.js";
import { BookService } from "../../api-handlers/bookService.js";
import { BookParticipantService } from "../../api-handlers/bookParticipantService.js";


export async function displayBooks(books, apiBaseUrl) {
  const list = document.getElementById("books-list");
  list.innerHTML = ""; // Clear previous entries

  if (!list) {
    console.error('displayBooks: No element found with ID "books-list"');
    return;
  }
  list.innerHTML = "";
  books.forEach(async (book) => {
    const item = document.createElement("li");
    item.classList.add("book-item");
    item.id = `book-${book.bookid}`;

    // Buttons for open and delete
    const openBtn = document.createElement("button");
    openBtn.textContent = "Open";
    openBtn.classList.add("open-btn");
    openBtn.onclick = () => {
      openBookDetails(book, apiBaseUrl);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteBook(book.bookid, apiBaseUrl, item);

    // Book title
    const descriptionText = document.createElement("span");
    descriptionText.textContent = `${book.title} by ${await getAuthorListText(
      book, apiBaseUrl
    )}, ISBN: ${book.isbn}`;

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

export async function openBookDetails(book, apiBaseUrl) {
  const detailsDiv = document.getElementById(`book-details-${book.bookid}`);
  const isHidden = detailsDiv.style.display === "none";
  detailsDiv.style.display = isHidden ? "block" : "none"; // Toggle display

  // If opening, fetch details and display
  if (isHidden) {
    try {
      const fetchedBook = await new BookService(apiBaseUrl).fetchBook(book.bookid);
      const authorListText = await getAuthorListText(fetchedBook, apiBaseUrl);

      detailsDiv.innerHTML = `
                <h3>Book: ${fetchedBook.title} </h3>
                <p>By: ${authorListText}</p>
                <p>ID: ${fetchedBook.bookid}</p>
                <p>Description: ${fetchedBook.description}</p>
                <p>Edition: ${fetchedBook.editionnumber}</p>
                <p>Publisher: ${fetchedBook.publisher}</p>
                <p>Date: ${fetchedBook.publicationdate}</p>
                <p>Location: ${fetchedBook.publicationplace}</p>
                <p>Pages: ${fetchedBook.numberofpages}</p>
                <p>ISBN: ${fetchedBook.isbn}</p>
            `;
    } catch (error) {
      console.error('Error fetching book details:', error);
      detailsDiv.innerHTML = '<p>Error loading book details. Please try again.</p>';
    }
  }
}

export async function getAuthorListText(book, apiBaseUrl) {
  // Fetch authors asynchronously
  const authorList = await new BookParticipantService(apiBaseUrl).fetchBookParticipantsWithRole(book.bookid, 1);

  // If there's only one author, return their name directly
  if (authorList.length === 1) {
    return authorList[0].participant.name;
  }

  // Build a string of author names with commas and "and" before the last author
  let authorListText = authorList.map(author => author.participant.name).join(", ");

  // Replace the last comma with ", and" if there are more than one author
  const lastCommaIndex = authorListText.lastIndexOf(",");
  if (lastCommaIndex !== -1) {
    authorListText = authorListText.substring(0, lastCommaIndex) + " and" + authorListText.substring(lastCommaIndex + 1);
  }

  return authorListText;
};


export async function deleteBook(bookid, apiBaseUrl, listItemElement) {
    try {
      response = await new BookService(apiBaseUrl).deleteBook(bookid);
      if (response.ok) {
        listItemElement.remove();
        displayStatusMessage("books", "Book deleted successfully", "success");
      } else {
        displayStatusMessage("books", "Failed to delete book", "error");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      displayStatusMessage(
        "books",
        "Error deleting book: " + error.message,
        "error"
      );
    }
}
