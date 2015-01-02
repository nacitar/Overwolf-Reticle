#!/bin/bash

# REQUIRES: git, ant

cd "$(dirname "$0")" || exit 1

pushd "3rdparty" || exit 2

if ! [ -d "closure-compiler" ]; then
  git clone https://github.com/google/closure-compiler.git closure-compiler
fi

pushd "closure-compiler" || exit 3
git pull
ant jar
popd


if ! [ -d "closure-library" ]; then
  git clone https://github.com/google/closure-library.git closure-library
fi

pushd "closure-library" || exit 4
git pull
popd

if ! [ -d "closure-linter" ]; then
  svn checkout http://closure-linter.googlecode.com/svn/trunk closure-linter
fi
pushd "closure-linter" || exit 5
svn update
popd
