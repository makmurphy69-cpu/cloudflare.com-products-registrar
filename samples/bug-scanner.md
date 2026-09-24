# Bug Scanner report

Score: 15/100 · 9 problem(s) · 1 file(s)

## What the code builds

A simple interactive web-based shopping list application. Users can enter items into an input field, click an 'Add' button to append them to the list, see the total count updated, and have their list persisted across page reloads using browser local storage.

## Expected output (AI prediction)

```
On the very first run (when localStorage is empty), the page crashes immediately with a console error: 'TypeError: Cannot read properties of null (reading 'length')' inside the render function, preventing anything from displaying correctly.
```

## Problems

### 1. [CRITICAL] Null pointer crash on initialization — pasted-code:18

**What is wrong:** On first page load, `localStorage.getItem('items')` returns `null`. Parsing `null` with `JSON.parse` returns `null`. Therefore, `items` becomes `null`, which immediately crashes the application when `render()` is called because it tries to read `.length` of `null`.

**Why it matters:** The application is completely broken and unusable for any new user who does not already have existing shopping items stored in their browser local storage.

**How to fix it:** Provide a default fallback of an empty array (`[]`) using the logical OR (`||`) operator if local storage returns nothing.

```
  const items = JSON.parse(localStorage.getItem('items')) || [];
```

### 2. [HIGH] Loop goes one step too far (off-by-one) — pasted-code:22

**What is wrong:** Lists start at index 0, so the last valid index is length − 1. Using <= length reads one item past the end, which is undefined (JavaScript) or crashes (IndexError in Python).

**How to fix it:** Use < instead of <=.

```
for (let i = 0; i < items.length; i++) {
```

### 3. [HIGH] Off-by-one loop crash — pasted-code:22

**What is wrong:** The loop condition `i <= items.length` includes the index equal to the array length, which is one step too far. When `i` is equal to `items.length`, `items[i]` returns `undefined`.

**Why it matters:** Accessing `items[i].name` when `items[i]` is undefined throws a runtime `TypeError: Cannot read properties of undefined` and halts script execution entirely.

**How to fix it:** Change the loop condition to use `<` instead of `<=`.

```
    for (let i = 0; i < items.length; i++) {
```

### 4. [HIGH] Cross-Site Scripting (XSS) vulnerability — pasted-code:23

**What is wrong:** The application inserts unescaped user-provided inputs directly into the DOM using `innerHTML` concatenation.

**Why it matters:** If a user enters malicious markup (e.g., `<img src=x onerror=alert(document.cookie)>`), it will execute immediately in the browser, posing a significant security risk.

**How to fix it:** Avoid `innerHTML` with user variables. Instead, dynamically create list elements using `document.createElement('li')` and safely populate them using `.textContent`.

```
    for (let i = 0; i < items.length; i++) {
      const li = document.createElement('li');
      li.textContent = items[i].name;
      list.appendChild(li);
    }
```

### 5. [HIGH] Improper localStorage serialization — pasted-code:30

**What is wrong:** The code saves the array directly via `localStorage.setItem('items', items)`. This implicitly calls `toString()` on the array, converting it to the string `'[object Object],[object Object]'` instead of a JSON string.

**Why it matters:** On subsequent page reloads, `JSON.parse` will fail with a SyntaxError because `'[object Object]'` is not valid JSON, permanently breaking the application for that user until manual local storage cleanup.

**How to fix it:** Use `JSON.stringify(items)` to properly serialize the array of objects before saving it.

```
    localStorage.setItem('items', JSON.stringify(items));
```

### 6. [MEDIUM] Typo in length property — pasted-code:25

**What is wrong:** The property name is misspelled as `.lenght` instead of `.length`.

**Why it matters:** Since `.lenght` is undefined, the total items count will display as 'undefined' on the page instead of the actual count.

**How to fix it:** Correct the spelling to `items.length`.

```
    document.getElementById('count').textContent = items.length;
```

### 7. [LOW] No mobile viewport tag — pasted-code:1

**What is wrong:** On phones the page will be shown zoomed out and tiny.

**How to fix it:** Add the viewport meta tag inside <head>.

```
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### 8. [LOW] Missing mobile viewport tag — pasted-code:1

**What is wrong:** The document does not declare a viewport meta tag.

**Why it matters:** Without a viewport tag, mobile browsers will render the desktop version of the page, making content, inputs, and buttons incredibly small and difficult to use.

**How to fix it:** Add a viewport `<meta>` tag inside the `<head>` section.

```
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 9. [LOW] Missing image alt attribute — pasted-code:16

**What is wrong:** The `<img>` tag does not contain an `alt` attribute.

**Why it matters:** Visually impaired users using screen readers won't understand what the image represents, and it degrades SEO performance.

**How to fix it:** Add an descriptive `alt` attribute to the image tag.

```
<img src="cart.png" alt="Shopping cart">
```

## Fixed code

```
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Shopping list</title>
<style>
  body { font-family: sans-serif; max-width: 420px; margin: 30px auto; }
  li.done { text-decoration: line-through; color: gray }
</style>
</head>
<body>
<h1>Shopping list</h1>
<input id="item" placeholder="Add an item">
<button id="add">Add</button>
<ul id="list"></ul>
<p>Total items: <span id="count">0</span></p>
<img src="cart.png" alt="Shopping cart">
<script>
  const items = JSON.parse(localStorage.getItem('items')) || [];
  function render() {
    const list = document.getElementById('list');
    list.innerHTML = '';
    for (let i = 0; i < items.length; i++) {
      const li = document.createElement('li');
      li.textContent = items[i].name;
      list.appendChild(li);
    }
    document.getElementById('count').textContent = items.length;
  }
  document.getElementById('add').onclick = function () {
    const name = document.getElementById('item').value;
    if (name.trim() !== '') {
      items.push({ name: name, done: false });
      localStorage.setItem('items', JSON.stringify(items));
      render();
      document.getElementById('item').value = '';
    }
  };
  render();
</script>
</body>
</html>
```

_Made with MigaBuilder Bug Scanner · https://migabuilder.com/bug-scanner.html_