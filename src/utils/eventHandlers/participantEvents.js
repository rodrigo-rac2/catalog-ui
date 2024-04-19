import { displayParticipants, toggleForm } from "../uiHelpers.js";
import { ParticipantService } from "../../api-handlers/participantService.js";

export function setupParticipantEventHandlers(apiBaseUrl) {
  const participantService = new ParticipantService(apiBaseUrl);

  document.getElementById("addParticipantBtn")
    .addEventListener("click", () => toggleForm("participant-form-container"));

  document.getElementById("loadParticipants")
    .addEventListener("click", async () => {
      displayParticipants(await participantService.fetchParticipants());
    });

  document.getElementById("participant-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      await participantService.addParticipant(data);
      toggleForm("participant-form-container");
      displayParticipants(await participantService.fetchParticipants());
    });
}
