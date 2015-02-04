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
 * Returns the first defined value passed in the arguments, or undefined.
 * @param {...*} var_args Any number of arguments.
 * @return {?*} The result.
 */
nx.default = function(var_args) {
  for (var i = 0, length = arguments.length; i < length; ++i) {
    var arg = arguments[i];
    if (!nx.isUndefined(arg)) {
      return arg;
    }
  }
};
/**
 * Creates a slot for use with nx.Signal
 * @param {function(...[*])} slotFunction The slot.
 * @param {Object=} opt_this Optional 'this' object for the slot.
 * @constructor
 */
nx.Slot = function(slotFunction, opt_this) {
  if (!nx.isFunction(slotFunction)) {
    // This should catch common misuse cases; not strictly necessary though.
    throw 'Provided slot function is not actually a function: ' + slotFunction;
  }
  this.function = slotFunction;
  this.this = opt_this;
};
/**
 * Checks if two slots are the same.
 * @param {nx.Slot} otherSlot A slot.
 * @return {boolean} True if the slots match, false otherwise.
 */
nx.Slot.prototype.equals = function(otherSlot) {
  return (this.function === otherSlot.function && this.this === otherSlot.this);
};
/**
 * Invokes the slot, forwarding any arguments to it.
 * @param {...*} var_args Arguments to forward.
 */
nx.Slot.prototype.invoke = function(var_args) {
  this.function.apply(this.this, arguments);
};
/**
 * A signal class, implementing the sigslot paradigm.
 * @constructor
 */
nx.Signal = function() {
  this.slots_ = [];
};
/**
 * Validates that an argument is actually a nx.Slot
 * @param {nx.Slot} slot
 * @private
 */
nx.Signal.prototype.assertSlot_ = function(slot) {
  if (!(slot instanceof nx.Slot)) {
    throw 'Provided value is not a slot: ' + slot;
  }
};
/**
 * Looks for a given slot in the list of those connected to this signal.
 * @param {nx.Slot} slot The slot to lookup.
 * @return {number} The index of the slot, or -1.
 * @private
 */
nx.Signal.prototype.find_ = function(slot) {
  this.assertSlot_(slot);
  for (var i = 0, length = this.slots_.length; i < length; ++i) {
    if (this.slots_[i].equals(slot)) {
      return i;
    }
  }
  return -1;
};
/**
 * Looks for a given slot in the list of those connected to this signal.
 * @param {nx.Slot} slot The slot to lookup.
 * @return {boolean} True if the slot is connected to this signal, false
 * otherwise.
 */
nx.Signal.prototype.isConnected = function(slot) {
  this.assertSlot_(slot);
  return (this.find_(slot) !== -1);
};
/**
 * Allows a function to be connected as a slot for this signal.
 * @param {nx.Slot} slot The slot to lookup.
 * @return {boolean} True if newly connected, false if already connected.
 */
nx.Signal.prototype.connect = function(slot) {
  this.assertSlot_(slot);
  if (this.find_(slot) === -1) {
    this.slots_.push(slot);
    return true;
  }
  return false;
};
/**
 * Invokes all connected slots, forwarding any arguments passed.
 * @param {...*} var_args The arguments.
 */
nx.Signal.prototype.emit = function(var_args) {
  for (var i = 0, length = this.slots_.length; i < length; ++i) {
    var currentSlot = this.slots_[i];
    currentSlot.invoke.apply(currentSlot, arguments);
  }
};
/**
 * Disconnects the provided slot, if it is already connected.
 * @param {nx.Slot} slot The slot to disconnect.
 * @return {boolean} True if found and removed, false if not found.
 */
nx.Signal.prototype.disconnect = function(slot) {
  this.assertSlot_(slot);
  var i = this.find_(slot);
  if (i !== -1) {
    this.slots_.splice(i, 1);
    return true;
  }
  return false;
};
/**
 * Disconnects all slots.
 */
nx.Signal.prototype.disconnectAll = function() {
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
 * @param {boolean=} opt_noChangeEvent If true, the onchange event not fired if
 * the data changes.
 * @return {boolean} True if the value changed, false if it is the same.
 */
nx.setField = function(element, value, opt_noChangeEvent) {
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
  // Fire the onchange event if needed
  if (changed && opt_noChangeEvent !== true) {
    if ('createEvent' in document) {
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', false, true);
      element.dispatchEvent(evt);
    }
    else {
      element.fireEvent('onchange');
    }
  }
  return changed;
};
/**
 * Sets the specified storage value.
 * @param {string} key The key to set.
 * @param {*} value The value.
 */
nx.storage.set = function(key, value) {
  var oldValue = nx.storage.get(key);
  window.localStorage.setItem(key, JSON.stringify(value));
  nx.storage.eventLocalChange.emit(key, value, oldValue);
  nx.storage.eventChange.emit(key, value, oldValue);
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
 * Returns a closure to invoke storage signals for this storage event.
 * @param {Event} storageEvent The LocalStorage event.
 * @return {function()} A function that triggers remote change signals.
 * @private
 */
nx.storage.onRemoteChangeFunction_ = function(storageEvent) {
  return function() {
    var key = storageEvent.key;
    var newValue = null;
    var oldValue = null;
    try {
      newValue = JSON.parse(storageEvent.newValue);
    } catch (e) {
      console.warn('Storage event: could not parse key (' +
          key + ') with value = ' + newValue);
      console.error(e);
    }
    try {
      oldValue = JSON.parse(storageEvent.oldValue);
    } catch (e) {
      console.warn('Storage event: could not parse key (' +
          key + ') with oldValue = ' + newValue);
      console.error(e);
    }
    nx.storage.eventRemoteChange.emit(key, newValue, oldValue);
    nx.storage.eventChange.emit(key, newValue, oldValue);
  };
};
/**
 * Invoked when there's a storage event.
 * @param {Event} storageEvent A localStorage event.
 * @private
 */
nx.storage.onStorageEvent_ = function(storageEvent) {
  // In IE, the actual storage value is not updated yet, so delay such that the
  // new value will be present when it executes.
  setTimeout(nx.storage.onRemoteChangeFunction_(storageEvent), 0);
};
/**
 * A signal emitted when any storage value changes.
 * Called with: key, newValue, oldValue
 * @type {nx.Signal}
 */
nx.storage.eventChange = new nx.Signal();
/**
 * A signal emitted when any storage value changes via local nx.storage.set().
 * Called with: key, newValue, oldValue
 * @type {nx.Signal}
 */
nx.storage.eventLocalChange = new nx.Signal();
/**
 * A signal emitted when any storage value changes from a remote location.
 * Called with: key, newValue, oldValue
 * @type {nx.Signal}
 */
nx.storage.eventRemoteChange = new nx.Signal();
/**
 * The current window, if running in overwolf.
 * @type {?ODKWindow}
 */
nx.odkWindow = null;
/**
 * A signal people can connect to for invoking initialization code.
 * @type {nx.Signal}
 */
nx.eventInitialize = new nx.Signal();
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
 * @export
 */
nx.initialize = function() {
  window.addEventListener('storage', nx.storage.onStorageEvent_, false);
  if (window.overwolf) {
    overwolf.windows.getCurrentWindow(nx.onCurrentWindow_);
  } else {
    nx.fireInitialize_();
  }
};
