import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';

test('conclui a compra de dois produtos e confere subtotal, taxa e total', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  await checkout.login();
  await checkout.addProduct('sauce-labs-backpack');
  await checkout.addProduct('sauce-labs-bike-light');
  await checkout.openCart();
  await expect(page.getByTestId('inventory-item')).toHaveCount(2);
  await expect(page.getByTestId('inventory-item-name')).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
  await page.getByTestId('checkout').click();
  await checkout.enterCustomer();
  await expect(page.getByTestId('subtotal-label')).toHaveText('Item total: $39.98');
  await expect(page.getByTestId('tax-label')).toHaveText('Tax: $3.20');
  await expect(page.getByTestId('total-label')).toHaveText('Total: $43.18');
  await page.getByTestId('finish').click();
  await expect(page).toHaveURL(/\/checkout-complete.html$/);
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
});

