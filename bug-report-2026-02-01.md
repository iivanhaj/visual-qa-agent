# Bug Detection Report

**URL:** https://labs.google.com/search?source=hp
**Scan Date:** 2026-02-01T11:19:33.302Z
**Overall Health Score:** 1/100

## 🤖 AI-Powered Executive Summary

### Executive Summary

The webpage at https://labs.google.com/search demonstrates a concerning overall health score of 1 out of 100, primarily driven by deficiencies in performance and SEO, despite achieving perfect scores in functionality, accessibility, and security. The site has a total of 36 identified issues, with three categorized as high priority, indicating significant room for improvement to enhance its visibility and user engagement.

### Top 3 Priorities to Fix
1. **Implement a Meta Description**: Add a relevant and concise meta description to improve search engine results appearance and click-through rates.
2. **Add an H1 Heading**: Include a singular H1 heading to enhance content structure and SEO optimization, which is crucial for both user experience and search engine indexing.
3. **Enhance Performance**: Optimize page load times and overall performance to improve user satisfaction and retention.

### Estimated Impact if Fixed
Addressing these issues could significantly enhance the webpage's SEO score, potentially increasing its visibility in search engine results and driving more organic traffic. The addition of a meta description and H1 heading can improve click-through rates by approximately 20-30%, while performance improvements may lead to better user retention and a decrease in bounce rates, ultimately contributing to higher engagement and conversions.

*Generated using OpenAI GPT-4o-mini*

## Health Score Breakdown

| Category | Score |
|----------|-------|
| Functionality | 100/100 |
| Accessibility | 100/100 |
| Performance | 47/100 |
| SEO | 40/100 |
| Security | 100/100 |

## Summary

- **Total Issues:** 36
- **Critical:** 0
- **High:** 3
- **Medium:** 1
- **Low:** 32
- **Info:** 0

## ⚠️ High Priority Issues

### 1. Missing Meta Description

**Type:** seo | **Severity:** HIGH

**Description:** No meta description found. This affects how your page appears in search results.

**Location:** `<head>`

**How to Fix:**

Add a meta description tag in the `<head>` section of your HTML. This should be a concise summary of the page content, ideally between 150-160 characters. Example: `<meta name="description" content="Your summary here." />`

**Code Example:**

Before:
```html
<head>
  <title>Page Title</title>
```

After:
```html
<head>
  <title>Page Title</title>
  <meta name="description" content="A compelling description of your page content.">
```

**Resources:**
- https://moz.com/learn/seo/meta-description
- ✨ AI-Enhanced Fix

---

### 2. Missing H1 Heading

**Type:** seo | **Severity:** HIGH

**Description:** No H1 heading found on the page. Every page should have exactly one H1.

**Location:** `body`

**How to Fix:**

Include a single H1 heading within the `<body>` of your webpage. This should clearly describe the main topic of the page, using relevant keywords. Example: `<h1>Main Topic of the Page</h1>`

**Code Example:**

Before:
```html
<body>
  <h2>Some content</h2>
```

After:
```html
<body>
  <h1>Main Page Heading</h1>
  <h2>Some content</h2>
```

**Resources:**
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements
- ✨ AI-Enhanced Fix

---

### 3. Render-Blocking JavaScript in Head

**Type:** performance | **Severity:** HIGH

**Description:** Found 11 synchronous scripts in <head> that block rendering.

**Location:** `<head>`

**How to Fix:**

Move the render-blocking JavaScript files to the bottom of the `<body>` section or use the `defer` attribute in the `<script>` tags to ensure they load after the page content. This will improve page load speed and enhance user experience. Example: `<script src="script.js" defer></script>`

**Code Example:**

Before:
```html
<script src="script.js"></script>
```

After:
```html
<script src="script.js" defer></script>
```

**Resources:**
- https://web.dev/efficiently-load-third-party-javascript/
- ✨ AI-Enhanced Fix

---

## 📋 Medium Priority Issues

### 1. Images Not Using Lazy Loading

**Type:** performance | **Severity:** MEDIUM

**Description:** 7 below-the-fold images are not using lazy loading.

**Location:** `body`

**How to Fix:**

Add loading="lazy" attribute to images that appear below the fold.

**Code Example:**

Before:
```html
<img src="image.jpg" alt="...">
```

After:
```html
<img src="image.jpg" alt="..." loading="lazy">
```

**Resources:**
- https://web.dev/lazy-loading/

---

## ℹ️ Low Priority Issues

### 1. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.aM0mz.JObZef > div.Oa5HGc > div.Hgpnmd > button.IfuKke.ZkFQ1d`

<details>
<summary>View Element</summary>

```html
<button class="IfuKke  ZkFQ1d" aria-label="Turn on AI Mode" jsaction="click:sSBPhc" jslog="226495; track:click,impression; metadata:W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsWyIyMiIsIk1lZXQlMjBBSSUyME1vZGUlM0ElMjBhJTIwd2hvbGUlMjBuZXclMjB3YXklMjB0byUyMHNlYXJjaCIsIklOX0FQUF9OQVZJR0FUSU9OX0NPTU1BTkQiLCIvc2VhcmNoL2V4cGVyaW1lbnQvMjI_YWU9dHJ1ZSZlZXA9aGVwciJdXQ==;">Turn on</button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 2. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO.szcgid > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.TSG6H.Fdr9De > div.VfPpkd-dgl2Hf-ppHlrf-sM5MNb > button.AeBiU-LgbsSe.AeBiU-LgbsSe-OWXEXe-Bz112c-M1Soyc`

<details>
<summary>View Element</summary>

```html
<button class="AeBiU-LgbsSe AeBiU-LgbsSe-OWXEXe-Bz112c-M1Soyc AeBiU-LgbsSe-OWXEXe-dgl2Hf AeBiU-kSE8rc-FoKg4d-sLO9V-YoZ4jf undefined dPlSnc PbjrJ PrAS0b FB7LUb" jscontroller="O626Fe" jsaction="click:h5M12e;clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox; focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="undefined dPlSnc PbjrJ PrAS0b FB7LUb" jsname="rhHFf" aria-label="Feedback for AI Mode" jslog="179258; track:click; metadata:W1siMjIiXV0="><span class="XjoK4b"></span><span class="UTNHae" jscontroller="LBaJxb" jsname="m9ZlFb"></span><span class="AeBiU-RLmnJb"></span><span class="AeBiU-kBDsod-Rtc0Jf AeBiU-kBDsod-Rtc0Jf-OWXEXe-M1Soyc" jsname="Xr1QTb"><i class="google-material-icons notranslate VfPpkd-kBDsod google-symbols" aria-hidden="true">rate_review</i></span><span jsname="V67aGc" class="AeBiU-vQzf8d" aria-hidden="true">Feedback</span><span class="AeBiU-kBDsod-Rtc0Jf AeBiU-kBDsod-Rtc0Jf-OWXEXe-UbuQg" jsname="UkTUqb"></span></button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 3. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO.szcgid > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.TSG6H.Fdr9De > div.CNMj4c > button.hXXdee.kPTQic`

<details>
<summary>View Element</summary>

```html
<button class="hXXdee kPTQic" aria-label="Turn on AI Mode" jsname="LgbsSe" jsaction="animationend:hdXq8d(kgzUNd)"><div class="EOYSYc" jsname="kgzUNd"><div class="wKKiqd"></div></div><div class="Tm5o9e"><div class="M0FLac" jsname="V67aGc">Turn on</div></div></button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 4. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO.szcgid > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.TSG6H.Fdr9De > div.VfPpkd-dgl2Hf-ppHlrf-sM5MNb > button.AeBiU-LgbsSe.AeBiU-LgbsSe-OWXEXe-Bz112c-M1Soyc`

<details>
<summary>View Element</summary>

```html
<button class="AeBiU-LgbsSe AeBiU-LgbsSe-OWXEXe-Bz112c-M1Soyc AeBiU-LgbsSe-OWXEXe-dgl2Hf AeBiU-kSE8rc-FoKg4d-sLO9V-YoZ4jf undefined dPlSnc PbjrJ PrAS0b FB7LUb" jscontroller="O626Fe" jsaction="click:h5M12e;clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox; focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="undefined dPlSnc PbjrJ PrAS0b FB7LUb" jsname="rhHFf" aria-label="Feedback for Google app for Windows" jslog="179258; track:click; metadata:W1siNDAiXV0="><span class="XjoK4b"></span><span class="UTNHae" jscontroller="LBaJxb" jsname="m9ZlFb"></span><span class="AeBiU-RLmnJb"></span><span class="AeBiU-kBDsod-Rtc0Jf AeBiU-kBDsod-Rtc0Jf-OWXEXe-M1Soyc" jsname="Xr1QTb"><i class="google-material-icons notranslate VfPpkd-kBDsod google-symbols" aria-hidden="true">rate_review</i></span><span jsname="V67aGc" class="AeBiU-vQzf8d" aria-hidden="true">Feedback</span><span class="AeBiU-kBDsod-Rtc0Jf AeBiU-kBDsod-Rtc0Jf-OWXEXe-UbuQg" jsname="UkTUqb"></span></button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 5. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO.szcgid > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.TSG6H.Fdr9De > div.CNMj4c > button.hXXdee.kPTQic`

<details>
<summary>View Element</summary>

```html
<button class="hXXdee kPTQic" aria-label="Download the Google app for Windows" jsname="LgbsSe" jsaction="animationend:hdXq8d(kgzUNd)" role="link"><div class="EOYSYc" jsname="kgzUNd"><div class="wKKiqd"></div></div><div class="Tm5o9e"><div class="M0FLac" jsname="V67aGc">Download app</div></div></button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 6. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.TSG6H.Fdr9De > div.VfPpkd-dgl2Hf-ppHlrf-sM5MNb > button.AeBiU-LgbsSe.AeBiU-LgbsSe-OWXEXe-Bz112c-M1Soyc`

<details>
<summary>View Element</summary>

```html
<button class="AeBiU-LgbsSe AeBiU-LgbsSe-OWXEXe-Bz112c-M1Soyc AeBiU-LgbsSe-OWXEXe-dgl2Hf AeBiU-kSE8rc-FoKg4d-sLO9V-YoZ4jf undefined dPlSnc PbjrJ PrAS0b FB7LUb" jscontroller="O626Fe" jsaction="click:h5M12e;clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox; focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="undefined dPlSnc PbjrJ PrAS0b FB7LUb" jsname="rhHFf" aria-label="Feedback for NotebookLM" jslog="179258; track:click; metadata:W1siMjMiXV0="><span class="XjoK4b"></span><span class="UTNHae" jscontroller="LBaJxb" jsname="m9ZlFb"></span><span class="AeBiU-RLmnJb"></span><span class="AeBiU-kBDsod-Rtc0Jf AeBiU-kBDsod-Rtc0Jf-OWXEXe-M1Soyc" jsname="Xr1QTb"><i class="google-material-icons notranslate VfPpkd-kBDsod google-symbols" aria-hidden="true">rate_review</i></span><span jsname="V67aGc" class="AeBiU-vQzf8d" aria-hidden="true">Feedback</span><span class="AeBiU-kBDsod-Rtc0Jf AeBiU-kBDsod-Rtc0Jf-OWXEXe-UbuQg" jsname="UkTUqb"></span></button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 7. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.TSG6H.Fdr9De > div.CNMj4c > button.hXXdee.kPTQic`

<details>
<summary>View Element</summary>

```html
<button class="hXXdee kPTQic" aria-label="Try now" jsname="LgbsSe" jsaction="animationend:hdXq8d(kgzUNd)" role="link"><div class="EOYSYc" jsname="kgzUNd"><div class="wKKiqd"></div></div><div class="Tm5o9e"><div class="M0FLac" jsname="V67aGc">Try now</div></div></button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 8. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.TSG6H.Fdr9De > div.VfPpkd-dgl2Hf-ppHlrf-sM5MNb > button.AeBiU-LgbsSe.AeBiU-LgbsSe-OWXEXe-Bz112c-M1Soyc`

<details>
<summary>View Element</summary>

```html
<button class="AeBiU-LgbsSe AeBiU-LgbsSe-OWXEXe-Bz112c-M1Soyc AeBiU-LgbsSe-OWXEXe-dgl2Hf AeBiU-kSE8rc-FoKg4d-sLO9V-YoZ4jf undefined dPlSnc PbjrJ PrAS0b FB7LUb" jscontroller="O626Fe" jsaction="click:h5M12e;clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox; focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="undefined dPlSnc PbjrJ PrAS0b FB7LUb" jsname="rhHFf" aria-label="Feedback for Viola the Bird" jslog="179258; track:click; metadata:W1siMTMiXV0="><span class="XjoK4b"></span><span class="UTNHae" jscontroller="LBaJxb" jsname="m9ZlFb"></span><span class="AeBiU-RLmnJb"></span><span class="AeBiU-kBDsod-Rtc0Jf AeBiU-kBDsod-Rtc0Jf-OWXEXe-M1Soyc" jsname="Xr1QTb"><i class="google-material-icons notranslate VfPpkd-kBDsod google-symbols" aria-hidden="true">rate_review</i></span><span jsname="V67aGc" class="AeBiU-vQzf8d" aria-hidden="true">Feedback</span><span class="AeBiU-kBDsod-Rtc0Jf AeBiU-kBDsod-Rtc0Jf-OWXEXe-UbuQg" jsname="UkTUqb"></span></button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 9. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.TSG6H.Fdr9De > div.CNMj4c > button.hXXdee.kPTQic`

<details>
<summary>View Element</summary>

```html
<button class="hXXdee kPTQic" aria-label="Play with Viola the Bird" jsname="LgbsSe" jsaction="animationend:hdXq8d(kgzUNd)" role="link"><div class="EOYSYc" jsname="kgzUNd"><div class="wKKiqd"></div></div><div class="Tm5o9e"><div class="M0FLac" jsname="V67aGc">Play</div></div></button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 10. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.TSG6H.Fdr9De > div.VfPpkd-dgl2Hf-ppHlrf-sM5MNb > button.AeBiU-LgbsSe.AeBiU-LgbsSe-OWXEXe-Bz112c-M1Soyc`

<details>
<summary>View Element</summary>

```html
<button class="AeBiU-LgbsSe AeBiU-LgbsSe-OWXEXe-Bz112c-M1Soyc AeBiU-LgbsSe-OWXEXe-dgl2Hf AeBiU-kSE8rc-FoKg4d-sLO9V-YoZ4jf undefined dPlSnc PbjrJ PrAS0b FB7LUb" jscontroller="O626Fe" jsaction="click:h5M12e;clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox; focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="undefined dPlSnc PbjrJ PrAS0b FB7LUb" jsname="rhHFf" aria-label="Feedback for Hindi Cinema" jslog="179258; track:click; metadata:W1siMTUiXV0="><span class="XjoK4b"></span><span class="UTNHae" jscontroller="LBaJxb" jsname="m9ZlFb"></span><span class="AeBiU-RLmnJb"></span><span class="AeBiU-kBDsod-Rtc0Jf AeBiU-kBDsod-Rtc0Jf-OWXEXe-M1Soyc" jsname="Xr1QTb"><i class="google-material-icons notranslate VfPpkd-kBDsod google-symbols" aria-hidden="true">rate_review</i></span><span jsname="V67aGc" class="AeBiU-vQzf8d" aria-hidden="true">Feedback</span><span class="AeBiU-kBDsod-Rtc0Jf AeBiU-kBDsod-Rtc0Jf-OWXEXe-UbuQg" jsname="UkTUqb"></span></button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 11. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.TSG6H.Fdr9De > div.CNMj4c > button.hXXdee.kPTQic`

<details>
<summary>View Element</summary>

```html
<button class="hXXdee kPTQic" aria-label="Explore Hindi Cinema" jsname="LgbsSe" jsaction="animationend:hdXq8d(kgzUNd)" role="link"><div class="EOYSYc" jsname="kgzUNd"><div class="wKKiqd"></div></div><div class="Tm5o9e"><div class="M0FLac" jsname="V67aGc">Explore</div></div></button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 12. Button Missing Type Attribute

**Type:** best-practice | **Severity:** LOW

**Description:** Button element lacks explicit type attribute (defaults to "submit").

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.DgfZ4e > div.ORsxQb > div.jIFBle > div.VfPpkd-dgl2Hf-ppHlrf-sM5MNb > button.UywwFc-LgbsSe.UywwFc-LgbsSe-OWXEXe-dgl2Hf`

<details>
<summary>View Element</summary>

```html
<button class="UywwFc-LgbsSe UywwFc-LgbsSe-OWXEXe-dgl2Hf UywwFc-StrnGf-YYd4I-VtOx3e UywwFc-kSE8rc-FoKg4d-sLO9V-YoZ4jf undefined jnfNDf EiZ8Dd FB7LUb" jscontroller="O626Fe" jsaction="click:h5M12e;clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox; focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="undefined jnfNDf EiZ8Dd FB7LUb" jsname="AUDZO" aria-label="Get email updates"><span class="XjoK4b"></span><span class="MMvswb"><span class="OLCwg"></span></span><span class="UTNHae" jscontroller="LBaJxb" jsname="m9ZlFb" soy-skip="" ssk="6:RWVI5c"></span><span class="UywwFc-RLmnJb"></span><span class="UywwFc-kBDsod-Rtc0Jf UywwFc-kBDsod-Rtc0Jf-OWXEXe-M1Soyc" jsname="Xr1QTb"></span><span jsname="V67aGc" class="UywwFc-vQzf8d" aria-hidden="true">Get updates</span><span class="UywwFc-kBDsod-Rtc0Jf UywwFc-kBDsod-Rtc0Jf-OWXEXe-UbuQg" jsname="UkTUqb"></span></button>
```
</details>

**How to Fix:**

Add type="button", type="submit", or type="reset" to be explicit.

**Code Example:**

Before:
```html
<button>Click</button>
```

After:
```html
<button type="button">Click</button>
```

---

### 13. Image Has Empty Alt Text

**Type:** seo | **Severity:** LOW

**Description:** Image has empty alt text. Verify if this is truly decorative.

**Location:** `header#gb > div.gb_Kd.gb_Nd > div.gb_2d.gb_wb > div.gb_Cd > div.gb_z.gb_vd > div.gb_D.gb_vb > a.gb_B.gb_0a > span.gb_be > img.gb_Q.gbii`

<details>
<summary>View Element</summary>

```html
<img class="gb_Q gbii" src="https://lh3.google.com/u/0/ogw/AF2bZyiNb5p86e0hwISzbw7UAtkNBBvZ8AcnzJZKVHbX2Ey5WA=s32-c-mo" srcset="https://lh3.google.com/u/0/ogw/AF2bZyiNb5p86e0hwISzbw7UAtkNBBvZ8AcnzJZKVHbX2Ey5WA=s32-c-mo 1x, https://lh3.google.com/u/0/ogw/AF2bZyiNb5p86e0hwISzbw7UAtkNBBvZ8AcnzJZKVHbX2Ey5WA=s64-c-mo 2x " alt="" aria-hidden="true" data-noaft="">
```
</details>

**How to Fix:**

If the image is decorative, consider adding role="presentation". Otherwise, add descriptive alt text.

**Resources:**
- https://www.w3.org/WAI/tutorials/images/decorative/

---

### 14. Image Has Empty Alt Text

**Type:** seo | **Severity:** LOW

**Description:** Image has empty alt text. Verify if this is truly decorative.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.aM0mz.JObZef > section.d5NbRd-gBNGNe.DvBau > img.DvBau`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/2ed7270e-629a-45a3-9da2-a2fe00ad1898.jpg" alt="" class="DvBau">
```
</details>

**How to Fix:**

If the image is decorative, consider adding role="presentation". Otherwise, add descriptive alt text.

**Resources:**
- https://www.w3.org/WAI/tutorials/images/decorative/

---

### 15. Image Has Empty Alt Text

**Type:** seo | **Severity:** LOW

**Description:** Image has empty alt text. Verify if this is truly decorative.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO.szcgid > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.FUuIqe > div.MjDldf > div.SDZEi > img.SDZEi`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/5181e3f5-a5f5-4eb1-a09a-3dce0cb560e0.png" alt="" class="SDZEi">
```
</details>

**How to Fix:**

If the image is decorative, consider adding role="presentation". Otherwise, add descriptive alt text.

**Resources:**
- https://www.w3.org/WAI/tutorials/images/decorative/

---

### 16. Image Has Empty Alt Text

**Type:** seo | **Severity:** LOW

**Description:** Image has empty alt text. Verify if this is truly decorative.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO.szcgid > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.FUuIqe > div.MjDldf > div.SDZEi > img.SDZEi`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/11bbecb4-7a49-41cb-9f02-762ddd745628.png" alt="" class="SDZEi">
```
</details>

**How to Fix:**

If the image is decorative, consider adding role="presentation". Otherwise, add descriptive alt text.

**Resources:**
- https://www.w3.org/WAI/tutorials/images/decorative/

---

### 17. Image Has Empty Alt Text

**Type:** seo | **Severity:** LOW

**Description:** Image has empty alt text. Verify if this is truly decorative.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.FUuIqe > div.MjDldf > div.SDZEi > img.SDZEi`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/a40255f7-6c52-4ea8-bc93-50a9a7dd83de.png" alt="" class="SDZEi">
```
</details>

**How to Fix:**

If the image is decorative, consider adding role="presentation". Otherwise, add descriptive alt text.

**Resources:**
- https://www.w3.org/WAI/tutorials/images/decorative/

---

### 18. Image Has Empty Alt Text

**Type:** seo | **Severity:** LOW

**Description:** Image has empty alt text. Verify if this is truly decorative.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.oGEs5 > section.d5NbRd-gBNGNe.wCKe1d > img.wCKe1d`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/db4f78ea-3bda-4c6b-971d-cfea7e9af409.png" alt="" class="wCKe1d" data-iml="1298.5">
```
</details>

**How to Fix:**

If the image is decorative, consider adding role="presentation". Otherwise, add descriptive alt text.

**Resources:**
- https://www.w3.org/WAI/tutorials/images/decorative/

---

### 19. Image Has Empty Alt Text

**Type:** seo | **Severity:** LOW

**Description:** Image has empty alt text. Verify if this is truly decorative.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.FUuIqe > div.MjDldf > div.SDZEi > img.SDZEi`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/9bbb3ab7-1572-4999-8ea1-2ea42e9d42d8.png" alt="" class="SDZEi">
```
</details>

**How to Fix:**

If the image is decorative, consider adding role="presentation". Otherwise, add descriptive alt text.

**Resources:**
- https://www.w3.org/WAI/tutorials/images/decorative/

---

### 20. Image Has Empty Alt Text

**Type:** seo | **Severity:** LOW

**Description:** Image has empty alt text. Verify if this is truly decorative.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.oGEs5 > section.d5NbRd-gBNGNe.wCKe1d > img.wCKe1d`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/0962464a-34eb-43e9-ad93-f23c28ac37e6.png" alt="" class="wCKe1d" data-iml="1251.800000000745">
```
</details>

**How to Fix:**

If the image is decorative, consider adding role="presentation". Otherwise, add descriptive alt text.

**Resources:**
- https://www.w3.org/WAI/tutorials/images/decorative/

---

### 21. Image Has Empty Alt Text

**Type:** seo | **Severity:** LOW

**Description:** Image has empty alt text. Verify if this is truly decorative.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.FUuIqe > div.MjDldf > div.SDZEi > img.SDZEi`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/9bbb3ab7-1572-4999-8ea1-2ea42e9d42d8.png" alt="" class="SDZEi">
```
</details>

**How to Fix:**

If the image is decorative, consider adding role="presentation". Otherwise, add descriptive alt text.

**Resources:**
- https://www.w3.org/WAI/tutorials/images/decorative/

---

### 22. Missing Open Graph Tags

**Type:** seo | **Severity:** LOW

**Description:** Missing og:title, og:description, og:image, og:url. Open Graph tags improve social media sharing.

**Location:** `<head>`

**How to Fix:**

Add Open Graph meta tags for better social media preview when sharing.

**Code Example:**

Before:
```html
<head>
```

After:
```html
<head>
  <meta property="og:title" content="Your Page Title">
  <meta property="og:description" content="Page description">
  <meta property="og:image" content="https://example.com/image.jpg">
  <meta property="og:url" content="https://example.com/page">
```

**Resources:**
- https://ogp.me/

---

### 23. Image Missing Dimensions

**Type:** performance | **Severity:** LOW

**Description:** Image lacks width/height attributes, which can cause layout shifts.

**Location:** `a#sdgBod > img.gb_0c`

<details>
<summary>View Element</summary>

```html
<img class="gb_0c" src="https://www.gstatic.com/search-labs/beaker/Labs_logo_dark_mode_1x.png" srcset="https://www.gstatic.com/search-labs/beaker/Labs_logo_dark_mode_1x.png 1x, https://www.gstatic.com/search-labs/beaker/Labs_logo_dark_mode_2x.png 2x " alt="" aria-hidden="true" role="presentation" style="width:148px;height:24px" data-atf="true" data-iml="597.3000000007451">
```
</details>

**How to Fix:**

Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS).

**Code Example:**

Before:
```html
<img src="https://www.gstatic.com/search-labs/beaker/Labs_logo_dark_mode_1x.png" alt="...">
```

After:
```html
<img src="https://www.gstatic.com/search-labs/beaker/Labs_logo_dark_mode_1x.png" alt="..." width="800" height="600">
```

**Resources:**
- https://web.dev/cls/

---

### 24. Image Missing Dimensions

**Type:** performance | **Severity:** LOW

**Description:** Image lacks width/height attributes, which can cause layout shifts.

**Location:** `header#gb > div.gb_Kd.gb_Nd > div.gb_2d.gb_wb > div.gb_Cd > div.gb_z.gb_vd > div.gb_D.gb_vb > a.gb_B.gb_0a > span.gb_be > img.gb_Q.gbii`

<details>
<summary>View Element</summary>

```html
<img class="gb_Q gbii" src="https://lh3.google.com/u/0/ogw/AF2bZyiNb5p86e0hwISzbw7UAtkNBBvZ8AcnzJZKVHbX2Ey5WA=s32-c-mo" srcset="https://lh3.google.com/u/0/ogw/AF2bZyiNb5p86e0hwISzbw7UAtkNBBvZ8AcnzJZKVHbX2Ey5WA=s32-c-mo 1x, https://lh3.google.com/u/0/ogw/AF2bZyiNb5p86e0hwISzbw7UAtkNBBvZ8AcnzJZKVHbX2Ey5WA=s64-c-mo 2x " alt="" aria-hidden="true" data-noaft="">
```
</details>

**How to Fix:**

Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS).

**Code Example:**

Before:
```html
<img src="https://lh3.google.com/u/0/ogw/AF2bZyiNb5p86e0hwISzbw7UAtkNBBvZ8AcnzJZKVHbX2Ey5WA=s32-c-mo" alt="...">
```

After:
```html
<img src="https://lh3.google.com/u/0/ogw/AF2bZyiNb5p86e0hwISzbw7UAtkNBBvZ8AcnzJZKVHbX2Ey5WA=s32-c-mo" alt="..." width="800" height="600">
```

**Resources:**
- https://web.dev/cls/

---

### 25. Image Missing Dimensions

**Type:** performance | **Severity:** LOW

**Description:** Image lacks width/height attributes, which can cause layout shifts.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.aM0mz.JObZef > section.d5NbRd-gBNGNe.DvBau > img.DvBau`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/2ed7270e-629a-45a3-9da2-a2fe00ad1898.jpg" alt="" class="DvBau">
```
</details>

**How to Fix:**

Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS).

**Code Example:**

Before:
```html
<img src="https://www.gstatic.com/search-labs/2ed7270e-629a-45a3-9da2-a2fe00ad1898.jpg" alt="...">
```

After:
```html
<img src="https://www.gstatic.com/search-labs/2ed7270e-629a-45a3-9da2-a2fe00ad1898.jpg" alt="..." width="800" height="600">
```

**Resources:**
- https://web.dev/cls/

---

### 26. Image Missing Dimensions

**Type:** performance | **Severity:** LOW

**Description:** Image lacks width/height attributes, which can cause layout shifts.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO.szcgid > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.FUuIqe > div.MjDldf > div.SDZEi > img.SDZEi`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/5181e3f5-a5f5-4eb1-a09a-3dce0cb560e0.png" alt="" class="SDZEi">
```
</details>

**How to Fix:**

Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS).

**Code Example:**

Before:
```html
<img src="https://www.gstatic.com/search-labs/5181e3f5-a5f5-4eb1-a09a-3dce0cb560e0.png" alt="...">
```

After:
```html
<img src="https://www.gstatic.com/search-labs/5181e3f5-a5f5-4eb1-a09a-3dce0cb560e0.png" alt="..." width="800" height="600">
```

**Resources:**
- https://web.dev/cls/

---

### 27. Image Missing Dimensions

**Type:** performance | **Severity:** LOW

**Description:** Image lacks width/height attributes, which can cause layout shifts.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO.szcgid > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.FUuIqe > div.MjDldf > div.SDZEi > img.SDZEi`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/11bbecb4-7a49-41cb-9f02-762ddd745628.png" alt="" class="SDZEi">
```
</details>

**How to Fix:**

Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS).

**Code Example:**

Before:
```html
<img src="https://www.gstatic.com/search-labs/11bbecb4-7a49-41cb-9f02-762ddd745628.png" alt="...">
```

After:
```html
<img src="https://www.gstatic.com/search-labs/11bbecb4-7a49-41cb-9f02-762ddd745628.png" alt="..." width="800" height="600">
```

**Resources:**
- https://web.dev/cls/

---

### 28. Image Missing Dimensions

**Type:** performance | **Severity:** LOW

**Description:** Image lacks width/height attributes, which can cause layout shifts.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.FUuIqe > div.MjDldf > div.SDZEi > img.SDZEi`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/a40255f7-6c52-4ea8-bc93-50a9a7dd83de.png" alt="" class="SDZEi">
```
</details>

**How to Fix:**

Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS).

**Code Example:**

Before:
```html
<img src="https://www.gstatic.com/search-labs/a40255f7-6c52-4ea8-bc93-50a9a7dd83de.png" alt="...">
```

After:
```html
<img src="https://www.gstatic.com/search-labs/a40255f7-6c52-4ea8-bc93-50a9a7dd83de.png" alt="..." width="800" height="600">
```

**Resources:**
- https://web.dev/cls/

---

### 29. Image Missing Dimensions

**Type:** performance | **Severity:** LOW

**Description:** Image lacks width/height attributes, which can cause layout shifts.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.oGEs5 > section.d5NbRd-gBNGNe.wCKe1d > img.wCKe1d`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/db4f78ea-3bda-4c6b-971d-cfea7e9af409.png" alt="" class="wCKe1d" data-iml="1298.5">
```
</details>

**How to Fix:**

Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS).

**Code Example:**

Before:
```html
<img src="https://www.gstatic.com/search-labs/db4f78ea-3bda-4c6b-971d-cfea7e9af409.png" alt="...">
```

After:
```html
<img src="https://www.gstatic.com/search-labs/db4f78ea-3bda-4c6b-971d-cfea7e9af409.png" alt="..." width="800" height="600">
```

**Resources:**
- https://web.dev/cls/

---

### 30. Image Missing Dimensions

**Type:** performance | **Severity:** LOW

**Description:** Image lacks width/height attributes, which can cause layout shifts.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.FUuIqe > div.MjDldf > div.SDZEi > img.SDZEi`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/9bbb3ab7-1572-4999-8ea1-2ea42e9d42d8.png" alt="" class="SDZEi">
```
</details>

**How to Fix:**

Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS).

**Code Example:**

Before:
```html
<img src="https://www.gstatic.com/search-labs/9bbb3ab7-1572-4999-8ea1-2ea42e9d42d8.png" alt="...">
```

After:
```html
<img src="https://www.gstatic.com/search-labs/9bbb3ab7-1572-4999-8ea1-2ea42e9d42d8.png" alt="..." width="800" height="600">
```

**Resources:**
- https://web.dev/cls/

---

### 31. Image Missing Dimensions

**Type:** performance | **Severity:** LOW

**Description:** Image lacks width/height attributes, which can cause layout shifts.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.oGEs5 > section.d5NbRd-gBNGNe.wCKe1d > img.wCKe1d`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/0962464a-34eb-43e9-ad93-f23c28ac37e6.png" alt="" class="wCKe1d" data-iml="1251.800000000745">
```
</details>

**How to Fix:**

Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS).

**Code Example:**

Before:
```html
<img src="https://www.gstatic.com/search-labs/0962464a-34eb-43e9-ad93-f23c28ac37e6.png" alt="...">
```

After:
```html
<img src="https://www.gstatic.com/search-labs/0962464a-34eb-43e9-ad93-f23c28ac37e6.png" alt="..." width="800" height="600">
```

**Resources:**
- https://web.dev/cls/

---

### 32. Image Missing Dimensions

**Type:** performance | **Severity:** LOW

**Description:** Image lacks width/height attributes, which can cause layout shifts.

**Location:** `body#yDmH0d > c-wiz.zQTmif.SSPGKf > div.T4LgNb > main.IshlDf.zi4hHe > div.bPZvxd.FHAMaf > div.oZRHxd > div.bDUuO > ul.qGgcab > li.Qcsw0d > div.L7v5m > div.K4vxLd-WsjYwc.QiiaPb > div.rol7Xe > div.n7v1Sc > div.FUuIqe > div.MjDldf > div.SDZEi > img.SDZEi`

<details>
<summary>View Element</summary>

```html
<img src="https://www.gstatic.com/search-labs/9bbb3ab7-1572-4999-8ea1-2ea42e9d42d8.png" alt="" class="SDZEi">
```
</details>

**How to Fix:**

Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS).

**Code Example:**

Before:
```html
<img src="https://www.gstatic.com/search-labs/9bbb3ab7-1572-4999-8ea1-2ea42e9d42d8.png" alt="...">
```

After:
```html
<img src="https://www.gstatic.com/search-labs/9bbb3ab7-1572-4999-8ea1-2ea42e9d42d8.png" alt="..." width="800" height="600">
```

**Resources:**
- https://web.dev/cls/

---

## Test Results

| Test Type | Status | Passed | Failed | Duration |
|-----------|--------|--------|--------|----------|
| links | ✅ Pass | 11 | 0 | 0ms |
| buttons | ❌ Fail | 5 | 12 | 1ms |
| seo | ❌ Fail | 3 | 12 | 2ms |
| accessibility | ✅ Pass | 20 | 0 | 1ms |
| performance | ❌ Fail | 0 | 12 | 2ms |
| responsive | ✅ Pass | 10 | 0 | 2ms |
| console | ✅ Pass | 1 | 0 | 0ms |
| security | ✅ Pass | 10 | 0 | 0ms |
| images | ✅ Pass | 10 | 0 | 0ms |
| forms | ✅ Pass | 10 | 0 | 0ms |

## Recommendations

4. **Optimize performance** - Reduce DOM complexity, implement lazy loading, and minimize render-blocking resources.
5. **Improve SEO** - Add missing meta tags, fix heading hierarchy, and ensure all images have alt text.

---

*Report generated by Visual QA Agent - Advanced Bug Detector*
