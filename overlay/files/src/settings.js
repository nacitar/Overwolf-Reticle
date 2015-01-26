goog.provide('overlay.settings');

overlay.settings.form = null;

overlay.settings.onChange = function(element) {
  console.log("Changed: " + element.id);
  var value = nx.getField(element);
  window.localStorage.setItem(element.id, JSON.stringify(value));
};

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

overlay.settings.hide = function() {
  if (window.overwolf) {
    overwolf.windows.getCurrentWindow(function(result) {
      if (result.status === 'success') {
        overwolf.windows.minimize(result.window.id);
      }
    });
  }
};
