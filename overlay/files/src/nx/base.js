goog.provide('nx');
goog.provide('nx.storage');

/**
 * Checks if the provided value is undefined.
 * @param {*} value The value to check.
 * @return {boolean} True if undefined, false otherwise.
 */
nx.isUndefined = function(value) {
  return value === undefined;
};
/**
 * Checks if the provided value is a number.  This does not necessarily mean
 * that the type of the object is 'number', though.
 * @param {*} value The value to check.
 * @return {boolean} True if a number, false otherwise.
 */
nx.isNumber = function(value) {
  return !isNaN(value);
};
/**
 * Indicates if the provided value is a function.
 * @param {*} value The value to check.
 * @return {boolean} True if a function, false otherwise.
 */
nx.isFunction = function(value) {
  return Object.prototype.toString.call(value) === '[object Function]';
};
/**
 * A generic closure maker.
 * @param {Object} object The object to bind.
 * @param {Function} method The name of the method to bind to the object.
 * @return {Function} The bound closure.
 */
nx.bind = function(object, method) {
  return function() { return method.apply(object, arguments); };
};
/**
 * Escapes a string to be used in a RegExp
 * @param {string} value The value to escape.
 * @return {string} The escaped string.
 */
nx.escapeRegExp = function(value) {
  return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
/**
 * If defined, returns value.  Otherwise, returns defaultValue.
 * @param {*} value The value to use if defined.
 * @param {*} defaultValue The value to use if undefined.
 * @return {*} The result.
 */
nx.default = function(value, defaultValue) {
  return (nx.isUndefined(value) ? defaultValue : value);
};
// TODO: better handling for bind() as slots
/**
 * A signal class, implementing the sigslot paradigm.
 * @constructor
 */
nx.signal = function() {
  this.slots_ = [];
};
/**
 * Allows a function to be connected as a slot for this signal.
 * @param {function(...[*])} slot The slot to connect.
 * @return {boolean} True if newly connected, false if already connected.
 */
nx.signal.prototype.connect = function(slot) {
  if (!nx.isFunction(slot)) {
    // this should catch common misuse cases; not strictly necessary though.
    console.error('Provided slot is not a function: ' + slot);
  } else {
    if (this.slots_.indexOf(slot) === -1) {
      this.slots_.push(slot);
      return true;
    }
  }
  return false;
};
/**
 * Invokes all connected slots, forwarding any arguments passed.
 */
nx.signal.prototype.emit = function() {
  for (var i = 0, length = this.slots_.length; i < length; ++i) {
    this.slots_[i].apply(undefined, arguments);
  }
};
/**
 * Disconnects the provided slot, if it is already connected.
 * @param {function(...[*])} slot The slot to disconnect.
 * @return {boolean} True if found and removed, false if not found.
 */
nx.signal.prototype.disconnect = function(slot) {
  var i = this.slots_.indexOf(slot);
  if (i !== -1) {
    this.slots_.splice(i, 1);
    return true;
  }
  return false;
};
/**
 * Disconnects all slots.
 */
nx.signal.prototype.disconnectAll = function() {
  this.slots_ = [];
};
/**
 * For each property of the object, invokes the given callback with two
 * arguments: a key and a value.  An optional third argument specified the
 * object to use as 'this' when invoking the callback.
 * @param {Object} object The object to examine.
 * @param {function(...[*])} callback The callback to invoke.
 * @param {Object=} opt_this The object to use as 'this'.
 */
nx.forEachProperty = function(object, callback, opt_this) {
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      callback.apply(opt_this, [key, object[key]]);
    }
  }
};

/**
 * Gets the value of a form field.
 * @param {Element} element A form element.
 * @return {string|boolean} The value.
 */
nx.getField = function(element) {
  var value;
  if (element.type === 'checkbox') {
    value = element.checked;
  } else {
    value = element.value;
  }
  return value;
};
/**
 * Sets the value of a form field.
 * @param {Element} element A form element.
 * @param {string|boolean} value The value.
 * @return {boolean} True if the value changed, false if it is the same.
 */
nx.setField = function(element, value) {
  var changed = false;
  if (element.type === 'checkbox') {
    changed = (element.checked !== value);
    element.checked = value;
  } else if (element.color && element.color.fromString) {
    changed = (element.value !== value);
    element.color.fromString(value);
  } else {
    changed = (element.value !== value);
    element.value = value;
  }
  return changed;
};

/**
 * Adds a storage listener that will be fired in other browser windows of the
 * same domain when storage is changed.
 * @param {function(Event)} callback The callback to invoke with the change
 * event.
 */
nx.storage.addListener = function(callback) {
  window.addEventListener('storage', callback, false);
};
/**
 * Sets the specified storage value.
 * @param {string} key The key to set.
 * @param {*} value The value.
 */
nx.storage.set = function(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
};
/**
 * Gets the specified storage value.
 * @param {string} key The key to get.
 * @return {*} The value.
 */
nx.storage.get = function(key) {
  var value = window.localStorage.getItem(key);
  if (value !== null) {
    return JSON.parse(value);
  }
  return value;
};
/**
 * Removes the specified storage item.
 * @param {string} key The key to remove.
 */
nx.storage.remove = function(key) {
  window.localStorage.removeItem(key);
};
/**
 * Gets the number of localStorage entries.
 * @return {number} The length.
 */
nx.storage.length = function() {
  return window.localStorage.length;
};
/**
 * Returns the key at the given index.
 * @param {number} index The index.
 * @return {?string} The key.
 */
nx.storage.key = function(index) {
  return window.localStorage.key(index);
};
/**
 * The current window, if running in overwolf.
 * @type {?ODKWindow}
 */
nx.odkWindow = null;
/**
 * A signal people can connect to for invoking initialization code.
 * @type {nx.signal}
 */
nx.eventInitialize = new nx.signal();
/**
 * Fires the initialize event, disconnecting all slots.
 * @private
 */
nx.fireInitialize_ = function() {
  nx.eventInitialize.emit();
  nx.eventInitialize.disconnectAll();
};
/**
 * Calls when the current window is retrieved; triggers initialization code.
 * @param {Object} result The overwolf result object.
 * @private
 */
nx.onCurrentWindow_ = function(result) {
  if (result.status === 'success' && result.window !== null) {
    nx.odkWindow = result.window;
    nx.fireInitialize_();
  }
};
/**
 * Fires initialization code after any necessary events have taken place.  For
 * overwolf, the current window will be obtained.
 */
nx.initialize = function() {
  if (window.overwolf) {
    overwolf.windows.getCurrentWindow(nx.onCurrentWindow_);
  } else {
    nx.fireInitialize_();
  }
};
