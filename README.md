# Playwright-master Test Automation

This repository contains an end-to-end (E2E) testing framework built using [Playwright](https://playwright.dev/) and TypeScript. It utilizes a robust Page Object Model (POM) architecture, separating element locators from page actions, and manages test data through fixtures and environment variables.

## Framework Choice & Rationale
- **Playwright + TypeScript**:
  - Playwright provides fast, reliable, auto-waiting browser automation with rich debugging (traces, screenshots, videos).
  - TypeScript is widely adopted in QA teams, with excellent plugin ecosystems and simple, expressive test syntax.
  - The stack is well-suited for parallel execution and CI environments.
- **Alternatives considered**:
  - **Selenium**: very mature and flexible, but more verbose and requires more manual wait handling.
  - **Cypress**: great Developer Experience for JS ecosystems, but focused on Chrome-family browsers and JavaScript

Considering robust architecture, flakiness handling,  CI integration : Playwright + TypeScript strikes the best balance between reliability, speed, and readability.

## Project Structure

- **`e2e/tests/`**: Contains the test spec files (e.g., `login.spec.ts`).
- **`e2e/support/pages/`**: Contains the Page Object classes that encapsulate page-specific actions.
- **`e2e/support/elements/`**: Contains classes that strictly hold Playwright locators for the corresponding pages.
- **`e2e/support/fixtures/`**: Contains JSON and YAML files for test data and configuration (e.g., `loginData.json`, `config.yml`).
- **`.env`**: (Not committed) Stores sensitive credentials used during tests.

## Getting Started
### 1. Clone the repository
```sh
git clone <repo-url>
cd Playwright-master
```

### 2. Install dependencies
```sh
pip install -r requirements.txt  # or use Poetry
# If using Poetry:
poetry install
```

### 3. Install Playwright browsers
```sh
pip install .[dev]
playwright install
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```
3. Create a `.env` file in the root directory and add your credentials:
   ```env
   LOGIN_USERNAME=your_username
   LOGIN_PASSWORD=your_password
   ```

## Test Running Commands

Here are all the various ways you can execute the test suite from your terminal:

### Standard Execution
Run all tests in the default headless mode:
```bash
npm run test
# OR
npx playwright test
```

### Headed Mode
Run tests and visibly open the browsers (useful for observing test execution):
```bash
npm run test:headed
# OR
npx playwright test --headed
```

### UI Mode
Open Playwright's interactive UI mode (highly recommended for debugging, time-traveling, and viewing traces):
```bash
npx playwright test --ui
```

### Run a Specific File
Target a single spec file instead of running the entire suite:
```bash
npx playwright test e2e/tests/login.spec.ts
```

### Run a Specific Test
Run a single test case by passing its title with the `-g` flag:
```bash
npx playwright test -g "successful login"
```

### Debug Mode
Run tests step-by-step using the Playwright Inspector:
```bash
npx playwright test --debug
```

### View Test Report
Playwright automatically generates an HTML report after test runs. To view it, use:
```bash
npx playwright show-report
```

### Run on a Specific Browser (e.g., Chrome)
To run a specific test case only on the Chromium/Chrome browser:
```bash
npx playwright test e2e/tests/quick-invoice-intervention.spec.ts --project=chromium
```

## ☕ Support

If you find this project helpful, you can support my work by buying me a coffee:

<p><a href="https://www.buymeacoffee.com/bariaharshg">
<img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="Buy Me A Coffee" />
</a></p><br><br>