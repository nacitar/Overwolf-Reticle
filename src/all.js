
// If generating deps:
//   python closure-library/closure/bin/build/depswriter.py \
//       --root_with_prefix="src ../../../../src" \
//       --output_file=src/deps.js

(function() {
  // relative to closure's base.js
  var here = '../../../../src/';
  goog.addDependency(here + 'nx/common.js', ['nx'], [], false);
  goog.addDependency(here + 'nx/overwolf.js', ['nx.ow'], ['nx'], false);
  goog.addDependency(here + 'nx/svg.js', ['nx.svg'], [], false);
  goog.addDependency(here + 'other/overlay.js', ['overlay'],
      ['nx', 'nx.ow', 'nx.svg'], false);
})();

goog.require('nx');
goog.require('nx.ow');
goog.require('nx.svg');
goog.require('overlay');
