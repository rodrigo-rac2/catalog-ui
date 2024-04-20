import { toggleForm } from "../helpers/common.js";
import { displayParticipants } from "../helpers/participantHelpers.js";
import { displayStatusMessage } from "../helpers/common.js";
import { ParticipantService } from "../../api-handlers/participantService.js";

export function setupParticipantEventHandlers(apiBaseUrl) {
  const participantService = new ParticipantService(apiBaseUrl);

  document.getElementById("addParticipantBtn")
    .addEventListener("click", () => toggleForm("participant-form-container"));

  document.getElementById("loadParticipants")
    .addEventListener("click", async () => {
        toggleForm("participants-list");
        displayParticipants(await participantService.fetchParticipants(), apiBaseUrl);
    });

    document
    .getElementById("participant-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const participantData = Object.fromEntries(formData.entries());
      try {
        const addedParticipant = await participantService.addParticipant(participantData);
        if (addedParticipant) {
          displayStatusMessage("participants", "Participant added successfully!", "success");
          const participants = await participantService.fetchParticipants();
          displayParticipants(participants, apiBaseUrl);
          toggleForm("role-form-container"); // Optionally close the form
        }
      } catch (error) {
        displayStatusMessage(
          "participants",
          `Failed to add participant: ${error.message}`,
          "error"
        );
      }
    });
}
