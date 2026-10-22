import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  retries: 1,
  use: { browserName: 'chromium' },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
