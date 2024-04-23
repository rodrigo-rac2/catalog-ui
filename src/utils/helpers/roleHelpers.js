// src/utils/helpers/roleHelpers.js

export function displayRoles(roles) {
  const roleList = document.getElementById("roles-list");
  roleList.innerHTML = ""; // Clear previous entries

  roles.forEach((role) => {
    const roleItem = document.createElement("li");
    roleItem.classList.add("role-item");
    roleItem.id = `role-${role.roleid}`; // Unique ID for the list item

    const descriptionSpan = document.createElement("span");
    descriptionSpan.textContent = role.description;
    descriptionSpan.classList.add("role-description");

    // Buttons for open and delete
    const openBtn = document.createElement("button");
    openBtn.textContent = "Open";
    openBtn.classList.add("open-btn");
    openBtn.onclick = () => toggleRoleDetails(role, roleItem);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.onclick = () => toggleEditForm(role, roleItem);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.dataset.roleId = role.roleid;

    roleItem.append(openBtn, editBtn, deleteBtn, descriptionSpan);
    roleList.appendChild(roleItem);
  });
}

function toggleRoleDetails(role, roleItem) {
  const roleFormClassName = `role-details-form-${role.roleid}`;
  const existingForm = roleItem.querySelector(`form.${roleFormClassName}`);
  if (existingForm) {
    existingForm.remove();
  } else {
    removeAnyExistingForms(roleItem); // Ensures no edit form is open
    const details = document.createElement("form");
    details.className = roleFormClassName;
    details.innerHTML = `<label>Role details:</label>
                           <p>ID: <input type="text" value="${role.roleid}" name="id" disabled/>
                           <br>Description: <input type="text" value="${role.description}" name="name" disabled/></p>
                           <button type="button" onclick="this.parentElement.remove();">Close</button>`;
    roleItem.appendChild(details);
  }
}

function toggleEditForm(role, roleItem) {
  const existingForm = roleItem.querySelector("form.edit-form");
  if (existingForm) {
    existingForm.remove();
  } else {
    removeAnyExistingForms(roleItem); // Ensures no details form is open
    const form = document.createElement("form");
    form.className = "edit-form";
    form.innerHTML = `<label>Edit role:</label>
                        <p>ID: <input type="text" value="${role.roleid}" name="id" disabled/>
                        <br>Description: <input type="text" value="${role.description}" name="description"/></p>
                        <button type="submit">Save</button>
                        <button type="button" onclick="this.parentElement.remove();">Cancel</button>`;
    form.onsubmit = (e) =>
      handleEditSubmit(e, role.roleid, roleItem);
    roleItem.appendChild(form);
  }
}

function handleEditSubmit(event, roleId, roleItem) {
  event.preventDefault();
  const newDescription = event.target.elements.description.value;
  const customEvent = new CustomEvent("editRole", {
    detail: { roleId, newDescription },
  });
  document.dispatchEvent(customEvent);
  event.target.remove(); // Remove form after submission
}

function removeAnyExistingForms(roleItem) {
  const existingForms = roleItem.querySelectorAll("form");
  existingForms.forEach((form) => form.remove());
}
