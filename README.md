# chat-puppet

This project is a combination of web scraping, chrome dev tools automation with playwright and chat gpt interaction.

![demo-chat-puppet](/doc/img/demo-chat-puppet.gif)

## Tools & Tech

- Playwright
- Node
- JavaScript
- Chrome browser
- ChatGPT account and home page

## How to execute

```shell
# 1. run your chromium browser with remote debugging port
chrome.exe --no-default-browser-check --remote-debugging-port=9222

# 2. login to ChatGpt
# 3. Choose the chat you want to use or new chat
# 4. run the command with node or a custom wrapper script
node main.js <prompt>
# or pipe to standard in
echo <prompt> | node main.js

```
