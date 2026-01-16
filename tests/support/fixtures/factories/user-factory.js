"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = void 0;
const faker_1 = require("@faker-js/faker");
class UserFactory {
    createdUsers = [];
    async createUser(overrides = {}) {
        const user = {
            email: faker_1.faker.internet.email(),
            name: faker_1.faker.person.fullName(),
            password: faker_1.faker.internet.password({ length: 12 }),
            ...overrides,
        };
        // API call to create user
        const response = await fetch(`${process.env.API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        const created = await response.json();
        this.createdUsers.push(created.id);
        return created;
    }
    async cleanup() {
        // Delete all created users
        for (const userId of this.createdUsers) {
            await fetch(`${process.env.API_URL}/users/${userId}`, {
                method: 'DELETE',
            });
        }
        this.createdUsers = [];
    }
}
exports.UserFactory = UserFactory;
//# sourceMappingURL=user-factory.js.map