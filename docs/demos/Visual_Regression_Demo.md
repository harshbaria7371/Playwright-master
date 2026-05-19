# Visual Regression Testing Demo

This document outlines the visual regression testing capabilities implemented in our Playwright automation suite. It is designed to demonstrate to stakeholders and clients how the framework automatically detects visual anomalies and UI regressions.

## Overview

Visual Regression Testing ensures that the application's user interface appears exactly as expected to the user. Instead of merely checking if an element exists in the DOM, visual testing takes a screenshot of the entire page or specific components and compares it pixel-by-pixel against an approved "baseline" image.

If the application introduces an unintended CSS change, layout shift, or missing graphic, the test framework will catch the mismatch and immediately flag the test as a failure.

## How the Demo Script Works

The demonstration script is located at:
**`e2e/tests/visual_regression_sample.spec.ts`**

### Step-by-Step Execution:
1. **Navigate to the Target Page**: The script dynamically loads the application URL from the `config.yml` configuration file.
2. **Wait for Page Stability**: It uses `await page.waitForLoadState('networkidle');` to guarantee that all network requests (images, fonts, dynamic content) have completely finished loading before any screenshots are taken. This prevents flaky tests caused by partial page renders.
3. **Capture and Compare**: The framework captures a snapshot of the page and compares it to the baseline `login-page.png`.

### The Code Reference
```typescript
test('Login Page Visual Comparison', async ({ page }) => {
    await page.goto(`${baseUrl}`);

    // Wait for the page to finish loading completely before taking a screenshot
    await page.waitForLoadState('networkidle');

    // Take a screenshot of the entire page and compare it to a baseline image.
    await expect(page).toHaveScreenshot('login-page.png', {
        maxDiffPixelRatio: 0.05
    });
});
```

## Failing on Mismatches

The key to visual regression testing is its strictness. In Playwright, this is controlled by the `maxDiffPixelRatio`.

* **`maxDiffPixelRatio: 0.05`** allows up to a 5% visual deviation, accommodating minor sub-pixel rendering differences across different browser engines or OS anti-aliasing variations.
* **`maxDiffPixelRatio: 0.00`** requires absolute pixel-perfect matching. Even a single pixel difference will cause the test to fail.

### Demonstration of a Mismatch Failure
To demonstrate this exact behavior to the client, we intentionally set the `maxDiffPixelRatio` to `0.00` and introduced a visual deviation. As expected, the Playwright framework immediately detected the anomaly and failed the test case, proving its reliability in catching visual defects.

You can view the detailed failure report in the attached PDF:
📄 **[Failed Testcase for Visual Comparison Web View.pdf](./Failed%20Testcase%20for%20Visual%20Comparison%20Web%20View.pdf)**

### What the Client Will See in the Report:
When a mismatch occurs, the generated Playwright report will provide a highly intuitive side-by-side comparison:
1. **Actual**: The current state of the application.
2. **Expected**: The approved baseline image.
3. **Diff**: A visually highlighted image mapping exactly where the mismatched pixels are located, allowing developers to instantly identify the UI defect.
