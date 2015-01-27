goog.provide('overlay.settings');
goog.require('overlay.common');

/**
 * The form containing all the settings.
 * @type {Element}
 */
overlay.settings.form = null;
/**
 * The element into which we will import/export settings data.
 * @type {Element}
 */
overlay.settings.dataTransfer = null;
/**
 * The element into which we will place save labels.
 * @type {Element}
 */
overlay.settings.saveLabel = null;
/**
 * Invoked when a form element's value changes.
 * @param {Element} element The element that changed.
 */
overlay.settings.onChange = function(element) {
  console.log('Changed: ' + element.id);
  var value = nx.getField(element);
  nx.storage.set(element.id, value);
};
/**
 * Hides the settings window.
 */
overlay.settings.hide = function() {
  if (window.overwolf) {
    overwolf.windows.getCurrentWindow(function(result) {
      if (result.status === 'success') {
        // TODO: close?
        overwolf.windows.minimize(result.window.id);
      }
    });
  }
};
/**
 * Triggered when stored data changes.
 * @param {Event} storageEvent The event information.
 */
overlay.settings.onStorageEvent = function(storageEvent) {
  var key = storageEvent.key;
  console.log('Got storage event: ' + key);
  var element = document.getElementById(key);
  nx.setField(element,
      /** @type {boolean|string} */ (JSON.parse(storageEvent.newValue)));
};
/**
 * Invokes a callback for each field in the settings form that has a id.
 * @param {function(...[*])} callback The callback to invoke.
 * @param {Object=} opt_this The object to use as 'this'.
 */
overlay.settings.forEachField = function(callback, opt_this) {
  var length = overlay.settings.form.elements.length;
  for (var i = 0; i < length; ++i) {
    var element = overlay.settings.form.elements[i];
    if (element.id) {
      callback.apply(opt_this, [element]);
    }
  }
};
/**
 * Sets the specified field to its current stored value, first checking for a
 * new value in the optionally passed object.  Invokes the element's onchange
 * handler if present and a change was made.
 * @param {Element} element The form field.
 * @param {Object=} opt_data The optional new data.
 * @return {boolean} True if the field now has a new value, false otherwise.
 */
overlay.settings.setField = function(element, opt_data) {
  var changed = false;
  var key = element.id;
  opt_data = nx.default(opt_data, {});
  if (key) {
    var value = nx.default(opt_data[key], overlay.common.getSetting(key));
    if (value !== null) {
      changed = nx.setField(element, /** @type {boolean|string} */ (value));
      if (changed && element.onchange) {
        element.onchange();
      }
    }
  }
  return changed;
};
/**
 * Applies the settings of the provided object.
 * @param {?Object} data The object.
 */
overlay.settings.apply = function(data) {
  overlay.settings.forEachField(function (element) {
    overlay.settings.setField(element, this);
  }, data);
};

/**
 * Retrieves the current settings as an object.
 * @return {Object} The settings object.
 */
overlay.settings.retrieve = function() {
  var data = {};
  overlay.settings.forEachField(function (element) {
      this[element.id] = nx.getField(element);
  }, data);
  return data;
};
/**
 * The prefix to put on storage names for saved settings.
 * @type {string}
 */
overlay.settings.storagePrefix = 'saved_';
/**
 * Saves the current settings under the provided label.
 * @param {string} label The label.
 */
overlay.settings.saveData = function(label) {
  label = nx.default(label, '');
  if (label !== '') {
    var data = overlay.settings.retrieve();
    nx.storage.set(overlay.settings.storagePrefix + label, data);
    alert('Saved - ' + label);
  } else {
    alert('ERROR: invalid label - ' + label);
  }
};
/**
 * Loads settings stored under the provided label; if either no label or an
 * empty label is provided, the default settings are loaded.
 * @param {string=} label The label.
 */
overlay.settings.loadData = function(label) {
  label = nx.default(label, '');
  if (label !== '') {
    var data = nx.storage.get(overlay.settings.storagePrefix + label);
    if (data === null) {
      alert('ERROR: no data found under label - ' + label);
      return;
    }
    overlay.settings.apply(data);
    alert('Loaded - ' + label);
  } else {
    alert('ERROR: invalid label - ' + label);
  }
};

/**
 * Exports the current settings as JSON for the user to share.
 */
overlay.settings.export = function() {
  console.log('Opening export prompt.');
  nx.setField(overlay.settings.dataTransfer,
      JSON.stringify(overlay.settings.retrieve()));
  alert('Data exported.');
  overlay.settings.dataTransfer.select();
};
/**
 * Imports JSON settings to be used.
 */
overlay.settings.import = function() {
  var data = null;
  try {
    data = JSON.parse(nx.getField(overlay.settings.dataTransfer));
  } catch (e) {
  }
  if (data instanceof Object) {
    overlay.settings.apply(data);
    alert('Data imported.');
  } else {
    alert('ERROR: Provided data is not valid JSON for an Object.');
  }
};
/**
 * Saves the current settings to the label held by saveLabel.
 */
overlay.settings.save = function() {
  overlay.settings.saveData(nx.getField(overlay.settings.saveLabel));
};
/**
 * Loads the settings stored under saveLabel.
 */
overlay.settings.load = function() {
  overlay.settings.loadData(nx.getField(overlay.settings.saveLabel));
};
/**
 * Resets the settings to default.
 */
overlay.settings.defaults = function() {
  overlay.settings.apply(overlay.common.defaultSettings);
  alert('Default settings restored.');
};
/**
 * Initialization for the settings.
 * @param {string} formId The id for the form element.
 */
overlay.settings.init = function(formId) {
  if (!window.overwolf) {
    document.body.bgColor = 'black';
  }
  overlay.settings.form = document.getElementById(formId);
  overlay.settings.dataTransfer = document.getElementById('dataTransfer');
  overlay.settings.saveLabel = document.getElementById('saveLabel');

  nx.storage.addListener(overlay.settings.onStorageEvent);

  overlay.settings.forEachField(function (element) {
    overlay.settings.setField(element);
    element.onchange = function() { overlay.settings.onChange(this); };
  });
};

