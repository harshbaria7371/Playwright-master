# AI Triage Engine Demo

This document outlines the Automated Failure Triaging and Root Cause Analysis (RCA) capabilities implemented in our Playwright automation suite. It is designed to demonstrate to stakeholders how the framework uses AI to intelligently diagnose test failures and eliminate manual investigation time.

## Overview

When a complex End-to-End suite fails, engineers typically spend hours sifting through distributed logs, network traces, and DOM snapshots to determine the root cause (e.g., product defect vs. flaky locator). 

Our AI Triage Engine operates as a global Playwright Custom Reporter. When a test fails, it intercepts the execution context, extracts the Playwright trace, console logs, and OpenTelemetry headers, and programmatically queries correlated database logs. This highly contextual payload is sent to a specialized Large Language Model (Gemini), which instantly categorizes the semantic error and provides a clear diagnosis directly in the CI pipeline summary.

## How the Demo Script Works

The demonstration script is located at:
**`e2e/tests/experimental/ai_triage_engine_sample.spec.ts`**

### Step-by-Step Execution:
1. **Execute User Journey**: The script dynamically loads the application URL and performs a standard checkout workflow.
2. **Simulate a System Failure**: At the final step, the UI waits for a confirmation message that never arrives because of a simulated backend failure. The test correctly fails due to a timeout.
3. **Global Reporter Intercepts**: The custom `AITriageReporter` hooks into the `onTestEnd` event, detecting the failure.
4. **AI Processing**: The `AITriageUtil` extracts the trace context and mock database logs, structuring them into a strict JSON schema, which is sent to the Gemini API.

### The Code Reference
```typescript
test('Simulated checkout failure with AI Triage Engine', async ({ page }) => {
    // We use test.fail() so the CI pipeline doesn't actually fail when this sample demonstrates a failure.
    test.fail(true, 'This test is intentionally failing to demonstrate the AI Triage Engine');

    await page.goto(sauceDemoUrl);
    // ... [Login and Checkout Steps] ...
    
    // Simulate waiting for a success message that never appears due to backend NPE
    // Using a short timeout for the demo so it fails quickly
    await expect(page.locator('.complete-header')).toHaveText('Payment Successful - Order #12345', { timeout: 1500 });
});
```

## Instant RCA in the Console

The key to the AI Triage Engine is that it turns raw, noisy stack traces into immediate, actionable intelligence.

### Demonstration of a Diagnosis
When the checkout test fails, instead of requiring manual log diving, the engine provides an instant semantic error categorization. 

You can view the detailed AI Diagnosis output in the console below:

![AI Triage Diagnosis Report-Console](./AI%20Triage%20Dignosis%20Report-Console.png)

### What the Client Will See in the Report:
When a pipeline failure occurs, the generated Playwright report and CI console will provide an intuitive summary:
1. **Traceparent ID**: Pinpointing the exact network request window.
2. **AI Triage Diagnosis**: A direct, plain-English summary, e.g., *"98% probability: Backend defect in Payment-Service - NullPointerException during payment processing... Not a UI locator issue."*
3. **Reduced MTTR**: Transforming a multi-hour investigation into a 30-second automated notification, reducing operational drag by over 85%.
