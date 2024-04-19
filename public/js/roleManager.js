export class RoleManager {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async fetchRoles() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/roles/`);
            if (!response.ok) throw new Error('Failed to fetch roles');
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
            if (!response.ok) throw new Error('Failed to add role');
            return await response.json();
        } catch (error) {
            console.error('Error adding role:', error);
            return null;
        }
    }
}
