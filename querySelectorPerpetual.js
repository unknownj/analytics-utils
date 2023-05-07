/**
 * querySelectorPerpetual listens for newly added elements that match the given selector
 * and applies specified array-like functions to them.
 *
 * @param {string} selector - A valid CSS selector
 * @param {object} [options] - An optional options object
 * @param {boolean} [options.matchExisting=true] - Whether to match existing elements
 * @param {boolean} [options.matchReappearance=false] - Whether to reapply functions to elements after re-adding them
 * @returns {object} - An object containing array-like functions that can be chained
 */
function querySelectorPerpetual(selector, options) {
  var defaultOptions = {
    matchExisting: true,
    matchReappearance: false
  };

  options = Object.assign(defaultOptions, options || {});

  var target = document.querySelector("body");

  var operations = [];

  // Add a function to the operations array
  function addOperation(name, func) {
    operations.push({ name: name, func: func });
  }

  // Apply operations to an element
  function applyOperations(element) {
    operations.forEach(function (operation) {
      Array.prototype[operation.name].call([element], operation.func);
    });
  }

  // Singleton MutationObserver
  if (!querySelectorPerpetual.observer) {
    querySelectorPerpetual.observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, function (node) {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches(selector)) {
            if (!options.matchReappearance && node._querySelectorPerpetual) {
              return;
            }
            node._querySelectorPerpetual = true;
            applyOperations(node);
          }
        });
      });
    });

    querySelectorPerpetual.observer.observe(target, {
      childList: true,
      subtree: true
    });
  }

  // Match existing elements
  if (options.matchExisting) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (element) {
      if (!options.matchReappearance && element._querySelectorPerpetual) {
        return;
      }
      element._querySelectorPerpetual = true;
      applyOperations(element);
    });
  }

  // Return an object with chainable array-like functions
  return {
    forEach: function (func) {
      addOperation("forEach", func);
      return this;
    },
    map: function (func) {
      addOperation("map", func);
      return this;
    },
    reduce: function (func) {
      addOperation("reduce", func);
      return this;
    },
    filter: function (func) {
      addOperation("filter", func);
      return this;
    },
    every: function (func) {
      addOperation("every", func);
      return this;
    },
    some: function (func) {
      addOperation("some", func);
      return this;
    },
    find: function (func) {
      addOperation("find", func);
      return this;
    }
  };
}
