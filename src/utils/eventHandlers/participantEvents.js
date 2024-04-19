import { toggleForm } from "../helpers/common.js";
import { displayParticipants } from "../helpers/participantHelpers.js";
import { ParticipantService } from "../../api-handlers/participantService.js";

export function setupParticipantEventHandlers(apiBaseUrl) {
  const participantService = new ParticipantService(apiBaseUrl);

  document.getElementById("addParticipantBtn")
    .addEventListener("click", () => toggleForm("participant-form-container"));

  document.getElementById("loadParticipants")
    .addEventListener("click", async () => {
        toggleForm("participants-list");
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
