#!/bin/bash
cd "$(dirname "$0")" || exit 1

java -jar closure-compiler/build/compiler.jar \
    --compilation_level ADVANCED_OPTIMIZATIONS \
    --warning_level VERBOSE \
    --manage_closure_dependencies true \
    --only_closure_dependencies true \
    --closure_entry_point=overlay \
    --js_output_file reticle/files/overwolf-reticle.js \
    src/nx/*.js \
    src/other/*.js \
    --externs externs/jscolor.js \
    --externs externs/overwolf.js \
    --externs externs/snap.js
#--create_source_map reticle/files/overwolf-reticle.map
