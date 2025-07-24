# scraper_test.py

import asyncio
import httpx
from bs4 import BeautifulSoup
from readability import Document
from playwright.async_api import async_playwright

async def fetch_page_text(url: str) -> str:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url)
        content = await page.content()
        await browser.close()

    soup = BeautifulSoup(content, "html.parser")

    # Remove obvious junk elements
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()

    text = soup.get_text(separator="\n", strip=True)

    # Optional: clean extra empty lines or duplicates
    lines = [line.strip() for line in text.splitlines()]
    lines = [line for line in lines if line]  # remove blank lines
    return "\n".join(lines)


async def main():
    url = input("Enter a URL to test scraping: ")
    text = await fetch_page_text(url)
    print("\n--- Extracted Text ---\n")
    print(text)

if __name__ == "__main__":
    asyncio.run(main())
