using Microsoft.Playwright;

namespace chat.puppet.cli;
internal class Program
{
    private static async Task Main(string[] args)
    {
        //var pageUrl = "https://chatgpt.com";
        var pageUrl = "http://127.0.0.1:5500/test-pages/form.html";

        using var playwright = await Playwright.CreateAsync();
        //await using var browser = await playwright.Chromium.LaunchPersistentContextAsync("C:\\Users\\axels\\rax\\chat_puppet\\browser-context", new BrowserTypeLaunchPersistentContextOptions()
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions()
        {
            Headless = false,
        });

        var page = await browser.NewPageAsync();
        await page.Context.ClearCookiesAsync();

        await page.GotoAsync(pageUrl);

        var locator = page.Locator("#testForm", new PageLocatorOptions()
        {
        });
        await locator.ClickAsync();

        //await page.FillAsync("#name", "John Doe");
        //await page.CheckAsync("#subscribe");
        //await page.ClickAsync("#male");

        await browser.CloseAsync();
        //await page.ClickAsync("input[type='submit']");
    }
}
