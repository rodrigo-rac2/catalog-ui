// catalog-ui/src/api-handlers/roleService.js

export class RoleService {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async fetchRoles() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/roles/`);
            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching roles:', error);
            return [];
        }
    }

    async addRole(roleData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/roles/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roleData)
            });
            if (!response.ok) {
                const errorResponse = await response.json(); // Assuming the server sends back a JSON with error details
                throw new Error(`Failed to add role: ${errorResponse.message}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error adding role:', error);
            throw error;  // Rethrowing the error to be handled by the caller
        }
    }
    
    async updateRole(roleId, roleData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/roles/${roleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roleData)
            });
            if (!response.ok) {
                const errorResponse = await response.json(); // Assuming the server sends back a JSON with error details
                throw new Error(`Failed to update role: ${errorResponse.message}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating role:', error);
            return null;
        }
    }

    async deleteRole(roleId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/roles/${roleId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(`Failed to delete role: ${errorResponse.message}`);
            }
            return response.ok;
        } catch (error) {
            console.error('Error deleting role:', error);
            throw error; // Re-throw to handle it in the calling context
        }
    }
}
