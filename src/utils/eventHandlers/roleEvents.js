// catalog-ui/src/utils/eventHandlers/rolesEvents.js

import { toggleElement, displayStatusMessage } from "../helpers/common.js";
import { displayRoles } from "../helpers/roleHelpers.js";
import { RoleService } from "../../api-handlers/roleService.js";

export function setupRoleEventHandlers(apiBaseUrl) {
  const roleService = new RoleService(apiBaseUrl);

  document
    .getElementById("addRoleBtn")
    .addEventListener("click", () => toggleElement("role-form-container"));

  document.getElementById("loadRoles").addEventListener("click", async () => {
    const rolesList = document.getElementById("roles-list");
    if (rolesList.style.display === "block") {
      rolesList.style.display = "none";
    } else {
      try {
        const roles = await roleService.fetchRoles();
        displayRoles(roles, apiBaseUrl);
        rolesList.style.display = "block";
      } catch (error) {
        console.error("Error loading roles:", error);
        displayStatusMessage(
          "roles",
          `Failed to load roles: ${error.message}`,
          "error"
        );
      }
    }
  });

  document.addEventListener("editRole", async (event) => {
    const { roleId, newDescription } = event.detail;
    try {
      await roleService.updateRole(roleId, {
        description: newDescription
      });
      displayStatusMessage("roles", "Role updated successfully", "success");
      const roles = await roleService.fetchRoles();
      displayRoles(roles, apiBaseUrl);
    } catch (error) {
      console.error("Error updating role:", error);
      displayStatusMessage(
        "roles",
        `Error updating role: ${error.message}`,
        "error"
      );
    }
  });

  document
    .getElementById("roles-list")
    .addEventListener("click", async (event) => {
      const target = event.target;
      if (target.classList.contains("delete-btn")) {
        const roleId = target.dataset.roleId;
        try {
          await roleService.deleteRole(roleId);
          target.closest(".role-item").remove();
          displayStatusMessage("roles", "Role deleted successfully", "success");
        } catch (error) {
          console.error("Error deleting role:", error);
          displayStatusMessage(
            "roles",
            `Error deleting role: ${error.message}`,
            "error"
          );
        }
      }
    });

  document
    .getElementById("role-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const roleData = { description: formData.get("description") };
      const roleId = form.dataset.roleId;

      try {
        let result;
        if (roleId) {
          result = await roleService.updateRole(roleId, roleData);
        } else {
          result = await roleService.addRole(roleData);
        }

        if (result) {
          displayStatusMessage(
            "roles",
            `Role ${roleId ? "updated" : "added"} successfully!`,
            "success"
          );
          const roles = await roleService.fetchRoles();
          displayRoles(roles, apiBaseUrl);
          form.reset();
          delete form.dataset.roleId;
          toggleElement("role-form-container");
        }
      } catch (error) {
        displayStatusMessage(
          "roles",
          `Failed to ${roleId ? "update" : "add"} role: ${error.message}`,
          "error"
        );
      }
    });
}
