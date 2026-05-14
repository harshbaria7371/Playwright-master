import { test, expect } from '@playwright/test';

test.describe('API Testing Demo', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('GET Request - Fetch a post', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts/1`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id', 1);
    expect(responseBody).toHaveProperty('title');
  });

  test('POST Request - Create a new post', async ({ request }) => {
    const newPost = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    };
    
    const response = await request.post(`${baseURL}/posts`, {
      data: newPost,
    });
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
    
    const responseBody = await response.json();
    expect(responseBody.title).toBe(newPost.title);
    expect(responseBody.body).toBe(newPost.body);
    expect(responseBody.userId).toBe(newPost.userId);
  });
});
