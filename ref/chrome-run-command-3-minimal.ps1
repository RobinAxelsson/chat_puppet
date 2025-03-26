# Minimal Chrome launcher - PowerShell multiline version

Set-Location "C:\Program Files\Google\Chrome\Application"

.\chrome.exe `
    "--remote-debugging-port=9222" `
    "--no-first-run" `
    "--no-default-browser-check" `
    "--disable-popup-blocking" `
    "--disable-background-networking" `
    "--disable-default-apps" `
    "--disable-extensions" `
    "--disable-component-update" `
    "--disable-client-side-phishing-detection" `
    "--disable-renderer-backgrounding" `
    "--disable-backgrounding-occluded-windows" `
    "--disable-background-timer-throttling" `
    "--force-color-profile=srgb" `
    "--window-size=1280,720" `
    "--app=data:text/html," `
    "--no-sandbox"
