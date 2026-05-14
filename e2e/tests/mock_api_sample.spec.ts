import { test, expect } from '@playwright/test';

test.describe('Mock API Demo', () => {
  test('Mock an API response', async ({ page }) => {
    // Intercept the network request and fulfill it with mock data
    await page.route('**/api/users', async route => {
      const mockResponse = {
        users: [
          { id: 1, name: 'Alice (Mocked)' },
          { id: 2, name: 'Bob (Mocked)' },
        ],
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    });

    // In a real scenario, you would navigate to your app that makes this API call.
    // For this demo, we will execute a fetch directly in the page context.
    await page.goto('https://example.com');
    
    const responseData = await page.evaluate(async () => {
      const res = await fetch('https://example.com/api/users');
      return await res.json();
    });

    // Assert that the page received the mocked data
    expect(responseData.users).toHaveLength(2);
    expect(responseData.users[0].name).toBe('Alice (Mocked)');
  });
});
