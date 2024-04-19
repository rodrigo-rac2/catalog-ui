import { BookManager } from './bookManager.js';
import { ParticipantManager } from './participantManager.js';
import { RoleManager } from './roleManager.js';
import { BookParticipantManager } from './bookPbookidbookidarticipantManager.js';
// import dotenv from 'dotenv'
// dotenv.config()

// const apiBaseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:5100/api';

const apiBaseUrl = 'http://127.0.0.1:5100/api';

const bookManager = new BookManager(apiBaseUrl);
const participantManager = new ParticipantManager(apiBaseUrl);
const roleManager = new RoleManager(apiBaseUrl);
const bookParticipantManager = new BookParticipantManager(apiBaseUrl);

document.addEventListener('DOMContentLoaded', () => {
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
        bookid = document.getElementById('bookid').value;
        const bookParticipants = await bookParticipantManager.fetchBookParticipants(bookid);
        displayBookParticipants(bookParticipants);
    });

    // Handle the forms for adding new entries using forms' submit events
    document.getElementById('book-form').addEventListener('submit', handleBookSubmit);
    document.getElementById('participant-form').addEventListener('submit', handleParticipantSubmit);
    document.getElementById('role-form').addEventListener('submit', handleRoleSubmit);
    document.getElementById('book-participant-form').addEventListener('submit', handleBookParticipantSubmit);
});

function displayBooks(books) {
    const booksList = document.getElementById('books-list');
    booksList.innerHTML = '';
    books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} - ISBN: ${book.isbn}`;
        booksList.appendChild(li);
    });
}

function displayParticipants(participants) {
    const participantsList = document.getElementById('participants-list');
    participantsList.innerHTML = '';
    participants.forEach(participant => {
        const li = document.createElement('li');
        li.textContent = participant.name;
        participantsList.appendChild(li);
    });
}

function displayRoles(roles) {
    const rolesList = document.getElementById('roles-list');
    rolesList.innerHTML = '';
    roles.forEach(role => {
        const li = document.createElement('li');
        li.textContent = role.description;
        rolesList.appendChild(li);
    });
}

function displayBookParticipants(bookParticipants) {
    const bookParticipantsList = document.getElementById('book-participants-list');
    bookParticipantsList.innerHTML = '';
    bookParticipants.forEach(bp => {
        const li = document.createElement('li');
        li.textContent = `Book ID: ${bp.bookId}, Participant ID: ${bp.participantId}, Role ID: ${bp.roleId}`;
        bookParticipantsList.appendChild(li);
    });
}

async function handleBookSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('book-title').value;
    const isbn = document.getElementById('book-isbn').value;
    const description = document.getElementById('book-description').value;
    // Collect other form fields similarly
    const bookData = { title, isbn, description }; // Add other fields accordingly
    await bookManager.addBook(bookData);
    await bookManager.fetchBooks(); // Refresh the list
}

async function handleParticipantSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('participant-name').value;
    await participantManager.addParticipant({ name });
    await participantManager.fetchParticipants(); // Refresh the list
}

async function handleRoleSubmit(event) {
    event.preventDefault();
    const description = document.getElementById('role-description').value;
    await roleManager.addRole({ description });
    await roleManager.fetchRoles(); // Refresh the list
}

async function handleBookParticipantSubmit(event) {
    event.preventDefault();
    const bookId = document.getElementById('bp-book-id').value;
    const participantId = document.getElementById('bp-participant-id').value;
    const roleId = document.getElementById('bp-role-id').value;
    await bookParticipantManager.addBookParticipant({ bookId, participantId, roleId });
    await bookParticipantManager.fetchBookParticipants(); // Refresh the list
}
