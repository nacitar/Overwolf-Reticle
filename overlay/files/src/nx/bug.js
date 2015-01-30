goog.provide('nx.bug');

/**
 * Overwolf has a bug where CSS does not properly apply to everything when the
 * state changes, yet moving the mouse around affected elements fixes it.  This
 * function works around this broken state by forcing the provided element to
 * recalculate its size while its display state is 'none', then swapping it
 * back to its original state.
 * @param {Element} element The element whose style needs redrawn, or a parent.
 */
nx.bug.redrawStyle = function(element) {
  var display = element.style.display;
  element.style.display = 'none';
  var forceCalculate = element.offsetHeight;
  element.style.display = display;
};
