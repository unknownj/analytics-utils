# Make - Easy DOM Element Creation Library

Make is a lightweight, easy-to-use JavaScript library for creating DOM elements programmatically. With the Make library, you can create elements with tag names, IDs, classes, attributes, content, and styles, as well as specify parent or sibling elements, all with a single function call.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [License](#license)

## Features

- Create DOM elements with a simple function call
- Specify tag names, IDs, classes, attributes, and styles
- Set element content (text, HTMLElement, or an array of HTMLElements)
- Define relationships with parent or sibling elements
- Easily chain methods for added functionality
- IE11 compatible

## Installation

Include the `make.js` file in your project to use the Make library:

```html
<script src="make.js"></script>
```

## Usage

The main function in the Make library is the `make()` function. It takes three arguments:

1. A selector string that defines the element, which can include tag name, ID, classes, attributes, and relationships with existing elements.
2. The intended content of the element, which can be a string, HTMLElement, or an array of HTMLElements.
3. An optional object containing CSS style assignments, either in JS notation (e.g., marginLeft) or CSS notation (e.g., margin-left).

### Example

```javascript
const myElement = make("div#myId.myClass[attr1=value1]", "Hello, world!", {
  backgroundColor: "blue",
  "font-size": "16px",
});

document.body.appendChild(myElement);
```

This will create the following element and append it to the document body:

```html
<div id="myId" class="myClass" attr1="value1" style="background-color: blue; font-size: 16px;">Hello, world!</div>
```

## Examples

Below are a few example use cases for the Make library:

### 1. Create a simple div element

```javascript
const div = make("div");
```

Result:

```html
<div></div>
```

### 2. Create an element with an ID, class, and attribute

```javascript
const element = make("section#content.lighttheme[accessibility=off]", "Welcome to the content");
```

Result:

```html
<section id="content" class="lighttheme" accessibility="off">Welcome to the content</section>
```

### 3. Create an element with styles

```javascript
const styledElement = make("div", "Styled element", {
  backgroundColor: "red",
  "font-size": "18px",
});
```

Result:

```html
<div style="background-color: red; font-size: 18px;">Styled element</div>
```

### 4. Create an element with a parent

```javascript
const parent = make("div#parent");
const child = make("div#parent > div#child", "Child content");

document.body.appendChild(parent);
```

Result:

```html
<div id="parent">
  <div id="child">Child content</div>
</div>
```

### 5. Create an element with a sibling

```javascript
const sibling = make("div#sibling", "Sibling content");
const newElement = make("div#sibling + div#newElement", "New element content");

document.body.appendChild(sibling);
sibling.insertAdjacentElement("afterend", newElement);
```

Result:

```html
<div id="sibling">Sibling content</div>
<div id="newElement">New element content</div>
```

### 6. Create an element with nested children

```javascript
const parent = make("div#parent");
const child1 = make("div", "Child 1");
const child2 = make("div", "Child 2");

const children = [child1, child2];
const nestedParent = make("div#parent", children);

document.body.appendChild(nestedParent);
```

Result:

```html
<div id="parent">
  <div>Child 1</div>
  <div>Child 2</div>
</div>
```

### 7. Create an element and append it to a specified parent

```javascript
const container = document.getElementById("container");
const child = make("div.child", "Child content");

child.appendTo(container);
```

Result (assuming an existing container element):

```html
<div id="container">
  <div class="child">Child content</div>
</div>
```
