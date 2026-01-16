# Test Suite Documentation

## Overview

This test suite uses Playwright for end-to-end testing with a focus on reliability, maintainability, and developer experience.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your test environment values
   ```

3. **Install Playwright Browsers**
   ```bash
   npx playwright install
   ```

## Running Tests

### Local Development

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test file
npm run test:e2e -- tests/e2e/user-authentication.spec.ts

# Debug specific test
npm run test:e2e -- tests/e2e/user-authentication.spec.ts --debug

# Run tests in specific browser
npm run test:e2e -- --project=chromium
```

### CI/CD

```bash
# Run with JUnit reporting for CI
npm run test:e2e -- --reporter=junit

# Run with retries for flaky environments
npm run test:e2e -- --retries=3
```

## Architecture Overview

### Directory Structure

```
tests/
├── e2e/                      # End-to-end test files
├── support/                  # Test infrastructure
│   ├── fixtures/             # Test fixtures and data factories
│   │   ├── index.ts          # Main fixture exports
│   │   └── factories/        # Data factories
│   ├── helpers/              # Utility functions
│   └── page-objects/         # Page object models (optional)
└── README.md                 # This documentation
```

### Fixtures Pattern

Tests use Playwright's `test.extend()` pattern for setup/teardown:

```typescript
import { test, expect } from '../support/fixtures';

test('should login user', async ({ page, userFactory }) => {
  // userFactory automatically creates and cleans up test data
  const user = await userFactory.createUser();

  await page.goto('/login');
  // ... test logic
});
```

### Data Factories

Factories generate realistic test data using Faker.js:

```typescript
import { UserFactory } from '../support/fixtures/factories/user-factory';

const factory = new UserFactory();
const user = await factory.createUser({ role: 'admin' });
```

## Best Practices

### Selector Strategy

- Use `data-testid` attributes for reliable element selection
- Avoid CSS selectors that may change with styling updates
- Prefer semantic selectors over fragile XPath

### Test Isolation

- Each test is completely independent
- Fixtures handle setup and cleanup automatically
- No shared state between tests

### Assertions

- Use explicit waits instead of hard delays
- One clear assertion per test
- Descriptive assertion messages

### Test Organization

- Group related tests in `describe` blocks
- Use clear, descriptive test names with priority tags
- Keep test files under 300 lines

## Priority Tagging

Tests are tagged by priority for selective execution:

- **[P0]**: Critical paths, run every commit
- **[P1]**: High priority, run on PR to main
- **[P2]**: Medium priority, run nightly
- **[P3]**: Low priority, run on-demand

```typescript
test('[P0] should login with valid credentials', async ({ page }) => {
  // Critical path test
});

test('[P1] should display error for invalid credentials', async ({ page }) => {
  // Important validation
});
```

## CI Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

### Parallel Execution

Playwright supports parallel test execution:

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : undefined, // Parallel workers
  fullyParallel: true, // Run tests in parallel
});
```

## Debugging

### Visual Debugging

```bash
# Run with browser visible
npm run test:e2e -- --headed

# Run in debug mode
npm run test:e2e -- --debug

# Generate trace files
npm run test:e2e -- --trace on
```

### Trace Viewer

```bash
# View traces after test run
npx playwright show-trace test-results/trace.zip
```

## Common Issues

### Flaky Tests

- Use explicit waits instead of `waitForTimeout`
- Avoid conditional logic in tests
- Ensure test data is unique per test run

### Slow Tests

- Use `fullyParallel: true` for faster execution
- Optimize selectors for better performance
- Mock external services when possible

### Element Not Found

- Verify `data-testid` attributes are present
- Check if elements load asynchronously
- Use `waitFor` utilities for dynamic content

## Knowledge Base References

- [Fixture Architecture](_bmad/bmm/testarch/knowledge/fixture-architecture.md)
- [Data Factories](_bmad/bmm/testarch/knowledge/data-factories.md)
- [Network-First Testing](_bmad/bmm/testarch/knowledge/network-first.md)
- [Test Quality Principles](_bmad/bmm/testarch/knowledge/test-quality.md)