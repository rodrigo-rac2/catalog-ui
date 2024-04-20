// catalog-ui/src/utils/eventHandlers/rolesEvents.js

import { toggleForm } from "../helpers/common.js";
import { displayRoles } from "../helpers/roleHelpers.js";
import { displayStatusMessage } from "../helpers/common.js";
import { RoleService } from "../../api-handlers/roleService.js";

export function setupRoleEventHandlers(apiBaseUrl) {
  const roleService = new RoleService(apiBaseUrl);

  document
    .getElementById("addRoleBtn")
    .addEventListener("click", () => toggleForm("role-form-container"));

  document.getElementById("loadRoles").addEventListener("click", async () => {
    toggleForm("roles-list");
    displayRoles(await roleService.fetchRoles(), apiBaseUrl);
  });

  document
    .getElementById("role-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const roleData = Object.fromEntries(formData.entries());
      try {
        const addedRole = await roleService.addRole(roleData);
        if (addedRole) {
          displayStatusMessage("roles", "Role added successfully!", "success");
          const roles = await roleService.fetchRoles();
          displayRoles(roles, apiBaseUrl);
          toggleForm("role-form-container"); // Optionally close the form
        }
      } catch (error) {
        displayStatusMessage(
          "roles",
          `Failed to add role: ${error.message}`,
          "error"
        );
      }
    });
}
