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
