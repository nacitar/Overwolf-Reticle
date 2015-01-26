goog.provide('overlay.settings');
goog.require('overlay.common');

/**
 * The form containing all the settings.
 * @type {Element}
 */
overlay.settings.form = null;

/**
 * Invoked when a form element's value changes.
 * @param {Element} element The element that changed.
 */
overlay.settings.onChange = function(element) {
  console.log('Changed: ' + element.id);
  var value = nx.getField(element);
  window.localStorage.setItem(element.id, JSON.stringify(value));
};

/**
 * Hides the settings window.
 */
overlay.settings.hide = function() {
  if (window.overwolf) {
    overwolf.windows.getCurrentWindow(function(result) {
      if (result.status === 'success') {
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
 * Initialization for the settings.
 * @param {string} formId The id for the form element.
 */
overlay.settings.init = function(formId) {
  if (!window.overwolf) {
    document.body.bgColor = 'black';
  }
  overlay.settings.form = document.getElementById(formId);

  nx.storage.addListener(overlay.settings.onStorageEvent);

  var length = overlay.settings.form.elements.length;
  for (var i = 0; i < length; ++i) {
    var element = overlay.settings.form.elements[i];
    if (element.id) {
      var value = overlay.common.getSetting(element.id);
      if (value !== null) {
        nx.setField(element, /** @type {boolean|string} */ (value));
      }
      element.onchange = function() { overlay.settings.onChange(this); };
    }
  }
};

