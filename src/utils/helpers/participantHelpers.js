// src/utils/helpers/participantHelpers.js

export function displayParticipants(participants, apiBaseUrl) {
    const participantsList = document.getElementById("participants-list");
    participantsList.innerHTML = "";

    participants.forEach((participant) => {
        const participantItem = document.createElement("li");
        participantItem.classList.add("participant-item");
        participantItem.id = `participant-${participant.participantid}`;

        const nameSpan = document.createElement("span");
        nameSpan.textContent = participant.name;
        nameSpan.classList.add("participant-name");

        const openBtn = document.createElement("button");
        openBtn.textContent = "Open";
        openBtn.classList.add("open-btn");
        openBtn.onclick = () => toggleParticipantDetails(participant, participantItem);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.onclick = () => toggleEditForm(participant, participantItem);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.dataset.participantId = participant.participantid;

        participantItem.append(openBtn, editBtn, deleteBtn, nameSpan);
        participantsList.appendChild(participantItem);
    });
}

function toggleParticipantDetails(participant, participantItem) {
    const existingForm = participantItem.querySelector("form.details-form");
    if (existingForm) {
        existingForm.remove();
    } else {
        removeAnyExistingForms(participantItem); // Ensures no edit form is open
        const details = document.createElement("form");
        details.className = "details-form";
        details.innerHTML = `<label>Participant details:</label>
                             <p>ID: <input type="text" value="${participant.participantid}" name="id" disabled/>
                             <br>Name: <input type="text" value="${participant.name}" name="name" disabled/></p>
                             <button type="button" onclick="this.parentElement.remove();">Close</button>`;
        participantItem.appendChild(details);
    }
}

function toggleEditForm(participant, participantItem) {
    const existingForm = participantItem.querySelector("form.edit-form");
    if (existingForm) {
        existingForm.remove();
    } else {
        removeAnyExistingForms(participantItem); // Ensures no details form is open
        const form = document.createElement("form");
        form.className = "edit-form";
        form.innerHTML = `<label>Edit Participant:</label>
                          <p>ID: <input type="text" value="${participant.participantid}" name="id" disabled/>
                          <br>Name: <input type="text" value="${participant.name}" name="name"/></p>
                          <button type="submit">Save</button>
                          <button type="button" onclick="this.parentElement.remove();">Cancel</button>`;
        form.onsubmit = (e) => handleEditSubmit(e, participant.participantid, participantItem);
        participantItem.appendChild(form);
    }
}

function handleEditSubmit(event, participantId, participantItem) {
    event.preventDefault();
    const newName = event.target.elements.name.value;
    const customEvent = new CustomEvent("editParticipant", { detail: { participantId, newName } });
    document.dispatchEvent(customEvent);
    event.target.remove(); // Remove form after submission
}

function removeAnyExistingForms(participantItem) {
    const existingForms = participantItem.querySelectorAll("form");
    existingForms.forEach(form => form.remove());
}