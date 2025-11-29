# Testing Guide

This project supports multiple test runners for flexibility.

## Running Tests

### Unit Tests (Default - Vitest)
```bash
npm test
```
Runs unit tests using Vitest (Jest-compatible). Tests are located in `src/**/*.test.ts`.

### Unit Tests (Alternative - Bun)
```bash
npm run test:bun
# or directly
bun test src/
```
Faster alternative using Bun's test runner. **Note:** Must specify `src/` directory to avoid E2E test conflicts.

### E2E Tests (Playwright)
```bash
npm run test:e2e
```
Runs end-to-end tests using Playwright. Tests are located in `e2e/**/*.spec.ts`.

#### E2E Test Options
```bash
npm run test:e2e:ui      # Run with Playwright UI
npm run test:e2e:debug   # Run in debug mode
```

## Test Organization

- **Unit Tests**: `src/**/*.test.ts` - Fast unit tests for individual functions and components
- **E2E Tests**: `e2e/**/*.spec.ts` - Browser-based integration tests with Playwright

## Test Runner Compatibility

| Runner | Command | Speed | Notes |
|--------|---------|-------|-------|
| Vitest | `npm test` | ~4s | Default, Jest-compatible |
| Bun | `npm run test:bun` | ~300ms | Faster, requires `src/` path |
| Playwright | `npm run test:e2e` | ~60s | E2E tests only |

⚠️ **Important:** When using Bun directly, always specify `bun test src/` to avoid E2E test conflicts. The E2E tests use Playwright's syntax which is incompatible with Bun's test runner.

## Test Results Summary

- **Unit Tests**: 11 tests pass, 1 skipped (App.test.tsx - covered by E2E)
- **E2E Tests**: 4 tests covering home page, community list, community page, and map interactions
