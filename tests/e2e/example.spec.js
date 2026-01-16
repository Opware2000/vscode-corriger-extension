"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fixtures_1 = require("../support/fixtures");
fixtures_1.test.describe('Example Test Suite', () => {
    (0, fixtures_1.test)('should load homepage', async ({ page }) => {
        await page.goto('/');
        await (0, fixtures_1.expect)(page).toHaveTitle(/Home/i);
    });
    (0, fixtures_1.test)('should create user and login', async ({ page, userFactory }) => {
        // Create test user
        const user = await userFactory.createUser();
        // Login
        await page.goto('/login');
        await page.fill('[data-testid="email-input"]', user.email);
        await page.fill('[data-testid="password-input"]', user.password);
        await page.click('[data-testid="login-button"]');
        // Assert login success
        await (0, fixtures_1.expect)(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });
});
//# sourceMappingURL=example.spec.js.map