goog.provide('overlay.settings');

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
 * Initialization for the settings.
 * @param {string} formId The id for the form element.
 */
overlay.settings.init = function(formId) {
  overlay.settings.form = document.getElementById(formId);
  var length = overlay.settings.form.elements.length;
  for (var i = 0; i < length; ++i) {
    var element = overlay.settings.form.elements[i];
    if (element.id) {
      var value = JSON.parse(window.localStorage.getItem(element.id));
      if (value !== null) {
        nx.setField(element, value);
      }
      element.onchange = function() { overlay.settings.onChange(this); };
    }
  }
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
