// catalog-ui/src/utils/helpers/roleHelpers.js

import { displayStatusMessage } from "./common.js";
import { RoleService } from "../../api-handlers/roleService.js";

export function displayRoles(roles, apiBaseUrl) {
  apiBaseUrl = apiBaseUrl;
  const list = document.getElementById("roles-list");
  list.innerHTML = ""; // Clear previous entries

  roles.forEach((role) => {
    const item = document.createElement("li");
    item.classList.add("role-item");
    item.id = `role-${role.roleid}`; // Unique ID for the list item

    // Buttons for open and delete
    const openBtn = document.createElement("button");
    openBtn.textContent = "Open";
    openBtn.classList.add("open-btn");
    openBtn.onclick = () => {
      openRoleDetails({ id: role.roleid, description: role.description }); // Assume openRoleDetails now takes an ID
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteRole(role.roleid, apiBaseUrl, item); // Assume deleteRole is a function to handle deletion

    // Role description
    const descriptionText = document.createElement("span");
    descriptionText.textContent = role.description;

    // Details div that will be toggled
    const detailsDiv = document.createElement("div");
    detailsDiv.id = `role-details-${role.roleid}`;
    detailsDiv.style.display = "none"; // Initially hidden

    item.appendChild(openBtn);
    item.appendChild(deleteBtn);
    item.appendChild(descriptionText);
    item.appendChild(detailsDiv); // This div will hold the detailed info

    list.appendChild(item);
  });
}

export function openRoleDetails(role) {
  const detailsDiv = document.getElementById(`role-details-${role.id}`);
  const isHidden = detailsDiv.style.display === "none";
  detailsDiv.style.display = isHidden ? "block" : "none"; // Toggle display

  // If opening, fetch details and display
  if (isHidden) {
    // Simulated fetch, replace with actual API call
    detailsDiv.innerHTML = `
            <h3>Details for Role:</h3>
            <p>ID: ${role.id}</p>
            <p>Description: ${role.description}</p>
        `;
  }
}

export function deleteRole(roleid, apiBaseUrl, listItemElement) {
  fetch(`${apiBaseUrl}/roles/${roleid}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        listItemElement.remove();
        displayStatusMessage("roles", "Role deleted successfully", "success");
      } else {
        displayStatusMessage("roles", "Failed to delete role", "error");
      }
    })
    .catch((error) => {
      console.error("Error deleting role:", error);
      displayStatusMessage(
        "roles",
        "Error deleting role: " + error.message,
        "error"
      );
    });
}
