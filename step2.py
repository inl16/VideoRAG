from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def process_redirect_url(driver, redirect_url, file_handle):
    def execute_js_for_transcripts():
        js_function = """
        function expandElementRecursively(element, transcripts) {
            if (element.children.length > 0) {
                for (let i = 0; i < element.children.length; i++) {
                    expandElementRecursively(element.children[i], transcripts);
                }
            }
            if (element.tagName.toLowerCase() === 'details') {
                element.open = true;
            }
            if (element.classList.contains('TranscriptCue_lazy_module_cueListItem__1137d3b4')) {
                const timestamp = element.querySelector('.TranscriptCue_lazy_module_timestamp__1137d3b4')?.innerText;
                const transcript = element.querySelector('.TranscriptCue_lazy_module_cueText__1137d3b4')?.innerText;
                if (timestamp && transcript) {
                    transcripts.push({ timestamp, transcript });
                }
            }
        }

        async function scrollAndExpand(itemContainerSelector, startTime) {
            const container = document.querySelector(itemContainerSelector);
            if (!container) {
                console.error('Container not found');
                return;
            }

            let previousScrollTop = -1;
            let currentScrollTop = 0;
            const transcripts = [];

            while (new Date().getTime() - startTime < 20000) {  // Run for 20 seconds
                previousScrollTop = currentScrollTop;

                const elementsInView = container.querySelectorAll('*');
                elementsInView.forEach(element => {
                    expandElementRecursively(element, transcripts);
                });

                await new Promise(resolve => setTimeout(resolve, 300));

                container.scrollBy(0, 350);
                await new Promise(resolve => setTimeout(resolve, 300));
                currentScrollTop = container.scrollTop;

                if (currentScrollTop === previousScrollTop) {
                    break;
                }
            }

            return { transcripts, currentScrollTop };
        }

        const startTime = new Date().getTime();
        return scrollAndExpand('.TranscriptList_lazy_module_listContainer__7d528c68', startTime);
        """
        return driver.execute_script(js_function)

    try:
        driver.get(redirect_url)
        print(f"Navigated to {redirect_url}")
    except Exception as e:
        print(f"Error navigating to the redirect URL: {e}")
        return

    try:
        video_title = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.styled__ModuleTitle-sc-cgnv0g-1"))
        ).get_attribute("title")
        print(f"Video title extracted: {video_title}")
    except Exception as e:
        print(f"Error extracting the video title: {e}")
        return

    try:
        playback_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[@class='styled__PlaybackButton-sc-bpv3k2-4 hwdfzI']"))
        )
        playback_button.click()
        print("Playback button clicked.")
    except Exception as e:
        print(f"Error clicking the playback button: {e}")
        return

    time.sleep(1.5)

    try:
        iframe = WebDriverWait(driver, 4).until(
            EC.presence_of_element_located((By.TAG_NAME, "iframe"))
        )
        driver.switch_to.frame(iframe)
        print("Switched to the iframe.")
    except Exception as e:
        print(f"Error switching to the iframe: {e}")
        return

    try:
        additional_button = WebDriverWait(driver, 2).until(
            EC.element_to_be_clickable((By.ID, "transcript-control-bar-button"))
        )
        additional_button.click()
        print("Additional button clicked.")
    except Exception as e:
        print(f"Error clicking the additional button: {e}")
        return

    time.sleep(4)

    file_handle.write(f"Title: {video_title}\n")
    file_handle.write(f"URL: {redirect_url}\n\n")

    last_scroll_top = 0  # Initialize scroll position
    while True:
        try:
            # Execute JavaScript to collect transcripts for 20 seconds
            result = execute_js_for_transcripts()
            transcripts = result['transcripts']
            new_scroll_top = result['currentScrollTop']

            if not transcripts:
                print("No more transcripts found.")
                break

            for transcript in transcripts:
                file_handle.write(f"{transcript['timestamp']} - {transcript['transcript']}\n")
            print(f"Copied {len(transcripts)} transcripts")

            # Check if we have reached the bottom
            if new_scroll_top == last_scroll_top:
                print("Reached the bottom of the page.")
                break

            # Scroll back to where we left off
            js_scroll_back = f"document.querySelector('.TranscriptList_lazy_module_listContainer__7d528c68').scrollTop = {new_scroll_top - 350};"
            driver.execute_script(js_scroll_back)
            last_scroll_top = new_scroll_top

        except Exception as e:
            print(f"Error executing JavaScript function: {e}")
            break

    file_handle.write(f"\nURL: {redirect_url}\n\n")
    print("Transcripts saved to file")

def open_skool_page_login_and_redirect(url, email, password, redirect_urls):
    driver = webdriver.Safari()

    driver.get(url)

    try:
        login_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//span[text()='Log In']"))
        )
        login_button.click()
        print("Log In button clicked.")
    except Exception as e:
        print(f"Error clicking the Log In button: {e}")
        driver.quit()
        return

    time.sleep(1)

    try:
        email_input = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email_input.send_keys(email)
        print("Email input provided.")
    except Exception as e:
        print(f"Error finding or inputting the email address: {e}")
        driver.quit()
        return

    try:
        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys(password)
        print("Password input provided.")
    except Exception as e:
        print(f"Error finding or inputting the password: {e}")
        driver.quit()
        return

    try:
        submit_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
        )
        submit_button.click()
        print("Log In form submitted.")
    except Exception as e:
        print(f"Error submitting the Log In form: {e}")
        driver.quit()
        return

    time.sleep(6)

    with open('XXXX.txt', 'w') as file_handle:
        for redirect_url in redirect_urls:
            process_redirect_url(driver, redirect_url, file_handle)

    driver.quit()

url = 'https://www.skool.com/growthx'
email = ''
password = ''
redirect_urls = [
    "https://www.skool.com/growthx-academy-6876/classroom/7c50ae1e?md=9d0ae157ef894b9ea059e22f0433ac13",
    "https://www.skool.com/growthx-academy-6876/classroom/7c50ae1e?md=9a10b11136f84376a3980393d3aba06a",
    "https://www.skool.com/growthx-academy-6876/classroom/7c50ae1e?md=b4ab0cd54a93437d8d74f8c495127113",
    "https://www.skool.com/growthx-academy-6876/classroom/7c50ae1e?md=32e20f645bb24c25b265721ce5dd5e81",
    "https://www.skool.com/growthx-academy-6876/classroom/7c50ae1e?md=38f7e08de6d44696a1840638336fd73d",
    "https://www.skool.com/growthx-academy-6876/classroom/7c50ae1e?md=1a2535df39264f97a1178500c3eee88d",
    "https://www.skool.com/growthx-academy-6876/classroom/7c50ae1e?md=30931e6aea6a42a78f4c9eb9ca40248c"



]


# https://www.skool.com/growthx/classroom/7c50ae1e?md=e674dea45a6d457ab801acc740424c44








open_skool_page_login_and_redirect(url, email, password, redirect_urls)
