# SauceDemo checkout — Playwright and TypeScript

[Versão em português](README.md)

Tests against the hosted [SauceDemo](https://www.saucedemo.com/) site, extending the journey in my [Selenium checkout project](https://github.com/brunobaccari/selenium-test-checkout-automation): login, products, cart, customer information and order completion.

## Run

Node.js 22.9 or later, npm and Chromium. CI uses Node 24.

```bash
cp .env.example .env
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

On PowerShell, use `Copy-Item .env.example .env`. On Linux, install browser dependencies with `npx playwright install --with-deps chromium`. No local application needs to be started.

## Scenarios

- Buy a backpack and bike light: verify both items, USD 39.98 subtotal, USD 3.20 tax, USD 43.18 total, confirmation and empty cart.
- Remove one product without losing the other; reload and check persistence.
- Require first name, last name and postal code, then correct the form.
- Cancel the review without losing the cart item.
- Reject the blocked demo account.

`pages/CheckoutPage.ts` holds repeated actions. `tests/checkout.spec.ts` contains expectations. Selectors use the site's `data-test` attributes; waits check rendered state rather than fixed sleeps. There are no automatic test retries.

## Configuration and evidence

URLs and public demo credentials come from `.env`; process variables take precedence. `.env` is ignored by Git. Keep real credentials in CI secrets if adapting this suite, and review the target contract and test data first. Expected business values remain explicit in tests.

`npm run report` opens the HTML report. Failures retain screenshots and traces; JUnit is written to `test-results/junit.xml`. GitHub Actions uploads these artifacts. See [Actions runs and artifacts](https://github.com/brunobaccari/playwright-checkout-quality/actions).

Only public demo accounts and fictitious customer data are used. No real payment, mocks, intercepted responses or local server. Expected prices refer to the catalog reviewed on October 6, 2026; external changes require investigation.


On GitHub, open **Actions → Tests → run → Summary** for the test-step outcome, JUnit counts and evidence download link. Under **Artifacts**, download `test-results` and extract the ZIP to open the reports. The ZIP also includes `summary.md`. Retention is 7 days; upload and summary steps also run after failures. Missing reports are explicitly reported as unverified execution.

## Risks and CI decision

The main risk is completing an order with stale items or totals. The replacement scenario revisits checkout after cancelling review and checks products, prices, subtotal, tax rounding and an empty cart after completion. This verifies the demo contract, not payment settlement.

The gate requires successful tests and readable JUnit, with no failures, skipped cases or empty report. A run without a report does not approve the commit. For a failure, check installation/network first, then the state captured in artifacts and the scenario expectation; changing an expectation requires confirming the target rule. No automatic test retry converts a failure into approval.

Commit dates in this portfolio were reorganized retroactively; Actions runs retain their actual execution dates.
