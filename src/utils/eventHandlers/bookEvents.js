// bookEvents.js

import { toggleElement, displayStatusMessage } from "../helpers/common.js";
import { loadBooksSelect } from "../helpers/bookParticipantHelpers.js";
import { displayBooks } from "../helpers/bookHelpers.js";
import { fetchConfig } from "../../main.js";
import { BookService } from "../../api-handlers/bookService.js";
import { BookParticipantService } from "../../api-handlers/bookParticipantService.js";

export async function setupBookEventHandlers(apiBaseUrl) {
  let lastSearchTerm = ""; // Variable to store the last search term
  const bookService = new BookService(apiBaseUrl);

  document
    .getElementById("addBookBtn")
    .addEventListener("click", () => toggleElement("book-form-container"));

  document.getElementById("loadBooks").addEventListener("click", async () => {
    const booksList = document.getElementById("books-list");
    const searchTerm = document.getElementById("bookSearchFilter").value;

    // Check if the current search term is different from the last search term
    if (searchTerm !== lastSearchTerm) {
      lastSearchTerm = searchTerm; // Update the last search term
      booksList.style.display = "block"; // Always display the books list when search term changes
    } else {
      // Toggle display only if the search term has not changed
      booksList.style.display =
        booksList.style.display === "block" ? "none" : "block";
    }

    // Fetch and display books only if the list is supposed to be visible
    if (booksList.style.display === "block") {
      try {
        const books = searchTerm
          ? await bookService.fetchBooks({ search: searchTerm })
          : await bookService.fetchBooks();

        if (books.length === 0) {
          console.log("No books found: update the search field");
          displayStatusMessage(
            "books",
            "No books found: update the search field",
            "error"
          );
        } else {
          displayBooks(books);
        }
      } catch (error) {
        console.error("Error loading books:", error);
        displayStatusMessage(
          "books",
          `Failed to load books: ${error.message}`,
          "error"
        );
        booksList.style.display = "none"; // Hide the list if there's an error
      }
    }
  });

  document.addEventListener("editBook", async (event) => {
    const {
      bookId,
      newTitle,
      newDescription,
      newEditionNumber,
      newPublisher,
      newPublicationDate,
      newPublicationPlace,
      newNumberOfPages,
      newIsbn,
    } = event.detail;
    try {
      await bookService.updateBook(bookId, {
        title: newTitle,
        description: newDescription,
        editionnumber: newEditionNumber,
        publisher: newPublisher,
        publicationdate: newPublicationDate,
        publicationplace: newPublicationPlace,
        numberofpages: newNumberOfPages,
        isbn: newIsbn,
      });
      displayStatusMessage("books", "Book updated successfully", "success");
      const searchTerm = document.getElementById("bookSearchFilter").value;

      const books = searchTerm
        ? await bookService.fetchBooks({ search: searchTerm })
        : await bookService.fetchBooks();

      if (books.length === 0) {
        console.log("No books found: update the search field");
        displayStatusMessage(
          "books",
          "No books found: update the search field",
          "error"
        );
      }
      displayBooks(books, apiBaseUrl);
      loadBooksSelect();
    } catch (error) {
      console.error("Error updating book:", error);
      displayStatusMessage(
        "books",
        `Error updating book: ${error.message}`,
        "error"
      );
    }
  });

  document
    .getElementById("books-list")
    .addEventListener("click", async (event) => {
      const target = event.target;
      if (target.classList.contains("delete-btn")) {
        const bookId = target.dataset.bookId;
        try {
          await bookService.deleteBook(bookId);
          target.closest(".book-item").remove();
          displayStatusMessage("books", "Book deleted successfully", "success");
          loadBooksSelect();
        } catch (error) {
          console.error("Error deleting book:", error);
          displayStatusMessage(
            "books",
            `Error deleting book: ${error.message}`,
            "error"
          );
        }
      }
    });

  document
    .getElementById("book-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const bookData = {
        title: formData.get("title"),
        isbn: formData.get("isbn"),
        description: formData.get("description"),
        editionnumber: parseInt(formData.get("editionnumber" || 0, 10)),
        publisher: formData.get("publisher"),
        publicationdate: formData.get("publicationdate"),
        publicationplace: formData.get("publicationplace"),
        numberofpages: parseInt(formData.get("numberofpages") || 0, 10),
      };
      const bookId = form.dataset.bookId;

      try {
        let result;
        if (bookId) {
          result = await bookService.updateBook(bookId, bookData);
        } else {
          result = await bookService.addBook(bookData);
        }
        if (result) {
          displayStatusMessage(
            "books",
            `Book ${bookId ? "updated" : "added"} successfully!`,
            "success"
          );
          const books = await bookService.fetchBooks();
          displayBooks(books, apiBaseUrl);
          loadBooksSelect();
          form.reset();
          delete form.dataset.bookId;
          toggleElement("book-form-container"); // Optionally close the form
        }
      } catch (error) {
        displayStatusMessage(
          "books",
          `Failed to ${bookId ? "update" : "add"} book: ${error.message}`,
          "error"
        );
      }
    });
}

export async function getAuthorsForBook(bookId) {
  try {
    const authors = await new BookParticipantService(
      await fetchConfig()
    ).fetchBookParticipantsWithRole(bookId, 1);
    if (!authors) {
      displayStatusMessage(
        "books",
        `No authors found for book ${bookId}`,
        "error"
      );
      return [];
    }

    console.log(
      "books",
      `Authors for book ${bookId}: ${authors.map(
        (author) => author.participant.name
      )}`,
      "success"
    );

    return authors;
  } catch (error) {
    console.error("Error getting authors for book:", error);
    displayStatusMessage(
      "books",
      `Error getting authors for book: ${error.message}`,
      "error"
    );
  }
}

export async function getNonAuthorsForBook(bookId) {
  try {
    const nonAuthors = await new BookParticipantService(
      await fetchConfig()
    ).fetchBookParticipantsWithoutRole(bookId, 1);
    if (nonAuthors.length === 0) {
      console.log(
        `No non-authors found for book ${bookId} (this is ok)`,
        "success"
      );
      return [];
    } else {
      console.log(
        `Non-authors for book ${bookId}: ${nonAuthors.map(
          (nonAuthor) => nonAuthor.participant.name
        )}`,
        "success"
      );

      return nonAuthors;
    }
  } catch (error) {
    console.error("Error getting non-authors for book:", error);
    displayStatusMessage(
      "books",
      `Error getting non-authors for book: ${error.message}`,
      "error"
    );
  }
}

export async function getBooks(bookid = null) {
  return bookid
    ? await new BookService(await fetchConfig()).fetchBook(bookid)
    : await new BookService(await fetchConfig()).fetchBooks();
}
