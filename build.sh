#!/bin/bash
cd "$(dirname "$0")" || exit 1

function doBuild() {
  local entry="$1"; shift
  local outfile="$1"; shift
  java -jar 3rdparty/closure-compiler/build/compiler.jar \
      --compilation_level ADVANCED_OPTIMIZATIONS \
      --warning_level VERBOSE \
      --language_in ECMASCRIPT5 \
      --manage_closure_dependencies true \
      --only_closure_dependencies true \
      --generate_exports \
      --closure_entry_point="$entry" \
      --js_output_file overlay/files/"$outfile".js \
      --create_source_map overlay/files/"$outfile".map \
      overlay/files/3rdparty/closure/goog/base.js \
      overlay/files/src/nx/*.js \
      overlay/files/src/*.js \
      --externs externs/jscolor.js \
      --externs externs/overwolf.js \
      --externs externs/snap.js
}

doBuild "overlay" "overlay-compiled"
doBuild "overlay.settings" "settings-compiled"

