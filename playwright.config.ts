import { defineConfig, devices } from "@playwright/test";

for (const key of ['BASE_URL', 'TEST_USER', 'TEST_PASSWORD', 'LOCKED_USER']) {
  if (!process.env[key]) throw new Error(`Configure ${key} em .env ou no ambiente`);
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  workers: 1,
  timeout: 45000,
  retries: 0,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    testIdAttribute: "data-test",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
