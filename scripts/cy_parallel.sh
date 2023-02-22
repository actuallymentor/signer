#! /usr/bin/env bash
# adapted from: https://gist.github.com/mjambon/79adfc5cf6b11252e78b75df50793f24
set -eu

pids=()
CY_TEST_FILES=$( ls cypress/e2e/**/*.js )

for file in $CY_TEST_FILES; do
    npm run test:scy -- $file &
    pids+=($!)
done

for pid in "${pids[@]}"; do
    wait "$pid"
done
