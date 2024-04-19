import { displayBooks, toggleForm } from "../uiHelpers.js";
import { BookService } from "../../api-handlers/bookService.js";

export function setupBookEventHandlers(apiBaseUrl) {
  const bookService = new BookService(apiBaseUrl);

  document.getElementById("addBookBtn")
    .addEventListener("click", () => toggleForm("book-form-container"));

  document.getElementById("loadBooks")
    .addEventListener("click", async () => {
      displayBooks(await bookService.fetchBooks());
    });

  document.getElementById("book-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      await bookService.addBook(data);
      toggleForm("book-form-container");
      displayBooks(await bookService.fetchBooks());
    });
}
