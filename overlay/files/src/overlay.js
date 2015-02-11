goog.provide('overlay');
goog.require('nx');
goog.require('nx.Reticle');
goog.require('overlay.common');

/**
 * The settings window
 * @type {?ODKWindow}
 */
overlay.settingsWindow = null;
/**
 * The nx.Reticle object.
 * @type {nx.Reticle}
 */
overlay.reticle = null;
/**
 * Renders the reticle with the current settings.
 */
overlay.render = function() {
  overlay.reticle.render();
};
/**
 * Triggered when stored data changes.
 * @param {string} key The key whose value changed.
 * @param {*} newValue The new value.
 * @param {*} oldValue The old value.
 */
overlay.onStorageChanged = function(key, newValue, oldValue) {
  if (overlay.common.defaultReticleSettings.hasOwnProperty(key)) {
    // In IE, the actual storage value is not updated yet, so delay rendering
    // such that the new value will be present when it executes.
    setTimeout(overlay.render, 0);
  }
  // So we can position the window if the offset is changed.
  if (overlay.common.defaultWindowSettings.hasOwnProperty(key)) {
    overlay.positionWindow();
  }
};
/**
 * Opens the settings window; the first time this is called, the settings
 * window simply loads and hides itself.
 */
overlay.openSettings = function() {
  console.log('Attempting to open settings.');
  if (overlay.settingsWindow) {
    overwolf.windows.restore(overlay.settingsWindow.id);
  }
};
/**
 * Triggered then a hotkey is pressed.
 * @param {string} name The name of the hotkey that was triggered.
 */
overlay.onHotkeyPressed = function(name) {
  if (name === 'reticleSettings') {
    overlay.openSettings();
  }
};
/**
 * Positions the overlay window so that it is centered.
 */
overlay.positionWindow = function() {
  var dest;
  if (!overlay.common.game || !overlay.common.game.isRunning) {
    console.log('Positioning: using screen.');
    dest = window.screen;
  } else {
    console.log('Positioning: using game window.');
    dest = overlay.common.game;
  }
  // Get the coordinate on which the reticle should center.
  var destX = dest.width *
      /** @type {number} */ (overlay.common.getSetting('xOffsetPercent')) / 100;
  var destY = dest.height *
      /** @type {number} */ (overlay.common.getSetting('yOffsetPercent')) / 100;
  // Calculate the reticle window position needed to center.
  var x = parseInt(destX - nx.odkWindow.width / 2, 10);
  var y = parseInt(destY - nx.odkWindow.height / 2, 10);
  // Position it.
  overwolf.windows.changePosition(nx.odkWindow.id, x, y);
};
/**
 * Initializes the overlay.
 */
overlay.initialize = function() {
  if (window.overwolf) {
    overlay.common.eventGameInfo.connect(new nx.Slot(overlay.positionWindow));
    overlay.common.listenForGameInfo();

    overwolf.windows.obtainDeclaredWindow('SettingsWindow', function(result) {
        if (result.status === 'success') {
          overlay.settingsWindow = result.window;
          overlay.openSettings();
        }
    });
    overlay.common.registerHotkey('reticleSettings', overlay.onHotkeyPressed);
  } else {
    document.body.bgColor = 'black';
  }
  overlay.reticle = new nx.Reticle('reticleSurface');
  nx.storage.eventChange.connect(new nx.Slot(
      /** @type {function(...*)} */ (overlay.onStorageChanged)));
  overlay.reticle.setDataCallback(overlay.common.getSetting);
  overlay.render();
};

// Register initialization code.
nx.eventInitialize.connect(new nx.Slot(overlay.initialize));
