import asyncio
from playwright.async_api import async_playwright, Page
from app.scraper.exporter import ChatExporter
from app.models.conversation import Conversation
from typing import List

class BrowserScraper:
    def __init__(self, platform: str, headless: bool = False):
        self.platform = platform
        self.headless = headless # FORCE False usually better for manual interaction
        self.base_url = "https://chatgpt.com" if platform == "chatgpt" else "https://claude.ai"

    async def scroll_to_top(self, page: Page):
        """Scrolls up to load history."""
        print("  Wait... Scrolling to load history...")
        previous_height = await page.evaluate("document.body.scrollHeight")
        
        # Try scrolling up 3 times max for this manual version to save time
        for _ in range(3):
            await page.mouse.wheel(0, -5000)
            await asyncio.sleep(1)
            new_height = await page.evaluate("document.body.scrollHeight")
            if new_height == previous_height:
                break
            previous_height = new_height

    async def extract_current_conversation(self) -> Conversation:
        """
        Launches browser, waits for USER to navigate, then extracts.
        """
        async with async_playwright() as p:
            # Persistent context saves your login cookies
            print(f"Launching browser ({'Headless' if self.headless else 'Visible'})...")
            browser = await p.chromium.launch_persistent_context(
                user_data_dir="./user_data",
                headless=self.headless,
                args=["--disable-blink-features=AutomationControlled"]
            )
            
            page = await browser.new_page()
            
            print(f"Navigating to {self.base_url}...")
            await page.goto(self.base_url)

            # --- THE MANUAL INTERVENTION BLOCK ---
            print("\n" + "="*60)
            print(f"👉 ACTION REQUIRED: ")
            print(f"1. Login to {self.platform} (if not already logged in)")
            print(f"2. Click/Open the specific conversation you want to scrape")
            print(f"3. Ensure the chat is visible")
            print(f"4. Press ENTER here when ready...")
            print("="*60 + "\n")
            input() 
            # -------------------------------------

            print("Starting extraction...")
            
            # Ensure main content is loaded
            try:
                await page.wait_for_selector("main", timeout=5000)
            except:
                print("Warning: <main> tag not found. Continuing anyway...")

            # Scroll to capture full history
            await self.scroll_to_top(page)

            # Snapshot
            html = await page.content()
            url = page.url
            print(f"Captured DOM from: {url}")

            conversation = ChatExporter.parse_html(
                html_content=html,
                platform=self.platform,
                url=url
            )

            print("Closing browser...")
            await browser.close()
            return conversation