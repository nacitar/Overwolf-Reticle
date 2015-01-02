
/**
 * @param {*=} w
 * @param {*=} h
 * @return {Paper} The surface
 */
var Snap = function(w,h) {};


/**
 * @param {*=} ms
 * @param {*=} easing
 * @param {*=} callback 
 */
Element.prototype.animate = function(from, to, setter, ms, easing, callback) {};
/** @param {*=} value */
Element.prototype.attr = function(params, value) {};
Element.prototype.stop = function() {};
/**
 * @public {Node}
 */
Element.prototype.node = null;

/**
 * @constructor
 */
var Paper = function() {};

/**
 * @return {Element} the group
 */
Paper.prototype.group = function() {};
/**
 * @return {Element} the circle
 */
Paper.prototype.circle = function() {};
/**
 * @return {Element} the rect
 */
Paper.prototype.rect = function() {};
/**
 * @return {Element} the image
 */
Paper.prototype.image = function() {};
/**
 * @public {Node}
 */
Paper.prototype.node = null;
