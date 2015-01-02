#!/bin/bash
3rdparty/closure-linter/closure_linter/gjslint.py --check_html \
  overlay/files/index.html src/{.,nx,other}/*.js
