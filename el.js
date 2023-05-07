var el2 = {

  // Function to take a selector, optional content, and a style object, and return an element
  _make: function (selector, optionalDescendants, optionalStyleObject, optionalNamespace) {

    var elementDefinition = {
      elementType: [],
      id: [],
      classList: [],
      attributeList: [],
      junk: []
    };

    var optionalText;
    var optionalChildren;
    var optionalHTML;

    /**
     *  If the input is an object, expect the following properties:
     * 
     *  text as a string
     *  children as an array of children
     *  style as a style object
     *  selector as a longer CSS selector type thing
     *  type as a string
     *  id as a string
     *  classList as an array
     *  attributes as key value pairs
     * 
     */
    if (typeof selector === "object") {
      var obj = selector;
      optionalText = obj.text;
      optionalChildren = obj.children;
      optionalHTML = obj.html;
      optionalStyleObject = obj.style;
      selector = obj.selector;
      if (obj.type) elementDefinition.elementType.push(obj.type);
      if (obj.id) elementDefinition.id.push(obj.id);
      if (obj.classList) elementDefinition.classList = elementDefinition.classList.concat(obj.classList);
      if (obj.attributes) for (var k in obj.attributes) elementDefinition.attributeList.push(k + "=" + attributes[k]);
      if (obj.cssVariables){
        optionalStyleObject = optionalStyleObject || {};
        for (var k in obj.cssVariables){
          optionalStyleObject["--" + k] = obj.cssVariables[k];
        }
      }
    }

    /**
     * Handle different types of children
     */
    if (typeof optionalDescendants === "object" && typeof optionalDescendants.html === "string") {
      optionalHTML = optionalDescendants.html;
    } else if (typeof optionalDescendants === "object" && optionalDescendants.tagName) {
      optionalChildren = [optionalDescendants];
    } else if (typeof optionalDescendants === "object") {
      optionalChildren = optionalDescendants;
    } else if (typeof optionalDescendants === "string" || typeof optionalDescendants === "number") {
      optionalText = optionalDescendants.toString();
    }


    if (typeof selector === "string" && selector) {
      // Split the selector into an array of characters to run through
      var parts = selector.split("");

      var currentlyUpdating = "elementType";
      var currentValue = "";

      for (var i = 0; i <= parts.length; i++) {
        if (i === parts.length) {
          elementDefinition[currentlyUpdating].push(currentValue);
        } else if (currentlyUpdating === "attributeList" && parts[i] === "]") {
          elementDefinition[currentlyUpdating].push(currentValue);
          currentValue = "";
          currentlyUpdating = "junk";
        } else if (currentlyUpdating === "attributeList") {
          currentValue += parts[i];
        } else if (parts[i] === ".") {
          elementDefinition[currentlyUpdating].push(currentValue);
          currentValue = "";
          currentlyUpdating = "classList";
        } else if (parts[i] === "#") {
          elementDefinition[currentlyUpdating].push(currentValue);
          currentValue = "";
          currentlyUpdating = "id";
        } else if (parts[i] === "[") {
          elementDefinition[currentlyUpdating].push(currentValue);
          currentValue = "";
          currentlyUpdating = "attributeList";
        } else {
          currentValue += parts[i]
        }
      }

    }

    var element = optionalNamespace ?
      document.createElementNS(optionalNamespace, elementDefinition.elementType)
      :
      document.createElement(elementDefinition.elementType || "div");

    element.elementDefinition = elementDefinition;

    elementDefinition.classList.forEach(function (c) {
      element.classList.add(c);
    });

    elementDefinition.attributeList.forEach(function (attrString) {
      if (optionalNamespace) {
        element.setAttributeNS(null, attrString.split("=")[0], attrString.split("=").splice(1).join("="));
      } else {
        element.setAttribute(attrString.split("=")[0], attrString.split("=").splice(1).join("="));
      }
    });

    if (elementDefinition.id.length > 0) {
      if (optionalNamespace) {
        element.setAttributeNS(null, "id", elementDefinition.id[0]);
      } else {
        element.setAttribute("id", elementDefinition.id[0]);
      }
    }

    var styles = [];
    if (optionalStyleObject && !Array.isArray(optionalStyleObject)) {
      styles.push(optionalStyleObject);
    } else if (optionalStyleObject && Array.isArray(optionalStyleObject)) {
      styles = styles.concat(optionalStyleObject);
    }
    styles.forEach(function (styleObject) {
      for (var k in styleObject) {
        if(k.indexOf("-") >= 0){
          element.style.setProperty(k, styleObject[k]);
        } else {
          element.style[k] = styleObject[k];
        }
      }
    });

    if (optionalText && typeof optionalText !== "object") {
      element.appendChild(this.text(optionalText));
    } else if (optionalHTML && typeof optionalHTML === "string") {
      element.innerHTML = optionalHTML; // yucky...
    }

    if (optionalChildren) {
      optionalChildren
        .filter(function (child) {
          return child.tagName;
        })
        .forEach(function (child) {
          element.appendChild(child);
        });
    }

    element.appendTo = function(targetElement){
      targetElement.appendChild(element);
      return element;
    }

    return element;
  },

  make: function (selector, optionalDescendants, optionalStyleObject) {
    return this._make(selector, optionalDescendants, optionalStyleObject);
  },

  draw: function (selector, optionalText, optionalStyleObject) {
    return this._make(selector, optionalText, optionalStyleObject, "http://www.w3.org/2000/svg");
  },

  text: function (value) {
    return document.createTextNode(value);
  }
};


el2.draw.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {

  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
    toXY: function (spacer) { return this.x + spacer + this.y; }
  };

}

el2.draw.regularNGon = function (n, centerX, centerY, radius, filled, rotationOffset, optionalStyleObject) {
  var points = [];
  for (var i = 0; i < n; i++) {
    points.push(el2.draw.polarToCartesian(centerX, centerY, radius, rotationOffset + (i * 360 / n)));
  }
  if (!filled) points.push(el2.draw.polarToCartesian(centerX, centerY, radius, rotationOffset));

  var strPoints = points.map(function (p) { return p.toXY(","); }).join(" ");

  var poly = el2.draw((filled ? "polygon" : "polyline") + "[points=" + strPoints + "]", undefined, optionalStyleObject);
  if (!filled) {
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke-width", "1px");
    poly.setAttribute("stroke", "black");
  } else {
    poly.setAttribute("fill", "black");
    poly.setAttribute("stroke", "none");
  }
  return poly;
}

el2.draw.rectangle = function (x, y, width, height, optionalStyleObject) {
  return el2.draw("rect[x=" + x + "][y=" + y + "][width=" + width + "][height=" + height + "]", undefined, optionalStyleObject);
}

el2.draw.roundedRectangle = function (x, y, width, height, cornerRadius, optionalStyleObject) {
  return el2.draw("rect[x=" + x + "][y=" + y + "][width=" + width + "][height=" + height + "][rx=" + cornerRadius + "]", undefined, optionalStyleObject);
}

el2.draw.circle = function (centerX, centerY, radius, optionalStyleObject) {
  return el2.draw("circle[cx=" + centerX + "][cy=" + centerY + "][r=" + radius + "]", undefined, optionalStyleObject);
};

el2.draw.cog = function (centerX, centerY, innerRadius, outerRadius, teeth, rotationOffset, optionalStyleObject) {
  rotationOffset = rotationOffset || 0;
  rotationOffset -= (360 / (teeth * 4));
  var bump = 360 / (teeth * 2) * 0.2;
  var points = [];
  for (var i = 0; i < teeth * 4; i++) {
    if (i % 4 === 0) {
      points.push(el2.draw.polarToCartesian(centerX, centerY, innerRadius, rotationOffset - bump + (i * 360 / (teeth * 4))));
      points.push(el2.draw.polarToCartesian(centerX, centerY, outerRadius, rotationOffset + (i * 360 / (teeth * 4))));
    } else if (i % 4 === 1) {
      points.push(el2.draw.polarToCartesian(centerX, centerY, outerRadius, rotationOffset + (i * 360 / (teeth * 4))));
    } else if (i % 4 === 2) {
      points.push(el2.draw.polarToCartesian(centerX, centerY, outerRadius, rotationOffset + (i * 360 / (teeth * 4))));
      points.push(el2.draw.polarToCartesian(centerX, centerY, innerRadius, rotationOffset + (bump + (i * 360 / (teeth * 4)))));
    } else {
      points.push(el2.draw.polarToCartesian(centerX, centerY, innerRadius, rotationOffset + (i * 360 / (teeth * 4))));
    }
  }
  var strPoints = points.map(function (p) { return p.toXY(","); }).join(" ");

  var poly = el2.draw("polygon[points=" + strPoints + "]", undefined, optionalStyleObject);
  poly.setAttribute("fill", "black");
  poly.setAttribute("stroke", "none");
  return poly;
}

el2.draw.svg = function (width, height, viewBox, optionalChildren, optionalStyle) {
  var svg = el2.draw("svg[width=" + width + "][height=" + height + "]" + (viewBox ? "[viewBox=" + viewBox + "]" : ""), optionalChildren, optionalStyle);
  var defs = el2.draw("defs");
  svg.appendChild(defs);
  svg.appendDefs = function (itemToAppend) {
    defs.appendChild(itemToAppend);
  }
  return svg;
}

el2.draw.gradient = function (id, stops, direction) {
  var gradient = el2.draw([
    "linearGradient",
    "[id=" + id + "]",
    "[x1=0]",
    "[y1=0]",
    "[x2=" + (direction === "horizontal" ? "1" : "0") + "]",
    "[y2=" + (direction === "horizontal" ? "0" : "1") + "]"
  ].join(""));

  // for each member of stops that is a colour string, convert it to an object
  stops = stops.map(function (stop) {
    if (typeof stop === "string") {
      return { color: stop };
    } else {
      return stop;
    }
  });

  // if the first stop has no offset, set it to zero
  if (stops[0].offset === undefined) stops[0].offset = 0;
  // if the last stop has no offset, set it to 100%
  if (stops[stops.length - 1].offset === undefined) stops[stops.length - 1].offset = "100%";
  // if there are exactly three stops and the middle has no offset, set it to 50%
  if (stops.length === 3 && stops[1].offset === undefined) stops[1].offset = "50%";

  stops.forEach(function (stop) {
    gradient.appendChild(el2.draw("stop[offset=" + stop.offset + "][stop-color=" + stop.color + "]"));
  });
  return gradient;
}

el2.draw.line = function (x1, y1, x2, y2, optionalStyleObject) {
  return el2.draw("line[x1=" + x1 + "][y1=" + y1 + "][x2=" + x2 + "][y2=" + y2 + "]", undefined, optionalStyleObject);
}

el2.make.script = function(url){
  return el2.make("script[src=" + url + "]");
}



/**
 * Takes a single element CSS selector and turns it into an object with the specified properties.
 * @param {string} selector - A single element CSS selector.
 * @returns {Object} An object with properties: tagName, id, classList, and attributes.
 */
function selectorToComponents(selector) {
  // Initialize the result object with default values
  var result = {
    tagName: 'div',
    id: undefined,
    classList: [],
    attributes: {}
  };

  // Extract the attributes first to simplify parsing of the remaining selector
  var attributeRegex = /\[([\w-]+)(?:=(?:['"](.+?)['"]|([^\]]+)))?\]/g;
  var attributeMatch;
  while ((attributeMatch = attributeRegex.exec(selector)) !== null) {
    var attributeName = attributeMatch[1];
    var attributeValue = attributeMatch[2] || attributeMatch[3] || '';
    result.attributes[attributeName] = attributeValue;

    // Replace the matched attribute with a placeholder to avoid matching hashes and periods inside attribute values
    selector = selector.replace(attributeMatch[0], '');
  }

  // Regex to match different parts of the selector
  var tagNameRegex = /^[\w-]+/;
  var idRegex = /#([\w-]+)/;
  var classRegex = /\.([\w-]+)/g;

  // Extract the tag name
  var tagNameMatch = selector.match(tagNameRegex);
  if (tagNameMatch) {
    result.tagName = tagNameMatch[0];
    selector = selector.replace(tagNameMatch[0], '');
  }

  // Extract the ID
  var idMatch = selector.match(idRegex);
  if (idMatch) {
    result.id = idMatch[1];
  }

  // Extract the class list
  var classMatch;
  while ((classMatch = classRegex.exec(selector)) !== null) {
    result.classList.push(classMatch[1]);
  }

  return result;
}



/**
 * Takes a single string input and returns an object with the appropriate properties
 * depending on the input.
 * @param {string} input - A single string input representing an element selector with optional combinators.
 * @returns {Object} An object with properties: elementDefinition, parentElement (optional), and siblingElement (optional).
 */
function resolveRelativeElement(input) {
  // Initialize the result object with the default values
  var result = {
    elementDefinition: '',
    parentElement: undefined,
    siblingElement: undefined
  };

  // Replace attribute selectors with placeholders to avoid confusion with combinators
  var attributeRegex = /\[.*?\]/g;
  var attributePlaceholders = [];
  var attributeMatch;
  while ((attributeMatch = attributeRegex.exec(input)) !== null) {
    var placeholder = 'ATTR' + attributePlaceholders.length;
    attributePlaceholders.push(attributeMatch[0]);
    input = input.replace(attributeMatch[0], placeholder);
  }

  // Find the last child or sibling combinator in the input string
  var lastCombinatorIndex = Math.max(input.lastIndexOf('>'), input.lastIndexOf('+'));

  if (lastCombinatorIndex !== -1) {
    // Set the elementDefinition to the selector after the last combinator
    result.elementDefinition = input.slice(lastCombinatorIndex + 1).trim();

    // Set the parentElement or siblingElement property depending on the last combinator
    if (input[lastCombinatorIndex] === '>') {
      result.parentElement = input.slice(0, lastCombinatorIndex).trim();
    } else {
      result.siblingElement = input.slice(0, lastCombinatorIndex).trim();
    }
  } else {
    // If there's no combinator, the input string is a single element selector
    result.elementDefinition = input.trim();
  }

  // Replace attribute placeholders with their original values
  for (var i = 0; i < attributePlaceholders.length; i++) {
    result.elementDefinition = result.elementDefinition.replace('ATTR' + i, attributePlaceholders[i]);
    if (result.parentElement) {
      result.parentElement = result.parentElement.replace('ATTR' + i, attributePlaceholders[i]);
    }
    if (result.siblingElement) {
      result.siblingElement = result.siblingElement.replace('ATTR' + i, attributePlaceholders[i]);
    }
  }

  return result;
}


/**
 * Applies styles from the given style object to the specified HTMLElement.
 * @param {HTMLElement} element - The HTMLElement to which the styles will be applied.
 * @param {Object} styles - An object containing style assignments in either JS notation or CSS notation.
 */
function applyStylesToElement(element, styles) {
  // Iterate through each style property in the styles object
  for (var property in styles) {
    if (styles.hasOwnProperty(property)) {
      var value = styles[property];

      // Check if the property is a CSS custom property (e.g. '--col')
      var customPropertyRegex = /^--/;
      if (customPropertyRegex.test(property)) {
        // Apply the CSS custom property using setProperty method
        element.style.setProperty(property, value);
      } else {
        // Check if the property is in CSS notation (e.g. 'margin-left')
        var cssNotationRegex = /-./g;
        if (cssNotationRegex.test(property)) {
          // Convert the property from CSS notation to JS notation (e.g. 'marginLeft')
          var jsNotationProperty = property.replace(cssNotationRegex, function(match) {
            return match.charAt(1).toUpperCase();
          });

          // Apply the style to the element using JS notation
          element.style[jsNotationProperty] = value;
        } else {
          // Apply the style to the element using the given JS notation
          element.style[property] = value;
        }
      }
    }
  }
}


/**
 * Creates an HTMLElement based on the given selector, content, and styles, and
 * appends the element to the specified parent or sibling element, if provided.
 *
 * @param {string} selector - The selector for the element to be created and the
 *                             parent or sibling element it should be appended to.
 * @param {string|HTMLElement|HTMLElement[]|undefined} content - The content to be
 *                                                               set as the textContent,
 *                                                               an HTMLElement, or an array
 *                                                               of HTMLElements.
 * @param {Object} styles - An object containing style assignments for the created element.
 * @returns {HTMLElement} - The created HTMLElement.
 */
function make(selector, content, styles) {
  // Get the element relationship information.
  var elementInfo = resolveRelativeElement(selector);

  // Get the component information for the element to be created.
  var components = selectorToComponents(elementInfo.elementDefinition);

  // Create the new element.
  var newElement = document.createElement(components.tagName || "div");

  // Set the ID, if provided.
  if (components.id) {
    newElement.id = components.id;
  }

  // Set the class list, if provided.
  if (components.classList) {
    newElement.className = components.classList.join(" ");
  }

  // Set the attributes, if provided.
  for (var attr in components.attributes) {
    newElement.setAttribute(attr, components.attributes[attr]);
  }

  // Set the content, if provided.
  if (typeof content === "string") {
    newElement.textContent = content;
  } else if (content instanceof HTMLElement) {
    newElement.appendChild(content);
  } else if (Array.isArray(content)) {
    content.forEach(function (child) {
      if (child instanceof HTMLElement) {
        newElement.appendChild(child);
      }
    });
  }

  // Apply the styles, if provided.
  if (styles) {
    applyStylesToElement(newElement, styles);
  }

  // Append the new element to the specified parent or sibling element, if provided.
  if (elementInfo.parentElement) {
    var parent = document.querySelector(elementInfo.parentElement);
    if (parent) {
      parent.appendChild(newElement);
    }
  } else if (elementInfo.siblingElement) {
    var sibling = document.querySelector(elementInfo.siblingElement);
    if (sibling && sibling.parentNode) {
      sibling.parentNode.insertBefore(newElement, sibling.nextSibling);
    }
  }

  // Add the appendTo method to the new element.
  newElement.appendTo = function (intendedParentElement) {
    if (intendedParentElement instanceof HTMLElement) {
      intendedParentElement.appendChild(this);
    }
    return this;
  };

  // Return the new element.
  return newElement;
}
