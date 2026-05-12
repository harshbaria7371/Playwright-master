# Playwright Concepts - Detailed Guide

This document covers the core concepts of Playwright, detailing the implementation patterns used in this project and exploring advanced features for future scalability.

---

## 1. Why Playwright?

Playwright is a modern framework for end-to-end testing, developed by Microsoft. It is designed to be fast, reliable, and capable of handling modern web complexities.

- **Speed**: Built on top of the CDP (Chrome DevTools Protocol) and similar protocols for Firefox/WebKit, making it significantly faster than Selenium.
- **Reliability**: Auto-waiting for elements to be actionable before performing actions, reducing "flaky" tests.
- **Cross-Browser**: Supports Chromium (Chrome, Edge), Firefox, and WebKit (Safari) with a single API.
- **Powerful Tooling**: Comes with Codegen (test recording), Trace Viewer (post-mortem debugging), and UI Mode.

---

## 2. Cypress vs. Playwright

| Feature | Playwright | Cypress |
| :--- | :--- | :--- |
| **Language Support** | TypeScript, JavaScript, Python, Java, .NET | JavaScript, TypeScript |
| **Cross-Browser** | Native support for Chromium, Firefox, WebKit | Chromium-based, Firefox (Electron is default) |
| **Execution** | Out-of-process (runs outside the browser) | In-process (runs inside the browser) |
| **Multi-Tab/Window** | Native support for multiple pages/contexts | Limited support |
| **Iframe Support** | Excellent (selectors handle iframes seamlessly) | Complex to handle |
| **Parallelism** | Native worker-based parallelism (Fast) | Requires paid dashboard for CI parallelism |
| **Wait Strategy** | Auto-waiting (Web-First) | Auto-waiting (with specific timeouts) |

**Pros of Playwright**:
- Better handling of multi-page and iframe scenarios.
- Faster execution via worker-based parallelism.
- Smaller footprint (no browser overhead in CI).

**Cons of Playwright**:
- Slightly steeper learning curve for beginners compared to Cypress's fluent API.

---

## 3. Architecture: Browser vs. Browser Context

Playwright uses a hierarchical architecture to isolate tests and maximize performance.

- **Browser**: A single instance of a browser (e.g., Chromium).
- **Browser Context**: An isolated session within the browser. Think of it as an "Incognito window." Each test gets its own context, ensuring zero state leakage (no shared cookies/storage).
- **Page**: A single tab within a Browser Context.

**Project Implementation**:
In our `playwright.config.ts`, we define projects for `chromium`, `firefox`, and `webkit`. Each test run automatically creates a fresh `BrowserContext` for isolation.

---

## 4. Foundations of Interaction

### Locators
Locators are the central piece of Playwright's auto-waiting and retry-ability.

- **Recommended Locators**:
  - `page.getByRole()`: Find by ARIA role (button, link, heading). *Best for accessibility.*
  - `page.getByText()`: Find by visible text.
  - `page.getByLabel()`: Find by form label.
  - `page.getByTestId()`: Find by `data-testid` attribute.

- **Implementation in this Project**:
  We primarily use `page.locator()` with CSS selectors for high precision in complex enterprise UIs (e.g., `#txt_s3AR_Request`).

### The "Recipe" Concept (Chaining)
Chaining allows you to drill down into the DOM starting from a parent container.
```typescript
// Example from PrepareInvoiceElements.ts
this.page.locator('.elementRow').nth(index).locator('td:nth-child(3) input');
```
*Why?* This ensures that if you have a list of identical rows, you only interact with the one at the specific index.

### Actions & Assertions
- **Actions**: `click()`, `fill()`, `press('Enter')`, `hover()`. All these auto-wait for the element to be visible and stable.
- **Web-First Assertions**: `expect(locator).toBeVisible()`, `expect(locator).toHaveValue()`. These automatically retry until the condition is met or the timeout is reached.

---

## 5. Page Object Model (POM) & Dynamic Elements

### Page Object Model
Our project follows a strict POM structure to separate logic from locators:
- `e2e/support/elements/`: Contains locator definitions (e.g., `PrepareInvoiceElements.ts`).
- `e2e/support/pages/`: Contains interaction logic/methods (e.g., `PrepareInvoicePage.ts`).
- `e2e/tests/`: Contains the actual test scenarios.

### Handling Dynamic Elements & Lists
When elements are generated dynamically (like rows in an invoice):
1. **Index-based access**: Use `.nth(index)` to target a specific row.
2. **Count-based loops**: 
   ```typescript
   const count = await locator.count();
   for (let i = 0; i < count; i++) {
       const text = await locator.nth(i).textContent();
   }
   ```
3. **Filtering**: Use `.filter({ hasText: '...' })` to find a specific item in a list without knowing its index.

---

## 6. Reporting

Playwright provides detailed reports out of the box.
- **HTML Reporter**: Generates a self-contained folder (`playwright-report`) with a visual breakdown of all tests.
- **Trace Viewer**: (Implemented in our config on retry) Captures a full "recording" of the test execution, including snapshots, network requests, and console logs.
  - Run `npx playwright show-report` to view.

---

## 7. Advanced Concepts (Implemented & Future)

### Implemented: Asynchronous Polling (`toPass`)
Used in our project to wait for background calculations (like summary totals) to complete.
```typescript
await expect(async () => {
    const summaryInclTax = await prepareInvoicePage.getNumericSummaryInclTax();
    expect(summaryInclTax).toEqual(sumOfTotalAmounts);
}).toPass({ timeout: 10000 });
```

### Implemented: Fixtures & Global Setup
- **Fixtures**: We use JSON files (`support/fixtures/`) to store test data, keeping scripts clean.
- **Login Helper**: Reusable `performLogin` function to handle authentication across multiple tests.

### Future Concepts to Implement:
1. **Network Interception**: Using `page.route()` to mock API responses or verify that the correct data was sent to the server.
2. **Visual Regression Testing**: Using `expect(page).toHaveScreenshot()` to catch UI regressions that functional tests might miss.
3. **Storage State**: Capturing the login state (cookies/local storage) once and reusing it across all tests to skip the login UI, saving minutes of execution time.
4. **CI/CD Integration**: Running tests in GitHub Actions or Azure DevOps with parallel workers.
5. **Component Testing**: Testing individual React/Vue/Angular components in isolation using Playwright's component testing feature.

---
*Created by Antigravity AI Assistant*
