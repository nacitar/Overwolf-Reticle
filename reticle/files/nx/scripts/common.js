// TODO: google closure?  dojo?
var nx = nx || {};

/**
 * A generic closure maker.
 * @param {Object} toObject The object to bind.
 * @param {string} methodName The name of the method to bind to the object.
 * @return {Function} The bound closure.
 */
nx.bind = function(toObject, methodName) {
    return function() { toObject[methodName](); };
};
/**
 * @return {Object} An object containing width/height members indicating
 *     the screen dimensions.
 */
nx.screenSize = function() {
  return {width: window.screen.width, height: window.screen.height};
};
/**
 * @param {Object} A DOM element.
 * @return {Object} An object containing width/height members indicating
 *     the dimensions of the element.
 */
nx.elementSize = function(element) {
  return {width: element.offsetWidth, height: element.offsetHeight};
};
/**
 * Retrieves the requested value from localStorage, parsing it as JSON.
 * @param {string} key The key to be retrieved.
 * @return {*} The value from storage for the specified key, interpreted as
 *     JSON.  If no value is present, null.
 */
nx.getConfig = function(key) {
  if (key) {
    var value=window.localStorage.getItem(key);
    if (value != null) return JSON.parse(value);
  }
  return null;
};
/**
 * Sets a key's value in localStorage, stringifying the value as JSON.
 * @param {string} key The key to be set.
 * @param {*} value The value to be stored.
 */
nx.setConfig = function(key, value) {
  if (key) window.localStorage.setItem(key, JSON.stringify(value));
};
/**
 * Clears localStorage.
 */
nx.clearConfig = function() {
  window.localStorage.clear();
};
/**
 * Creates an wrapper object for DOM elements, known as an "accessor".  The
 * accessor provides useful function for known form fields which have an 'id'
 * property set.  If unknown or without an 'id' property, .field will be false.
 * Otherwise, .field will be true and there will also be get(), .set(value),
 * and .element() methods to read from, write to, and retrieve the DOM element
 * respectively.
 * @param {Object} element A DOM element.
 * @return {Object} An accessor for the provided DOM element.
 */
nx.elementAccessor = function(element) {
  var accessor = {field: false};
  if (element.id) {
    accessor.id = element.id;
    accessor.element = function() { return document.getElementById(this.id); };
    if (element.tagName == 'INPUT' &&
        ['checkbox','radio'].indexOf(element.type) != -1) {
      accessor.get = function() { return this.element().checked };
      accessor.set = function(value) { this.element().checked=Boolean(value); };
      accessor.field = true;
    } else if (element.tagName == 'SELECT' || element.tagName == 'INPUT' &&
        ['text'].indexOf(element.type) != -1) {
      accessor.get = function() { return this.element().value; };
      accessor.set = function(value) {
        var element = this.element();
        // for jscolor controls
        if (element.classList.contains('color') && element.color) {
          element.color.fromString(value);
        } else {
          element.value = value;
        }
      };
      accessor.field = true;
    }
  }
  return accessor;
};
/**
 * Walks the children of the specified node (or the entire document) and
 * returns an array of accessors for each field among the children.
 * @param {Object} opt_node An optional DOM node in which to search for fields.
 *     By default, the entire document is searched.
 * @return {Array.<Object>} An array of accessors for all fields in the
 *     searched scope.
 */
nx.getFieldAccessors = function(opt_node) {
  return [].map.call(
        (opt_node || document).querySelectorAll('input,textarea,select'),
        function (element) { return nx.elementAccessor(element) }
      ).filter(function(accessor) {
        return accessor.field;
      });
};
/**
 * For a provided array of accessors, provide an object whose properties are
 * the id attributes of the element and their values being the value stored
 * within the element.
 * @param {Array.<Object>} elementAccessors An array of accessors.
 * @return {Object} An object reflecting the current data for the elements.
 */
nx.getFieldData = function(elementAccessors) {
  var result={}
  elementAccessors.forEach(function(accessor) {
    if (accessor.field) {
      this[accessor.id] = accessor.get();
    }
  }, result);
  return result;
};
/**
 * Sets the stored data of the elements whose accessors were provided, using
 * the data in the provided object.
 * @param {Array.<Object>} elementAccessors An array of accessors.
 * @param {Object} data An object whose data maps element id attributes to the
 *   desired data.
 */
nx.setFieldData = function(elementAccessors, data) {
  elementAccessors.forEach(function(accessor) {
    if (accessor.field && data.hasOwnProperty(accessor.id)) {
      accessor.set(data[accessor.id]);
    }
  });
};
