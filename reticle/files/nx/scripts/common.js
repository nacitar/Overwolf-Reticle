// TODO: google closure?  dojo?
var nx = nx || {};

/**
 * Checks if the provided value is a number.  This does not necessarily mean
 * that the type of the object is "number", though.
 * @param {*} value The value to check.
 * @return {boolean} True if a number, false otherwise.
 */
nx.isNumber = function(value) {
  return !isNaN(value);
};
/**
 * Checks if the provided value is undefined.
 * @param {*} value The value to check.
 * @return {boolean} True if undefined, false otherwise.
 */
nx.isUndefined = function(value) {
  return typeof(value) == 'undefined';
};
/**
 * An enum to identify types of fields.
 * @enum {number}
 */
nx.FieldType = Object.freeze({
    TEXT: 0, CHECKBOX: 1, RADIO: 2, COLOR: 3, SELECT: 4});
/**
 * Creates a nx.Point object, providing 'x' and 'y' properties.
 * @param {number} x A x coordinate.
 * @param {number} y A y coordinate.
 * @constructor
 */
nx.Point = function(x, y) {
  this.x = x;
  this.y = y;
};
/**
 * Creates a nx.Size object, providing 'width' and 'height' properties.
 * @param {number} width A width value.
 * @param {number} height A height value.
 * @constructor
 */
nx.Size = function(width, height) {
  this.width = width;
  this.height = height;
};
/**
 * Creates an wrapper object for DOM elements, known as an accessor.  The
 * accessor provides useful functions form fields which have an id attribute.
 * @param {number} id The id for a DOM element.
 * @constructor
 */
nx.Accessor = function(id) {
  this.id = id;
};
/**
 * Retrieves the DOM element associated with this Accessor.
 * @return {?Element} The DOM element, or null.
 */
nx.Accessor.prototype.element = function() {
  if (this.id) {
    return document.getElementById(this.id);
  }
  return null;
};
/**
 * Returns the nx.FieldType for this field.
 * @return {?number} The correct nx.FieldType.<X> value, or null.
 */
nx.Accessor.prototype.fieldType = function() {
  var element = this.element();
  if (element) {
    switch (element.tagName) {
      case 'INPUT':
        switch (element.type) {
          case 'checkbox':
            return nx.FieldType.CHECKBOX;
          case 'radio':
            return nx.FieldType.RADIO;
          case 'text':
            var classList = element.classList;
            if (element.color || classList.contains('color')) {
              return nx.FieldType.COLOR;
            }
            return nx.FieldType.TEXT;
        }
        break;
      case 'SELECT':
        return nx.FieldType.SELECT;
    }
  }
  return null;
};
/**
 * Returns the value held by this field, if the field is of a known field type.
 * @return {?*} The value held by the field.
 */
nx.Accessor.prototype.get = function() {
  switch (this.fieldType()) {
    case nx.FieldType.CHECKBOX:
    case nx.FieldType.RADIO:
      return Boolean(this.element().checked);
    case nx.FieldType.TEXT:
    case nx.FieldType.SELECT:
    case nx.FieldType.COLOR:
      return this.element().value;
  }
};
/**
 * Sets the value held by this field, if the field is of a known field type.
 * @param {*} value The value to store in the field.
 */
nx.Accessor.prototype.set = function(value) {
  switch (this.fieldType()) {
    case nx.FieldType.CHECKBOX:
    case nx.FieldType.RADIO:
      this.element().checked = Boolean(value);
      break;
    case nx.FieldType.TEXT:
    case nx.FieldType.SELECT:
      this.element().value = value;
      break;
    case nx.FieldType.COLOR:
      this.element().color.fromString(value);
      break;
  }
};
/**
 * Walks the children of the specified node (or the entire document) and
 * returns an array of accessors for each element among the children with a
 * known field type.
 * @param {?Element} opt_element An optional DOM element in which to search
 *     for fields.  By default, the entire document is searched.
 * @return {Array.<nx.Accessor>} An array of accessors for all fields in the
 *     searched scope.
 */
nx.getFieldAccessors = function(opt_element) {
  return [].map.call(
        (opt_element || document).querySelectorAll('input,textarea,select'),
        function(element) { return new nx.Accessor(element.id) }
      ).filter(function(accessor) {
        return accessor.fieldType() != null;
      });
};
/**
 * For a provided array of accessors, provide an object whose properties are
 * the id attributes of the element and their values being the value stored
 * within the element.
 * @param {Array.<nx.Accessor>} accessorArray An array of accessors.
 * @return {Object} An object reflecting the current data for the elements.
 */
nx.getFieldData = function(accessorArray) {
  var result = {};
  accessorArray.forEach(function(accessor) {
    if (accessor.fieldType() != null) {
      this[accessor.id] = accessor.get();
    }
  }, result);
  return result;
};
/**
 * Sets the stored data of the elements whose accessors were provided, using
 * the data in the provided object.
 * @param {Array.<nx.Accessor>} accessorArray An array of accessors.
 * @param {Object} data An object whose data maps element id attributes to the
 *   desired data.
 */
nx.setFieldData = function(accessorArray, data) {
  accessorArray.forEach(function(accessor) {
    if (accessor.fieldType() != null && data.hasOwnProperty(accessor.id)) {
      accessor.set(data[accessor.id]);
    }
  });
};
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
 * Copies all properties from srcObject into destObject
 * @param {Object} destObject The destination object.
 * @param {Object} srcObject The source object.
 */
nx.copyProperties = function(destObject, srcObject) {
  for (var property in srcObject) {
    if (srcObject.hasOwnProperty(property)) {
      destObject[property] = srcObject[property];
    }
  }
};
/**
 * @param {Element} element A DOM element.
 * @return {nx.Size} An object containing width/height members indicating
 *     the size of the element.
 */
nx.elementSize = function(element) {
  return new nx.Size(element.offsetWidth, element.offsetHeight);
};
/**
 * A wrapper for localStorage because IE doesn't implement localStorage for
 * local files, as it must store it based on a hostname.
 * @constructor
 */
nx.LocalStorageWrapper = function() {
  this.data = { };
};
/**
 * Retrieves a key's associated value from localStorage.
 * @param {string} key The key to retrieve.
 * @return {?string} The value associated with the key.
 */
nx.LocalStorageWrapper.prototype.getItem = function(key) {
  if (window.localStorage) return window.localStorage.getItem(key);
  return this.data[key];
};
/**
 * Sets a key's associated value in localStorage.
 * @param {string} key The key to store.
 * @param {*} value The value to store.
 */
nx.LocalStorageWrapper.prototype.setItem = function(key, value) {
  if (window.localStorage) {
    window.localStorage.setItem(key, value);
  } else {
    this.data[key] = value;
  }
};
/**
 * Clears all localStorage values.
 */
nx.LocalStorageWrapper.prototype.clear = function() {
  if (window.localStorage) {
    window.localStorage.clear();
  } else {
    this.data = {};
  }
};
/**
 * An object used to access localStorage.
 * @public {nx.LocalStorageWrapper}
 */
nx.storage = new nx.LocalStorageWrapper();
/**
 * Retrieves the requested value from localStorage, parsing it as JSON.
 * @param {string} key The key to be retrieved.
 * @return {*} The value from storage for the specified key, interpreted as
 *     JSON.  If no value is present, null.
 */
nx.getStorage = function(key) {
  if (key) {
    var value = nx.storage.getItem(key);
    if (value != null) return JSON.parse(value);
  }
  return null;
};
/**
 * Sets a key's value in localStorage, stringifying the value as JSON.
 * @param {string} key The key to be set.
 * @param {*} value The value to be stored.
 */
nx.setStorage = function(key, value) {
  if (key) nx.storage.setItem(key, JSON.stringify(value));
};
/**
 * Clears localStorage.
 */
nx.clearStorage = function() {
  nx.storage.clear();
};
/**
 * Creates a simple wrapper for a collection of fields that allows simple
 * saving and loading of their values to/from storage.  Allows the user to set
 * an OnChangeListener as well.
 * @param {string} storageKey The key under which to place the data in storage.
 * @param {string} nodeId The id of a parent node of the fields to wrap.
 * @constructor
 */
// TODO: move jscolor initialization elsewhere?
nx.StorageNode = function(storageKey, nodeId) {
  this.STORAGE_KEY = storageKey;
  this.NODE_ID = nodeId;
  this.ACCESSORS = nx.getFieldAccessors(this.element());
  // Install onChange handlers for settings
  this.ACCESSORS.forEach(function(accessor) {
      var fieldType = accessor.fieldType();
      if (fieldType != null) {
        accessor.element().onchange = nx.bind(this, 'onDataChanged');
      }
  }, this);
  this.onDataChanged();
};
/**
 * Returns the field accessors used by this storage node.
 * @return {Array<nx.Accessor>} The accessors.
 */
nx.StorageNode.prototype.accessors = function() {
  return this.ACCESSORS;
};
/**
 * Sets an onChangeListener which will be invoked whenever the data changes.
 * @param {Function} onChangeListener The onChangeListener callback.
 */
nx.StorageNode.prototype.setOnChangeListener = function(onChangeListener) {
  this.onChangeListener = onChangeListener;
};
/**
 * Invoked whenever the underlying data has changed.
 */
nx.StorageNode.prototype.onDataChanged = function() {
  this.data = nx.getFieldData(this.ACCESSORS);
  this.onChangeListener && this.onChangeListener();
};
/**
 * Returns the element of the passed parent node of the fields being wrapped.
 * @return {?Element} The parent element.
 */
nx.StorageNode.prototype.element = function() {
  return document.getElementById(this.NODE_ID);
};
/**
 * Sets the visibility of the settings window.
 * @param {boolean} state True to be visible, False otherwise.
 */
nx.StorageNode.prototype.setVisible = function(state) {
  this.element().style.display = state ? 'block' : 'none';
};
/**
 * Saves the reticle state so upon reload it will be restored.
 */
nx.StorageNode.prototype.save = function() {
  nx.setStorage(this.STORAGE_KEY, this.data);
  console.log('Settings saved.');
};
/**
 * Restores the reticle state to the one you most recently saved.
 * @return {boolean} True if data was loaded, false otherwise.
 */
nx.StorageNode.prototype.load = function() {
  var data = nx.getStorage(this.STORAGE_KEY);
  if (data) {
    console.log('Settings loaded.');
    nx.setFieldData(this.ACCESSORS, data);
    this.onDataChanged();
    return true;
  }
  return false;
};
/**
 * The list of functions to invoke when the DOM is ready.
 * @private {Array}
 */
nx.readyList_ = [];
/**
 * Whether or not ready handlers have fired already.
 * @private {boolean}
 */
nx.readyFired_ = false;
/**
 * Whether or not we have installed event handlers to detect ready status.
 * @private {boolean}
 */
nx.readyEventHandlersInstalled_ = false;
/**
 * Invoked when the DOM is ready, and invokes any registered ready handlers.
 * @private
 */
nx.onDocumentReady_ = function() {
  if (!nx.readyFired_) {
    nx.readyFired_ = true;
    for (var i = 0; i < nx.readyList_.length; i++) {
      // if a callback here happens to add new ready handlers, the function
      // will see that it already fired and will schedule the callback to run
      // right after this event loop finishes so all handlers will still
      // execute in order and no new ones will be added to the readyList while
      // we are processing the list.
      nx.readyList_[i].fn.call(window, nx.readyList_[i].ctx);
    }
    // allow any closures held by these functions to free
    nx.readyList_ = [];
  }
};
/**
 * Provide a callback and an optional context to be passed to that callback,
 * and the callback will be invoked when the DOM is ready.
 * @param {Function} callback The callback to invoke.
 * @param {?*} opt_context A context to pass to the callback when invoked.
 */
nx.ready = function(callback, opt_context) {
  // if ready has already fired, then just schedule the callback
  // to fire asynchronously, but right away
  if (nx.readyFired_) {
    setTimeout(function() {callback(opt_context);}, 1);
    return;
  } else {
    // add the function and opt_context to the list
    nx.readyList_.push({fn: callback, ctx: opt_context});
  }
  // if document is ready to go, schedule the ready function to run
  if (document.readyState === 'complete') {
    setTimeout(nx.onDocumentReady_, 1);
  } else if (!nx.readyEventHandlersInstalled_) {
    // otherwise if we don't have event handlers installed, install them
    if (document.addEventListener) {
      // first choice is DOMContentLoaded event
      document.addEventListener('DOMContentLoaded', nx.onDocumentReady_, false);
      // backup is window load event
      window.addEventListener('load', nx.onDocumentReady_, false);
    } else {
      // must be IE
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState === 'complete') {
            nx.onDocumentReady_();
        }
      });
      window.attachEvent('onload', nx.onDocumentReady_);
    }
    nx.readyEventHandlersInstalled_ = true;
  }
};
