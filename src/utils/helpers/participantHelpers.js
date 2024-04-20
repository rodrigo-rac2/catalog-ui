// catalog-ui/src/utils/helpers/participantHelpers.js

import { displayStatusMessage } from "./common.js";
import { ParticipantService } from "../../api-handlers/participantService.js";

let apiBaseUrl;

export function displayParticipants(participants, apiBaseUrl) {
  apiBaseUrl = apiBaseUrl;
  const participantsList = document.getElementById("participants-list");
  participantsList.innerHTML = ""; // Clear previous entries

  participants.forEach((participant) => {
    const participantItem = document.createElement("li");
    participantItem.classList.add("participant-item");
    participantItem.id = `participant-${participant.participantid}`; // Unique ID for the list item

    // Create open and delete buttons for each participant
    const openBtn = document.createElement("button");
    openBtn.textContent = "Open";
    openBtn.classList.add("open-btn");
    openBtn.onclick = () => {
      openParticipantDetails({
        id: participant.participantid,
        name: participant.name,
      });
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () =>
      deleteParticipant(participant.participantid, apiBaseUrl, participantItem);

    // Participant description
    const descriptionText = document.createElement("span");
    descriptionText.textContent = participant.name;

    // Details div that will be toggled
    const detailsDiv = document.createElement("div");
    detailsDiv.id = `details-participant-${participant.participantid}`;
    detailsDiv.style.display = "none"; // Initially hidden

    participantItem.appendChild(openBtn);
    participantItem.appendChild(deleteBtn);
    participantItem.appendChild(descriptionText);
    participantItem.appendChild(detailsDiv); // This div will hold the detailed info

    participantsList.appendChild(participantItem);
  });
}

export function openParticipantDetails(participant) {
  const detailsDiv = document.getElementById(
    `details-participant-${participant.id}`
  );
  const isHidden = detailsDiv.style.display === "none";
  detailsDiv.style.display = isHidden ? "block" : "none"; // Toggle display

  // If opening, fetch details and display
  if (isHidden) {
    detailsDiv.innerHTML = `
              <h3>Details for Participant:</h3>
              <p>ID: ${participant.id}</p>
              <p>Name: ${participant.name}</p>
          `;
  }
}

export function deleteParticipant(participantid, apiBaseUrl, participantItem) {
  fetch(`${apiBaseUrl}/participants/${participantid}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        participantItem.remove();
        displayStatusMessage(
          "participants",
          "Participant deleted successfully",
          "success"
        );
      } else {
        displayStatusMessage(
          "participants",
          "Failed to delete participant",
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Error deleting participant:", error);
      displayStatusMessage(
        "participants",
        "Error deleting participant: " + error.message,
        "error"
      );
    });
}
