import { expect, test } from "@playwright/test";

const viewports = [
  { width: 1440, height: 960 },
  { width: 768, height: 960 },
  { width: 375, height: 844 },
];

test("keeps the public pages responsive and the auth pages separate", async ({ page }) => {
  let constellationSource = "";

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(page.getByRole("link", { name: /Nexora/ })).toBeVisible();
    await expect(page.locator(".Navbar")).toBeVisible();
    expect(
      await page.locator("html").evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
  }

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/login");

    await expect(page.locator(".login-page")).toBeVisible();
    await expect(page.getByRole("button", { name: "ดำเนินการต่อด้วย Google" })).toBeVisible();
    await expect(page.getByLabel("อีเมล")).toBeVisible();
    await expect(page.locator("#login-password")).toHaveAttribute("type", "password");
    const illustration = page.locator(".login-brand__illustration");
    const source = await illustration.getAttribute("src");
    expect(source).toContain("community-constellation");
    expect(source).not.toMatch(/^https?:\/\//);
    constellationSource ||= source;
    if (viewport.width <= 767) {
      await expect(illustration).toBeHidden();
    } else {
      await expect(illustration).toBeVisible();
    }
    expect(
      await page.locator("html").evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
  }

  await page.getByRole("button", { name: "แสดงรหัสผ่าน" }).click();
  await expect(page.locator("#login-password")).toHaveAttribute("type", "text");
  await expect(page.locator(".Navbar")).toHaveCount(0);

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/signup");

    await expect(page.locator(".login-page")).toBeVisible();
    await expect(page.getByRole("button", { name: "ดำเนินการต่อด้วย Google" })).toBeVisible();
    await expect(page.getByLabel("อีเมล")).toBeVisible();
    await expect(page.locator("#signup-password")).toHaveAttribute("type", "password");
    await expect(page.locator("#signup-password-confirmation")).toHaveAttribute("type", "password");
    const illustration = page.locator(".login-brand__illustration");
    await expect(illustration).toHaveAttribute("src", constellationSource);
    if (viewport.width <= 767) {
      await expect(illustration).toBeHidden();
    } else {
      await expect(illustration).toBeVisible();
    }
    expect(
      await page.locator("html").evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
  }

  await page.getByRole("button", { name: "แสดงรหัสผ่านทั้งหมด" }).click();
  await expect(page.locator("#signup-password")).toHaveAttribute("type", "text");
  await expect(page.locator("#signup-password-confirmation")).toHaveAttribute("type", "text");
  await page.locator("#signup-email").fill("demo@nexora.test");
  await page.locator("#signup-password").fill("12345");
  await page.locator("#signup-password-confirmation").fill("12345");
  await page.getByRole("button", { name: "สร้างบัญชี Nexora" }).click();
  await expect(page.getByText("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")).toBeVisible();
  await page.getByRole("link", { name: "เข้าสู่ระบบ" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator(".Navbar")).toHaveCount(0);
});

test("supports search, post, comment, reply, keyboard reactions, and stories", async ({ page }) => {
  const legacyAssetRequests = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.startsWith("/reaction/")) {
      legacyAssetRequests.push(request.url());
    }
  });

  await page.goto("/");

  const composer = page.locator(".Post__field");
  await composer.fill("Automated Nexora post");
  await composer.press("Enter");

  const post = page.locator(".Post").filter({ hasText: "Automated Nexora post" });
  await expect(post).toHaveCount(1);
  await expect(post.locator(".reaction-picker img")).toHaveCount(0);

  const postReaction = post.locator(".stats-item--reaction");
  await postReaction.focus();
  await page.keyboard.press("ArrowDown");
  await expect(post.locator(".reaction-picker img")).toHaveCount(7);
  await page.keyboard.press("Escape");
  await expect(post.locator(".reaction-picker img")).toHaveCount(0);

  const search = page.getByRole("searchbox", { name: /ค้นหาบน Nexora/ });
  await search.fill("automated nexora");
  await expect(post).toHaveCount(1);
  await search.fill("ไม่พบข้อมูล");
  await expect(page.locator(".search-empty")).toBeVisible();
  await search.fill("");

  await post.locator(".stats-item--clickable").first().click();
  const dialog = page.getByRole("dialog", { name: /โพสต์ของ/ });
  await expect(dialog).toBeVisible();

  const commentInput = dialog.locator(".modal-comment-input input");
  await commentInput.fill("Automated comment");
  await commentInput.press("Enter");
  await expect(dialog.getByText("Automated comment")).toBeVisible();

  const commentReaction = dialog.locator(".comment-action-btn").filter({ hasText: "ถูกใจ" }).first();
  await commentReaction.focus();
  await page.keyboard.press("ArrowDown");
  const commentPicker = dialog.getByRole("group", { name: "เลือกความรู้สึก" });
  await expect(commentPicker).toBeVisible();
  await expect(commentPicker.getByRole("button", { name: "ถูกใจ" }).first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(commentPicker).toHaveCount(0);
  await expect(commentReaction).toBeFocused();

  await dialog.getByRole("button", { name: "ตอบกลับ" }).first().click();
  const replyInput = dialog.locator(".reply-input");
  await replyInput.fill("Automated reply");
  await replyInput.press("Enter");
  await expect(dialog.getByText("Automated reply")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);

  await page.locator(".story-card--create").click();
  const storyCreator = page.getByRole("dialog", { name: "สตอรี่ของคุณ" });
  await expect(storyCreator).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(storyCreator).toHaveCount(0);

  await page.locator(".story-card").nth(1).click();
  const storyViewer = page.getByRole("dialog", { name: /สตอรี่ของ/ });
  await expect(storyViewer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(storyViewer).toHaveCount(0);

  expect(legacyAssetRequests).toEqual([]);
});
