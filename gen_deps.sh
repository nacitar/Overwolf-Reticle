#!/bin/bash
python 3rdparty/closure-library/closure/bin/build/depswriter.py \
       --root_with_prefix="overlay/files/src ../../../src" \
       --output_file="overlay/files/src/deps.js"
