// catalog-ui/src/utils/eventHandlers/rolesEvents.js

import { toggleElement, displayStatusMessage } from "../helpers/common.js";
import { fetchConfig } from "../../main.js";
import { displayRoles } from "../helpers/roleHelpers.js";
import { RoleService } from "../../api-handlers/roleService.js";

export function setupRoleEventHandlers(apiBaseUrl) {
  let lastSearchTerm = ""; // Variable to store the last search term
  const roleService = new RoleService(apiBaseUrl);

  document
    .getElementById("addRoleBtn")
    .addEventListener("click", () => toggleElement("role-form-container"));

  document.getElementById("loadRoles").addEventListener("click", async () => {
    const rolesList = document.getElementById("roles-list");
    const searchTerm = document.getElementById("roleSearchFilter").value;

    // Check if the current search term is different from the last search term
    if (searchTerm !== lastSearchTerm) {
      lastSearchTerm = searchTerm; // Update the last search term
      rolesList.style.display = "block"; // Always display the roles list when search term changes
    } else {
      // Toggle display only if the search term has not changed
      rolesList.style.display =
        rolesList.style.display === "block" ? "none" : "block";
    }

    if (rolesList.style.display === "block") {
      try {
        const roles = searchTerm
          ? await roleService.fetchRoles({ description: searchTerm })
          : await roleService.fetchRoles();

        if (roles.length === 0) {
            console.log("No roles found: update search field");
            displayStatusMessage("roles", "No roles found: update search field", "error");
        } else {
            displayRoles(roles);
        }
      } catch (error) {
        console.error("Error loading roles:", error);
        displayStatusMessage(
          "roles",
          `Failed to load roles: ${error.message}`,
          "error"
        );
        rolesList.style.display = "none";  // Hide the list if there's an error
      }
    }
  });

  document.addEventListener("editRole", async (event) => {
    const { roleId, newDescription } = event.detail;
    try {
      await roleService.updateRole(roleId, {
        description: newDescription,
      });
      displayStatusMessage("roles", "Role updated successfully", "success");
      const searchTerm = document.getElementById("roleSearchFilter").value;

      const roles = searchTerm
        ? await roleService.fetchRoles({ description: searchTerm })
        : await roleService.fetchRoles();

      if (roles.length === 0) {
        console.log("No roles found: update the search field");
        displayStatusMessage(
          "roles",
          "No roles found: update the search field",
          "error"
        );
      }
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

export async function getRoles(roleId = null) {
  return roleId
    ? await new RoleService(await fetchConfig()).fetchRole(roleId)
    : await new RoleService(await fetchConfig()).fetchRoles();
}
