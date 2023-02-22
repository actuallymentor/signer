#! /usr/bin/env bash
# adapted from: https://gist.github.com/mjambon/79adfc5cf6b11252e78b75df50793f24
set -eu

pids=()
CY_TEST_FILES=$( ls cypress/e2e/**/*.js )


for file in $CY_TEST_FILES; do

    # check if on mac
    if uname | grep -q Darwin; then

        npm run test:scy &
        pids+=($!)

    # If not, we're probably on Github Actions and need to have a custom xvfb command
    # see: https://github.com/cypress-io/xvfb/issues/98
    else
        xvfb-run -a npm run test:scy &
        pids+=($!)
    fi

    
done

for pid in "${pids[@]}"; do
    wait "$pid"
done

echo "Parallel testing completed"