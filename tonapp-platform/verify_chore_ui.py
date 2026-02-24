from playwright.sync_api import sync_playwright
import os
import sys

def verify_ui():
    url = "http://localhost:3000/chore-manager"
    output_path = os.path.join(os.getcwd(), "chore_manager_verify.png")
    
    with sync_playwright() as p:
        print(f"Opening browser to {url}...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 390, 'height': 844}) # iPhone 12/13/14 size
        
        try:
            page.goto(url)
            print("Waiting for networkidle...")
            page.wait_for_load_state('networkidle')
            
            # Additional wait for any client-side animations
            page.wait_for_timeout(2000)
            
            print(f"Capturing screenshot to {output_path}...")
            page.screenshot(path=output_path, full_page=True)
            print("Screenshot captured successfully.")
            
            # Print page title and some content to stdout for verification
            print(f"Page Title: {page.title()}")
            content = page.inner_text("body")
            print(f"Content Preview: {content[:200]}...")
            
        except Exception as e:
            print(f"Error during verification: {e}")
            sys.exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    verify_ui()
