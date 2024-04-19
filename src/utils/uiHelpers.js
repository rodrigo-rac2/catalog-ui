export function toggleForm(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`toggleForm: No element found with ID '${containerId}'`);
        return;
    }
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

export function displayBooks(books) {
    const list = document.getElementById('books-list');
    if (!list) {
        console.error('displayBooks: No element found with ID "books-list"');
        return;
    }
    list.innerHTML = '';
    books.forEach(book => {
        const item = document.createElement('li');
        item.textContent = `${book.title} - ISBN: ${book.isbn}`;
        list.appendChild(item);
    });
}

export function displayParticipants(participants) {
    const list = document.getElementById('participants-list');
    if (!list) {
        console.error('displayParticipants: No element found with ID "participants-list"');
        return;
    }
    list.innerHTML = '';
    participants.forEach(participant => {
        const item = document.createElement('li');
        item.textContent = participant.name;
        list.appendChild(item);
    });
}

export function displayRoles(roles) {
    const list = document.getElementById('roles-list');
    list.innerHTML = ''; // Clear previous entries

    roles.forEach(role => {
        const item = document.createElement('li');
        item.classList.add('role-item');
        item.id = `role-${role.roleid}`; // Unique ID for the list item

        // Buttons for open and delete
        const openBtn = document.createElement('button');
        openBtn.textContent = 'Open';
        openBtn.onclick = () => {
            openRoleDetails({ id: role.roleid, description: role.description }); // Assume openRoleDetails now takes an ID
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteRole(role.roleid); // Assume deleteRole is a function to handle deletion

        // Role description
        const descriptionText = document.createElement('span');
        descriptionText.textContent = role.description;

        // Details div that will be toggled
        const detailsDiv = document.createElement('div');
        detailsDiv.id = `details-role-${role.roleid}`;
        detailsDiv.style.display = 'none'; // Initially hidden

        item.appendChild(openBtn);
        item.appendChild(deleteBtn);
        item.appendChild(descriptionText);
        item.appendChild(detailsDiv); // This div will hold the detailed info

        list.appendChild(item);
    });
}

export function openRoleDetails(role) {
    const detailsDiv = document.getElementById(`details-role-${role.id}`);
    const isHidden = detailsDiv.style.display === 'none';
    detailsDiv.style.display = isHidden ? 'block' : 'none'; // Toggle display

    // If opening, fetch details and display
    if (isHidden) {
        // Simulated fetch, replace with actual API call
        detailsDiv.innerHTML = `
            <h3>Details for Role:</h3>
            <p>ID: ${role.id}</p>
            <p>Description: ${role.description}</p>
        `;
    }
}

export function deleteRole(role) {
    fetch(`${apiBaseUrl}/roles/${role.id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                displayStatusMessage('Role deleted successfully', 'success');
                roleManager.fetchRoles().then(displayRoles);
            } else {
                displayStatusMessage('Failed to delete role', 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting role:', error);
            displayStatusMessage('Error deleting role: ' + error.message, 'error');
        });
}

export function displayStatusMessage(message, status) {
    const statusDiv = document.getElementById('status-messages');
    statusDiv.textContent = message;
    statusDiv.className = status; // Apply different classes for styling based on success or error
}


export function displayBookParticipants(bookParticipants, bookId) {
    const list = document.getElementById('book-participants-list');
    if (!list) {
        console.error('displayBookParticipants: No element found with ID "book-participants-list"');
        return;
    }
    list.innerHTML = '';
    if (!bookParticipants || bookParticipants.length === 0) {
        const item = document.createElement('li');
        item.textContent = 'No participants found for this book.';
        list.appendChild(item);
        return;
    }
    bookParticipants.forEach(bp => {
        const item = createBookParticipantItem(bp, bookId);
        list.appendChild(item);
    });
}

function createBookParticipantItem(bp, bookId) {
    const item = document.createElement('li');
    item.textContent = `Book ID: ${bookId}, Participant: ${bp.participant.name} (ID: ${bp.participant.participantid}), Role: ${bp.role.description} (ID: ${bp.role.roleid})`;
    return item;
}
