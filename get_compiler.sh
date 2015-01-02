#!/bin/bash
cd "$(dirname "$0")" || exit 1

if ! [ -d "closure-compiler" ]; then
  git clone https://github.com/google/closure-compiler.git closure-compiler
fi

cd "closure-compiler" || exit 3
git pull
ant jar
