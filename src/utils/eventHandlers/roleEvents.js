import { toggleForm } from "../helpers/common.js";
import { displayRoles } from "../helpers/roleHelpers.js";
import { RoleService } from "../../api-handlers/roleService.js";

export function setupRoleEventHandlers(apiBaseUrl) {
  const roleService = new RoleService(apiBaseUrl);

  document.getElementById("addRoleBtn")
    .addEventListener("click", () => toggleForm("role-form-container"));

  document.getElementById("loadRoles")
    .addEventListener("click", async () => {
      toggleForm("roles-list");
      displayRoles(await roleService.fetchRoles());
    });

  document.getElementById("role-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      await roleService.addRole(data);
      toggleForm("role-form-container");
      displayRoles(await roleService.fetchRoles());
    });
}
