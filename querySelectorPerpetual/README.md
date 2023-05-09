# querySelectorPerpetual

querySelectorPerpetual is a JavaScript utility function that listens for newly added elements matching a specified CSS selector and applies a set of specified array-like functions to them. It can also apply these functions to existing elements on the page and reapply them if an element reappears in the DOM after being removed.

## Features

- Executes array-like functions on newly added elements matching the specified selector
- Optionally applies functions to existing elements
- Supports reapplication of functions when an element is removed and re-added to the DOM
- Chainable array-like functions (forEach, map, reduce, filter, every, some, find)

## Installation

No installation is required. Simply include the `querySelectorPerpetual` function in your JavaScript file or script tag.

## Usage

To use `querySelectorPerpetual`, call the function with the desired CSS selector and an optional options object:

```javascript
querySelectorPerpetual(selector, options);
```

### Arguments

- `selector` (string): A valid CSS selector.
- `options` (object, optional): An options object to configure the behavior of the function.
  - `matchExisting` (boolean, default: true): If true, the function will also apply the specified operations to elements that match the selector when the function is initially called.
  - `matchReappearance` (boolean, default: false): If true, the function will reapply the operations to elements that were previously matched and removed from the DOM, then re-added.

### Chaining Array-like Functions

After calling `querySelectorPerpetual`, you can chain array-like functions to apply to the matched elements. Supported functions include:

- `forEach`
- `map`
- `reduce`
- `filter`
- `every`
- `some`
- `find`

#### Example: Logging Text Content

The following example demonstrates how to use `querySelectorPerpetual` to log the text content of all `div` elements, both existing and newly added:

```javascript
querySelectorPerpetual("div").forEach(function (element) {
  console.log(element.textContent);
});
```

#### Example: Modifying Class List

In this example, the `classList` of all `p` elements with the class `.highlight` is modified:

```javascript
querySelectorPerpetual("p.highlight").forEach(function (element) {
  element.classList.add("processed");
});
```

#### Example: Filtering and Mapping

The following example filters and maps `li` elements with a specific condition:

```javascript
querySelectorPerpetual("li")
  .filter(function (element) {
    return element.textContent.trim().length > 0;
  })
  .map(function (element) {
    return element.textContent.toUpperCase();
  })
  .forEach(function (text) {
    console.log(text);
  });
```

### Options: matchExisting and matchReappearance

By default, `querySelectorPerpetual` will apply the specified operations to elements that match the selector when the function is initially called. You can disable this behavior by setting the `matchExisting` option to `false`:

```javascript
querySelectorPerpetual("div", { matchExisting: false }).forEach(function (element) {
  console.log(element.textContent);
});
```

If you want the function to reapply the operations to elements that were previously matched, removed from the DOM, and then re-added, set the `matchReappearance` option to `true`:

```javascript
querySelectorPerpetual("div", { matchReappearance: true }).forEach(function (element) {
  console.log(element.textContent);
});
```

## Browser Support

querySelectorPerpetual should work in all modern browsers (Chrome, Firefox, Safari, Edge) that support MutationObserver and other ES5 features. It may not work in Internet Explorer or older browsers without polyfills for missing features.

## Limitations

- The function uses a single MutationObserver instance to watch for DOM changes. Adding too many selectors or performing computationally expensive operations may affect performance.
- The function doesn't currently support adding event listeners or handling errors within the chain. You should include error handling in your chained functions and event listeners, if necessary.
- Although the function supports chaining array-like functions, it does not return a true JavaScript array. This means that some array methods, such as `splice` or `pop`, are not supported.

## Examples

### Example: Applying Styles to New Elements

In this example, we'll apply a specific style to all new elements with the class `.dynamic`:

```javascript
querySelectorPerpetual(".dynamic").forEach(function (element) {
  element.style.backgroundColor = "lightblue";
});
```

### Example: Modifying Elements Based on Data Attributes

In the following example, we'll modify the `src` attribute of new `img` elements based on their `data-src` attribute:

```javascript
querySelectorPerpetual("img[data-src]").forEach(function (element) {
  element.src = element.getAttribute("data-src");
});
```

### Example: Counting Elements with a Specific Class

This example demonstrates how to count the number of elements with the class `.item`:

```javascript
var count = 0;
querySelectorPerpetual(".item").forEach(function (element) {
  count++;
  console.log("Element count: " + count);
});
```

### Example: Creating Custom Functionality

The following example demonstrates how to create a custom function that leverages `querySelectorPerpetual`:

```javascript
function addAutoHighlight(selector) {
  querySelectorPerpetual(selector).forEach(function (element) {
    element.addEventListener("mouseover", function () {
      element.classList.add("highlight");
    });

    element.addEventListener("mouseout", function () {
      element.classList.remove("highlight");
    });
  });
}

addAutoHighlight(".auto-highlight");
```

In this example, we create a reusable `addAutoHighlight` function that adds the "highlight" class to elements matching the specified selector when they are hovered over.
