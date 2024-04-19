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
