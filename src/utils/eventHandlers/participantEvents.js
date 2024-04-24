// src/utils/eventHandlers/participantEvents.js

import { toggleElement, displayStatusMessage } from "../helpers/common.js";
import { fetchConfig } from "../../main.js";
import { displayParticipants } from "../helpers/participantHelpers.js";
import { ParticipantService } from "../../api-handlers/participantService.js";

export function setupParticipantEventHandlers(apiBaseUrl) {
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
      if (participantsList.style.display === "block") {
        participantsList.style.display = "none";
      } else {
        try {
          const participants = await participantService.fetchParticipants();
          displayParticipants(participants, apiBaseUrl);
          participantsList.style.display = "block";
        } catch (error) {
          console.error("Error loading participants:", error);
          displayStatusMessage(
            "participants",
            `Failed to load participants: ${error.message}`,
            "error"
          );
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
      const participants = await participantService.fetchParticipants();
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
    ? await new ParticipantService(await fetchConfig()).fetchParticipant(participantid)
    : await new ParticipantService(await fetchConfig()).fetchParticipants();
} 