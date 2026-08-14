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

test('remove um produto sem remover o outro e mantém o carrinho ao recarregar', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  await checkout.login();
  await checkout.addProduct('sauce-labs-backpack');
  await checkout.addProduct('sauce-labs-bike-light');
  await checkout.openCart();
  await page.getByTestId('remove-sauce-labs-bike-light').click();
  await page.reload();
  await expect(page.getByTestId('inventory-item')).toHaveCount(1);
  await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
});

test('dados obrigatórios impedem continuar até serem preenchidos', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  await checkout.login();
  await checkout.addProduct('sauce-labs-backpack');
  await checkout.openCart();
  await page.getByTestId('checkout').click();
  await page.getByTestId('continue').click();
  await expect(page.getByTestId('error')).toHaveText('Error: First Name is required');
  await page.getByTestId('firstName').fill('Pessoa');
  await page.getByTestId('continue').click();
  await expect(page.getByTestId('error')).toHaveText('Error: Last Name is required');
  await page.getByTestId('lastName').fill('Teste');
  await page.getByTestId('continue').click();
  await expect(page.getByTestId('error')).toHaveText('Error: Postal Code is required');
  await expect(page).toHaveURL(/\/checkout-step-one.html$/);
  await checkout.enterCustomer();
});

test('cancelar a revisão retorna ao catálogo e mantém o produto', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  await checkout.login();
  await checkout.addProduct('sauce-labs-backpack');
  await checkout.openCart();
  await page.getByTestId('checkout').click();
  await checkout.enterCustomer();
  await page.getByTestId('cancel').click();
  await expect(page).toHaveURL(/\/inventory.html$/);
  await checkout.openCart();
  await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
});

