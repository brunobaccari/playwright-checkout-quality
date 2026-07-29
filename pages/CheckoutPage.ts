import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(readonly page: Page) {}

  async login(username = process.env.TEST_USER!) {
    await this.page.goto('/');
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD!);
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
  }

  async addProduct(product: string) {
    await this.page.getByTestId(`add-to-cart-${product}`).click();
    await expect(this.page.getByTestId(`remove-${product}`)).toBeVisible();
  }

  async openCart() {
    await this.page.getByTestId('shopping-cart-link').click();
    await expect(this.page).toHaveURL(/\/cart.html$/);
    await expect(this.page.getByTestId('checkout')).toBeVisible();
  }

  async enterCustomer() {
    await this.page.getByTestId('firstName').fill('Pessoa');
    await this.page.getByTestId('lastName').fill('Teste');
    await this.page.getByTestId('postalCode').fill('00000');
    await this.page.getByTestId('continue').click();
    await expect(this.page).toHaveURL(/\/checkout-step-two.html$/);
  }
}
