# chat_puppet

## Playwright API

```csharp
//Chaining & Scoping - recommended
var form = page.Locator("form");
await form.Locator("input[type='text']").FillAsync("Name");
await form.Locator("button:has-text('Submit')").ClickAsync();

//css selectors - recommended
await page.ClickAsync("button");
await page.FillAsync("input[name='email']", "you@example.com");
await page.CheckAsync("input[type='checkbox']");
await page.ClickAsync("form > div > button.submit");


await page.Locator("section:has(h2:has-text('Details')) input").FillAsync("Details...");

//pseudo-classes
await page.ClickAsync("ul > li:nth-of-type(2)");
await page.ClickAsync("input:checked");

//visible content
await page.ClickAsync("text=Submit");
await page.ClickAsync("text='I agree'");
await page.ClickAsync("button:has-text('Save')"); //has text gives case sensitive

//Semantic roles, great for accessibility testing
await page.GetByRole(AriaRole.Button, new() { Name = "Submit" }).ClickAsync();
await page.GetByRole(AriaRole.Checkbox, new() { Name = "Subscribe" }).CheckAsync();

//XPath selectors - avoid
await page.ClickAsync("//button[text()='Submit']");
await page.FillAsync("//input[@name='email']", "x@example.com");

//Advanced combinators
await page.ClickAsync("div:has(button)"); //:has() – like "parent of something"
await page.ClickAsync("li:has-text('John'):has(button)");
await page.ClickAsync("table tr:nth-of-type(3) td:nth-of-type(2)");

//other
page.GetByLabel("Email");
page.GetByPlaceholder("Enter your name");
page.GetByText("Submit");
page.GetByTitle("Close");
page.GetByAltText("Logo");
```
