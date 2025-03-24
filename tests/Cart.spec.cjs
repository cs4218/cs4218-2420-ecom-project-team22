import { test, expect } from '@playwright/test';

test('test add 2 items to cart', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByRole('button', { name: 'ADD TO CART' }).nth(1).click();
    await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
    await page.getByRole('link', { name: 'Cart' }).click();
    await expect(page.getByText('You Have 2 items in your cart')).toBeVisible();
});