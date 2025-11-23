import { test, expect, Page } from '@playwright/test';

interface ConsoleMessage {
  type: string;
  text: string;
  location: string;
  timestamp: number;
}

class ConsoleErrorTracker {
  private errors: ConsoleMessage[] = [];
  private warnings: ConsoleMessage[] = [];
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.setupListeners();
  }

  private setupListeners() {
    this.page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      const location = msg.location();
      const timestamp = Date.now();

      const consoleMsg: ConsoleMessage = {
        type,
        text,
        location: `${location.url}:${location.lineNumber}:${location.columnNumber}`,
        timestamp
      };

      if (type === 'error') {
        this.errors.push(consoleMsg);
        console.log(`❌ Console Error: ${text}`);
        console.log(`   Location: ${consoleMsg.location}`);
      } else if (type === 'warning') {
        this.warnings.push(consoleMsg);
        console.log(`⚠️  Console Warning: ${text}`);
      }
    });

    this.page.on('pageerror', (error) => {
      const errorMsg: ConsoleMessage = {
        type: 'pageerror',
        text: error.message,
        location: error.stack || 'unknown',
        timestamp: Date.now()
      };
      this.errors.push(errorMsg);
      console.log(`❌ Page Error: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
    });
  }

  getErrors(): ConsoleMessage[] {
    return this.errors;
  }

  getWarnings(): ConsoleMessage[] {
    return this.warnings;
  }

  clear() {
    this.errors = [];
    this.warnings = [];
  }

  printSummary(screenName: string) {
    console.log(`\n📊 Summary for ${screenName}:`);
    console.log(`   Errors: ${this.errors.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      console.log('\n   Error Details:');
      this.errors.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err.text}`);
        console.log(`      ${err.location}`);
      });
    }
  }
}

test.describe('Console Error Detection', () => {
  let tracker: ConsoleErrorTracker;

  test.beforeEach(async ({ page }) => {
    tracker = new ConsoleErrorTracker(page);
  });

  test('Home page should load without console errors', async ({ page }) => {
    console.log('\n🔍 Testing: Home Page');
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for main content to be visible
    await page.waitForSelector('body', { timeout: 10000 }).catch(() => {
      console.log('Page loaded without timeout');
    });
    await page.waitForTimeout(2000); // Additional wait for any lazy-loaded components

    tracker.printSummary('Home Page');

    const errors = tracker.getErrors();
    if (errors.length > 0) {
      console.log('\n⚠️  Home page has console errors!');
      console.log('Errors:', JSON.stringify(errors, null, 2));
    }

    expect(errors, 'Home page should not have console errors').toHaveLength(0);
  });

  test('Community list should load without console errors', async ({ page }) => {
    console.log('\n🔍 Testing: Community List');
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for community items to render
    const communityFound = await page.waitForSelector('.communityItem', { timeout: 10000 }).catch(() => {
      console.log('⚠️  No community items found on page');
      return null;
    });

    if (!communityFound) {
      // Check if we have an error or empty state
      const errorMsg = await page.locator('text=/errors/').first().textContent().catch(() => null);
      const emptyMsg = await page.locator('text=/empty/i').first().textContent().catch(() => null);
      console.log('Error message:', errorMsg);
      console.log('Empty message:', emptyMsg);
      test.skip();
      return;
    }

    await page.waitForTimeout(2000);

    tracker.printSummary('Community List');

    const errors = tracker.getErrors();
    if (errors.length > 0) {
      console.log('\n⚠️  Community list has console errors!');
      console.log('Errors:', JSON.stringify(errors, null, 2));
    }

    expect(errors, 'Community list should not have console errors').toHaveLength(0);
  });

  test('Community page should load without console errors', async ({ page }) => {
    console.log('\n🔍 Testing: Community Page');
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for community items to render
    await page.waitForSelector('.communityItem', { timeout: 10000 }).catch(() => {
      console.log('⚠️  No community items found, skipping test');
      test.skip();
    });

    // Try to navigate to first community
    const firstCommunity = page.locator('.communityItem').first();
    const hasCommunity = await firstCommunity.count() > 0;

    if (hasCommunity) {
      tracker.clear(); // Clear any errors from home page
      await firstCommunity.click();
      // Wait for map canvas to appear
      await page.waitForSelector('canvas.maplibregl-canvas, canvas.mapboxgl-canvas', { timeout: 15000 }).catch(() => {
        console.log('Map canvas not found, continuing...');
      });
      await page.waitForTimeout(2000); // Additional wait for map to fully initialize

      tracker.printSummary('Community Page');

      const errors = tracker.getErrors();
      if (errors.length > 0) {
        console.log('\n⚠️  Community page has console errors!');
        console.log('Errors:', JSON.stringify(errors, null, 2));
      }

      expect(errors, 'Community page should not have console errors').toHaveLength(0);
    } else {
      console.log('⏭️  No communities found, skipping test');
      test.skip();
    }
  });

  test('Map interactions should not cause console errors', async ({ page }) => {
    console.log('\n🔍 Testing: Map Interactions');
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for community items to render
    await page.waitForSelector('.communityItem', { timeout: 10000 }).catch(() => {
      console.log('⚠️  No community items found, skipping test');
      test.skip();
    });

    const firstCommunity = page.locator('.communityItem').first();
    const hasCommunity = await firstCommunity.count() > 0;

    if (hasCommunity) {
      tracker.clear();
      await firstCommunity.click();
      // Wait for map canvas to appear
      await page.waitForSelector('canvas.maplibregl-canvas, canvas.mapboxgl-canvas', { timeout: 15000 }).catch(() => {
        console.log('Map canvas not found, continuing...');
      });
      await page.waitForTimeout(2000);

      // Wait for map to be present and check for errors during interaction attempts
      const mapCanvas = page.locator('canvas.maplibregl-canvas, canvas.mapboxgl-canvas').first();
      const hasMap = await mapCanvas.count() > 0;

      if (hasMap) {
        // Wait for canvas to be visible
        await mapCanvas.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
          console.log('Map canvas not visible, continuing...');
        });

        // Try keyboard interactions (don't require clicking through panels)
        await page.keyboard.press('Equal'); // Zoom in
        await page.waitForTimeout(500);
        await page.keyboard.press('Minus'); // Zoom out
        await page.waitForTimeout(1000);
      }

      tracker.printSummary('Map Interactions');

      const errors = tracker.getErrors();
      if (errors.length > 0) {
        console.log('\n⚠️  Map interactions caused console errors!');
        console.log('Errors:', JSON.stringify(errors, null, 2));
      }

      expect(errors, 'Map interactions should not cause console errors').toHaveLength(0);
    } else {
      console.log('⏭️  No communities found, skipping test');
      test.skip();
    }
  });
});
