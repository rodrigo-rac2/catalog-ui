// src/utils/eventHandlers/participantEvents.js

import { toggleElement, displayStatusMessage } from "../helpers/common.js";
import { fetchConfig } from "../../main.js";
import { displayParticipants } from "../helpers/participantHelpers.js";
import { ParticipantService } from "../../api-handlers/participantService.js";

export function setupParticipantEventHandlers(apiBaseUrl) {
  let lastSearchTerm = ""; // Variable to store the last search term
  const participantService = new ParticipantService(apiBaseUrl);

  document
    .getElementById("addParticipantBtn")
    .addEventListener("click", () =>
      toggleElement("participant-form-container")
    );

  document
    .getElementById("loadParticipants")
    .addEventListener("click", async () => {
      const participantsList = document.getElementById("participants-list");
      const searchTerm = document.getElementById(
        "participantSearchFilter"
      ).value;

      // Check if the current search term is different from the last search term
      if (searchTerm !== lastSearchTerm) {
        lastSearchTerm = searchTerm; // Update the last search term
        participantsList.style.display = "block"; // Always display the participants list when search term changes
      } else {
        // Toggle display only if the search term has not changed
        participantsList.style.display =
          participantsList.style.display === "block" ? "none" : "block";
      }

      if (participantsList.style.display === "block") {
        try {
          const participants = searchTerm 
          ? await participantService.fetchParticipants({ name: searchTerm })
          : await participantService.fetchParticipants();

          if (participants.length === 0) {
            console.log("No participants found: update search field");
            displayStatusMessage("participants", "No participants found: update search field", "error");
          } else {
            displayParticipants(participants);
          }
        } catch (error) {
          console.error("Error loading participants:", error);
          displayStatusMessage(
            "participants",
            `Failed to load participants: ${error.message}`,
            "error"
          );
          participantsList.style.display = "none"; // Hide the list if there's an error

        }
      }
    });

  document.addEventListener("editParticipant", async (event) => {
    const { participantId, newName } = event.detail;
    try {
      await participantService.updateParticipant(participantId, {
        name: newName,
      });
      displayStatusMessage(
        "participants",
        "Participant updated successfully",
        "success"
      );
      const searchTerm = document.getElementById("participantSearchFilter").value;

      const participants = searchTerm
      ? await participantService.fetchParticipants({ name: searchTerm })
      : await participantService.fetchParticipants();

      if (participants.length === 0) {
        console.log("No participants found: update the search field");
        displayStatusMessage(
          "participants",
          "No participants found: update the search field",
          "error"
        );
      }

      displayParticipants(participants, apiBaseUrl);
    } catch (error) {
      console.error("Error updating participant:", error);
      displayStatusMessage(
        "participants",
        `Error updating participant: ${error.message}`,
        "error"
      );
    }
  });

  document
    .getElementById("participants-list")
    .addEventListener("click", async (event) => {
      const target = event.target;
      if (target.classList.contains("delete-btn")) {
        const participantId = target.dataset.participantId;
        try {
          await participantService.deleteParticipant(participantId);
          target.closest(".participant-item").remove();
          displayStatusMessage(
            "participants",
            "Participant deleted successfully",
            "success"
          );
        } catch (error) {
          console.error("Error deleting participant:", error);
          displayStatusMessage(
            "participants",
            `Error deleting participant: ${error.message}`,
            "error"
          );
        }
      }
    });

  document
    .getElementById("participant-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const participantData = { name: formData.get("name") };
      const participantId = form.dataset.participantId;

      try {
        let result;
        if (participantId) {
          result = await participantService.updateParticipant(
            participantId,
            participantData
          );
        } else {
          result = await participantService.addParticipant(participantData);
        }

        if (result) {
          displayStatusMessage(
            "participants",
            `Participant ${participantId ? "updated" : "added"} successfully!`,
            "success"
          );
          const participants = await participantService.fetchParticipants();
          displayParticipants(participants, apiBaseUrl);
          form.reset();
          delete form.dataset.participantId;
          toggleElement("participant-form-container");
        }
      } catch (error) {
        displayStatusMessage(
          "participants",
          `Failed to ${participantId ? "update" : "add"} participant: ${
            error.message
          }`,
          "error"
        );
      }
    });
}

export async function getParticipants(participantid = null) {
  return participantid
    ? await new ParticipantService(await fetchConfig()).fetchParticipant(
        participantid
      )
    : await new ParticipantService(await fetchConfig()).fetchParticipants();
}
