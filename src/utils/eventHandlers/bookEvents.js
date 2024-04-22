import { toogleElement } from "../helpers/common.js";
import { displayBooks } from "../helpers/bookHelpers.js";
import { displayStatusMessage } from "../helpers/common.js";
import { BookService } from "../../api-handlers/bookService.js";

export async function setupBookEventHandlers(apiBaseUrl) {
  const bookService = new BookService(apiBaseUrl);

  document
    .getElementById("addBookBtn")
    .addEventListener("click", () => toogleElement("book-form-container"));

  document.getElementById("loadBooks").addEventListener("click", async () => {
    toogleElement("books-list");
    displayBooks(await bookService.fetchBooks(), apiBaseUrl);
  });

  document
    .getElementById("book-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const bookData = Object.fromEntries(formData.entries());

      // Explicitly parse integer fields
      bookData.editionnumber = parseInt(bookData.editionnumber || 0, 10);
      bookData.numberofpages = parseInt(bookData.numberofpages || 0, 10);
      try {
        const addedBook = await bookService.addBook(bookData);
        if (addedBook) {
          displayStatusMessage("books", "Book added successfully!", "success");
          const books = await bookService.fetchBooks();
          displayBooks(books, apiBaseUrl);
          toogleElement("book-form-container"); // Optionally close the form
        }
      } catch (error) {
        displayStatusMessage(
          "books",
          `Failed to add book: ${error.message}`,
          "error"
        );
      }
    });
}
