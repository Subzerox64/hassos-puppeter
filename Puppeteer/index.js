import puppeteer from "puppeteer-extra";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "fs";
import pluginStealth from "puppeteer-extra-plugin-stealth";

puppeteer.use(pluginStealth());

// Find path to Chromium
const { stdout: chromiumPath } = await promisify(exec)("which chromium");

// Launch Puppeteer
const browser = await puppeteer.launch({
  headless: false,
  args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
  executablePath: chromiumPath.trim(),
  userDataDir: "./user_data",
  ignoreDefaultArgs: ['--mute-audio'],
});

// Create a new page
const page = await browser.newPage();
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36');
page.setDefaultNavigationTimeout(1900000000000);

// Define file path for cookies
const cookiesFilePath = 'cookies.json';

// Load previous session if cookies file exists
const previousSession = fs.existsSync(cookiesFilePath);
if (previousSession) {
  const cookiesString = fs.readFileSync(cookiesFilePath);
  const parsedCookies = JSON.parse(cookiesString);
  if (parsedCookies.length !== 0) {
    for (let cookie of parsedCookies) {
      await page.setCookie(cookie);
    }
    console.log('Session has been loaded in the browser');
  }
}


// Take a screenshot
await page.screenshot({ path: "screenshot.png" });

// Save session cookies
const cookiesObject = await page.cookies();
fs.writeFile(cookiesFilePath, JSON.stringify(cookiesObject), function(err) { 
  if (err) {
    console.log('The file could not be written.', err);
  } else {
    console.log('Session has been successfully saved');
  }
});

// Close browser
await browser.close();
