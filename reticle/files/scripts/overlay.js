
// TODO: google closure?  dojo?
var overlay = overlay || {};

/**
 * The overlay's reticle object.
 * @public {nx.Reticle}
 */
overlay.reticle = null;
/**
 * The overlay's storage node for its settings.
 * @public {nx.StorageNode}
 */
overlay.settings = null;
/**
 * Renders the reticle.
 */
overlay.renderReticle = function() {
  console.log('Rendering reticle.');
  overlay.reticle.render(overlay.settings.data);
};
/**
 * Triggered then a hotkey is pressed.
 * @param {string} name The name of the hotkey that was triggered.
 */
overlay.onHotkeyPressed = function(name) {
  if (name == 'reticle_menu') {
    console.log('Reticle menu hotkey triggered.');
    overlay.settings.setVisible(true);
  }
};
/**
 * Invoked when the reticle settings have changed.
 */
overlay.onDataChanged = function() {
  console.log('Data changed.');
  overlay.renderReticle();
};
/**
 * Invoked when the window is resized.
 */
overlay.onResize = function() {
  console.log('Window resized.');
  overlay.renderReticle();
};
/**
 * Invoked when game state changes.  Used when in overwolf.
 */
overlay.onGameStateChanged = function() {
  // If it was visible outside the game, we would want to see settings.
  overlay.settings.setVisible(!nx.ow.isGameFocused());
  var width, height;
  if (nx.ow.gameInfo()) {
    width = nx.ow.gameInfo().width;
    height = nx.ow.gameInfo().height;
  } else {
    width = window.screen.width;
    height = window.screen.height;
  }
  // Resize the window, triggering onResize()
  nx.ow.setWindowRect(overlay.windowId, 0, 0, width, height);
};
/**
 * Hides the settings window if you're in a game.
 */
overlay.hideSettings = function() {
  if (nx.ow.isGameFocused()) {
    overlay.settings.setVisible(false);
  }
};
/**
 * Invoked when a window is retrieved; used to retrieve initial game
 * information and to use it to resize the overlay window.
 * @param {string} name The name of the window that was retrieved.
 * @param {string} id The id of the window that was retrieved.
 */
overlay.onWindowRetrieved = function(name, id) {
  if (name != 'MainWindow' || overlay.windowId) return;
  overlay.windowId = id;
  // GameState handler
  nx.ow.setGameStateChangedCallback(overlay.onGameStateChanged);
  // Get initial state, which also triggers the change event.
  nx.ow.updateGameInfo();
};
/**
 * Initializes the reticle overlay.
 * @param {string} surfaceId The id of the SVG surface element.
 * @param {string} storageKey The storage key to store the settings under.
 * @param {string} nodeId The id of a parent node of the settings fields.
 */
overlay.init = function(surfaceId, storageKey, nodeId) {
  overlay.reticle = new nx.Reticle(surfaceId);
  overlay.settings = new nx.StorageNode(storageKey, nodeId);
  overlay.settings.accessors().forEach(function(accessor) {
    if (accessor.fieldType() == nx.FieldType.COLOR) {
      var element = accessor.element();
      // If doing this before auto-binding, manual bind.
      if (!element.color) {
        element.color = new jscolor.color(element);
      }
      // Use our settings
      nx.copyProperties(element.color, {
        hash: true,
        pickerClosable: true,
        onImmediateChange: nx.bind(overlay.settings, 'onDataChanged')
      });
      // Force reprocessing.
      accessor.set(accessor.get());
    }
  });
  // Resize handler
  window.addEventListener('resize', overlay.onResize);

  overlay.settings.load();
  overlay.settings.setOnChangeListener(overlay.onDataChanged);

  if (nx.ow.isInOverwolf()) {
    // Register hotkey
    overwolf.settings.registerHotKey('reticle_menu', function(result) {
        if (result.status == 'success') {
          overlay.onHotkeyPressed('reticle_menu');
        }
    });
    nx.ow.getWindowId('MainWindow', overlay.onWindowRetrieved);
  } else {
    // Initial view status
    overlay.settings.setVisible(true);
  }
  // Initial render
  overlay.renderReticle();
};
