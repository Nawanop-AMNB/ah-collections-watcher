import puppeteer from "puppeteer";
import UserAgent from "user-agents";

const init = async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setUserAgent(new UserAgent().toString());
  await page.setRequestInterception(true);
  await page.setViewport({
    height: 1080,
    width: 1920,
  });

  return { browser, page };
};

export default { init };
