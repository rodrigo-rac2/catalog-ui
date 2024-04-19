// script.js
function fetchBooks() {
    fetch('http://127.0.0.1:5100/api/books/')
        .then(response => response.json())
        .then(data => {
            const booksList = document.getElementById('books-list');
            booksList.innerHTML = '';
            data.forEach(book => {
                const li = document.createElement('li');
                li.textContent = `${book.title} - ISBN: ${book.isbn}`;
                booksList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading books:', error));
}

function fetchParticipants() {
    fetch('http://127.0.0.1:5100/api/participants/')
        .then(response => response.json())
        .then(data => {
            const participantsList = document.getElementById('participants-list');
            participantsList.innerHTML = '';
            data.forEach(participant => {
                const li = document.createElement('li');
                li.textContent = participant.name;
                participantsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading participants:', error));
}

function fetchRoles() {
    fetch('http://127.0.0.1:5100/api/roles/')
        .then(response => response.json())
        .then(data => {
            const rolesList = document.getElementById('roles-list');
            rolesList.innerHTML = '';
            data.forEach(role => {
                const li = document.createElement('li');
                li.textContent = role.description;
                rolesList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading roles:', error));
}
