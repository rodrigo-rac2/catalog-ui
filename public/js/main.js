import { BookManager } from './bookManager.js';
import { ParticipantManager } from './participantManager.js';
import { RoleManager } from './roleManager.js';
import { BookParticipantManager } from './bookParticipantManager.js';

// Base URL of the API
const apiBaseUrl = 'http://127.0.0.1:5100/api';

// Managers
const bookManager = new BookManager(apiBaseUrl);
const participantManager = new ParticipantManager(apiBaseUrl);
const roleManager = new RoleManager(apiBaseUrl);
const bookParticipantManager = new BookParticipantManager(apiBaseUrl);

function toggleForm(containerId) {
    const container = document.getElementById(containerId);
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBookBtn').addEventListener('click', () => toggleForm('book-form-container'));
    document.getElementById('addParticipantBtn').addEventListener('click', () => toggleForm('participant-form-container'));
    document.getElementById('addRoleBtn').addEventListener('click', () => toggleForm('role-form-container'));
    document.getElementById('addBookParticipantBtn').addEventListener('click', () => toggleForm('book-participant-form-container'));

    document.getElementById('loadBooks').addEventListener('click', async () => {
        const books = await bookManager.fetchBooks();
        displayBooks(books);
    });
    document.getElementById('loadParticipants').addEventListener('click', async () => {
        const participants = await participantManager.fetchParticipants();
        displayParticipants(participants);
    });
    document.getElementById('loadRoles').addEventListener('click', async () => {
        const roles = await roleManager.fetchRoles();
        displayRoles(roles);
    });

    document.getElementById('loadBookParticipants').addEventListener('click', async () => {
        const bookId = document.getElementById('load-book-participant-id').value;
        if (!bookId) {
            console.error('No book ID provided');
            return; // Exit if no book ID is provided
        }
        const bookParticipants = await bookParticipantManager.fetchBookParticipants(bookId);
        displayBookParticipants(bookParticipants, bookId);
    });

    // Form submission event listeners
    document.getElementById('book-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const book = {
            title: document.getElementById('book-title').value,
            isbn: document.getElementById('book-isbn').value,
            description: document.getElementById('book-description').value,
            edition: document.getElementById('book-edition').value,
            publisher: document.getElementById('book-publisher').value,
            publicationPlace: document.getElementById('book-publication-place').value,
            publicationDate: document.getElementById('book-publication-date').value,
            numberOfPages: document.getElementById('book-pages').value
        };
        await bookManager.addBook(book);
        toggleForm('book-form-container');  // Optionally close the form
    });

    document.getElementById('participant-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const participant = {
            name: document.getElementById('participant-name').value
        };
        await participantManager.addParticipant(participant);
        toggleForm('participant-form-container');  // Optionally close the form
    });

    document.getElementById('role-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const role = {
            description: document.getElementById('role-description').value
        };
        await roleManager.addRole(role);
        toggleForm('role-form-container');  // Optionally close the form
    });

    document.getElementById('book-participant-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const bookParticipant = {
            bookId: document.getElementById('bp-book-id').value,
            participantId: document.getElementById('bp-participant-id').value,
            roleId: document.getElementById('bp-role-id').value
        };
        await bookParticipantManager.addBookParticipant(bookParticipant);
        toggleForm('book-participant-form-container');  // Optionally close the form
    });
});

function displayBooks(books) {
    const list = document.getElementById('books-list');
    list.innerHTML = '';
    books.forEach(book => {
        const item = document.createElement('li');
        item.textContent = `${book.title} - ISBN: ${book.isbn}`;
        list.appendChild(item);
    });
}

function displayParticipants(participants) {
    const list = document.getElementById('participants-list');
    list.innerHTML = '';
    participants.forEach(participant => {
        const item = document.createElement('li');
        item.textContent = participant.name;
        list.appendChild(item);
    });
}

function displayRoles(roles) {
    const list = document.getElementById('roles-list');
    list.innerHTML = '';
    roles.forEach(role => {
        const item = document.createElement('li');
        item.textContent = role.description;
        list.appendChild(item);
    });
}

function displayBookParticipants(bookParticipants, bookId) {
    const list = document.getElementById('book-participants-list');
    list.innerHTML = '';
    bookParticipants.forEach(bp => {
        const item = document.createElement('li');
        item.textContent = `Book ID: ${bookId}, Participant: ${bp.participant.name} (ID: ${bp.participant.participantid}), Role: ${bp.role.description} (ID: ${bp.role.roleid})`;
        list.appendChild(item);
    });
}
