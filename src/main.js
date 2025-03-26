const { chromium } = require('playwright');

// The browser needs to run with the following command:
// cmd.exe "%PROGRAMFILES%\Google\Chrome\Application\chrome.exe" --no-default-browser-check --remote-debugging-port=9222
// The chat needs to be initialized manually in the browser, logged in and all that

(async () => {
    var prompt = await getValidPromptFromInput();
    // var prompt = "What is the meaning of life?";
    const { page, browser } = await connectToChatGpt();
    await promptChatGpt(page, prompt);
    await browser.close();

    // Helper functions //
    async function getValidPromptFromInput() {
        const args = process.argv.slice(2); // skip "node" and filename

        const showHelp = args.includes('--help') || args.includes('-h');
        const hasPromptArg = args.length > 0;
        const isPiped = !process.stdin.isTTY;

        if (showHelp || (!hasPromptArg && !isPiped)) {
            console.log(`
                Usage:
                  chat "Your prompt here"
                  echo "Prompt via stdin" | chat
                
                Options:
                  -h, --help    Show this help message
                `);
            process.exit(0);
        }

        if (hasPromptArg) {
            return args.join(' ');
        }

        process.stdin.setEncoding('utf8');
        let input = '';
        for await (const chunk of process.stdin) {
            input += chunk;
        }

        if (!input.trim()) {
            throw new Error('No input provided via stdin.');
        }

        return input.trim();
    }

    async function connectToChatGpt() {
        const browser = await chromium.connectOverCDP('http://localhost:9222');

        const context = browser.contexts()[0];
        if (!context) throw new Error('No existing browser context found.');

        const pages = context.pages();
        if (pages.length === 0) throw new Error('No pages found in existing context.');

        const page = pages.find(p => p.url().includes('https://chatgpt.com'));
        if (!page) throw new Error('No ChatGPT page found.');
        return { page, browser };
    }

    async function promptChatGpt(page, prompt) {
        await page.waitForTimeout(1000);
        // count the old prompts before sending the new prompt
        const initialChatElementCount = await page.locator('div[data-message-author-role="assistant"]').count();

        if (typeof initialChatElementCount !== 'number' || isNaN(initialChatElementCount)) {
            throw new Error('Ther should be a number here.');
        }

        // type the new prompt in the input field (of the current chat session)
        const promptDiv = await page.locator('#prompt-textarea');
        await promptDiv.click();
        await page.keyboard.type(prompt, { delay: 50 });
        await page.keyboard.press('Enter');

        // Wait for a new assistant element to appear
        let currentChatElements = null;
        let currentChatElementCount = 0;
        while (true) {
            await page.waitForTimeout(500);
            currentChatElements = page.locator('div[data-message-author-role="assistant"]');

            currentChatElementCount = await currentChatElements.count();

            if (currentChatElementCount < 1)
                throw new Error('No assistants found.');

            if (currentChatElementCount > initialChatElementCount) break;
        }

        if (currentChatElements === null)
            throw new Error('No assistant elements found.');

        const newAssistantElement = currentChatElements.nth(currentChatElementCount - 1);

        if (!newAssistantElement)
            throw new Error('No assistant element found.');

        // Wait for some inner text to appear in the assistant element
        let chatResponse = '';
        while (true) {
            chatResponse = await newAssistantElement.innerText();
            if (chatResponse.length > 10) break;
            await page.waitForTimeout(1000);
        }

        if (chatResponse.length === 0)
            throw new Error('No text found in assistant element.');

        let totalLength = 0;
        let index = 0;
        const maxRetrys = 5;
        let retries = 0;

        while (true) {
            // If the response is fully printed, break the loop but allow retries
            if (totalLength === chatResponse.length) {
                if (retries === maxRetrys) {
                    process.stdout.write('\n\n');
                    break;
                }
                retries++;
                await page.waitForTimeout(1000);
            }
            else {
                retries = 0;
            }

            totalLength = chatResponse.length;

            for (let i = index; i < totalLength; i++) {
                process.stdout.write(chatResponse[i]);
                await page.waitForTimeout(5);
            }

            index = totalLength;
            chatResponse = await newAssistantElement.innerText();
        }
    }
})();

