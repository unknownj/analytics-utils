# el3 Library

The `el3` library is a lightweight utility for creating and manipulating HTML, SVG, and MathML elements using CSS-style selectors and JavaScript objects for styles. The library provides an easy-to-use API to create, style, and modify elements, as well as to append them to existing elements in the DOM.

## Features

- Create HTML, SVG, and MathML elements with a simple API
- Apply styles to elements using JavaScript objects
- Convert polar coordinates to Cartesian coordinates
- Remove elements from the DOM
- Remove all child nodes from an element
- Append elements to other elements

## Usage

Include the `el3` library in your HTML file:

```html
<script src="path/to/el3.js"></script>
```

### Creating Elements

Create an element using the `make` method:

```javascript
var div = el3.make("div");
```

Create an element with an ID and class using the `make` method:

```javascript
var div = el3.make("div#my-id.my-class");
```

Create an element with attributes using the `make` method:

```javascript
var div = el3.make("div[data-attr=value]");
```

Create an SVG element using the `draw` method:

```javascript
var circle = el3.draw("circle");
```

Create a MathML element using the `math` method:

```javascript
var math = el3.math("math");
```

### Applying Styles

Apply styles to an element using the `applyStyle` method:

```javascript
el3.applyStyle(div, {
  backgroundColor: "blue",
  width: "100px",
  height: "100px"
});
```

### Removing Elements

Remove an element from its parent node using the `remove` method:

```javascript
el3.remove(div);
```

Remove all child nodes of an element using the `removeAllChildren` method:

```javascript
el3.removeAllChildren(div);
```

### Appending Elements

Append a single HTMLElement to a specified element using the `append` method:

```javascript
el3.append(div, circle);
```

Append an array of HTMLElements to a specified element using the `append` method:

```javascript
el3.append(div, [circle, math]);
```

## Examples

### Creating and Styling a Div

```javascript
var myDiv = el3.make("div#my-id.my-class", "Hello, world!", {
  backgroundColor: "blue",
  color: "white",
  padding: "10px",
  borderRadius: "5px"
});

myDiv.appendTo(document.body);
```

### Creating and Styling an SVG Circle

```javascript
var svg = el3.draw("svg", null, {
  width: "200",
  height: "200"
});

var circle = el3.draw("circle", null, {
  cx: "100",
  cy: "100",
  r: "50",
  fill: "red"
});

el3.append(svg, circle);
svg.appendTo(document.body);
```

### Creating a MathML Element

```javascript
var math = el3.math("math");
var mi = el3.math("mi", "x");
var mo = el3.math("mo", "=");
var mn = el3.math("mn", "42");

el3.append(math, [mi, mo, mn]);
math.appendTo(document.body);
```
