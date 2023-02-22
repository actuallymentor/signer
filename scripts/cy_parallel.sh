#! /usr/bin/env bash
# adapted from: https://gist.github.com/mjambon/79adfc5cf6b11252e78b75df50793f24
set -eu

pids=()
CY_TEST_FILES=$( ls cypress/e2e/**/*.js )

if uname | grep -q Darwin; then
    echo -e "\n\n#####################################################################"
    echo "Make sure the functions emulator and the sorry-cypress director are running:"
    echo "docker ps && docker run -p 1234:1234 agoldis/sorry-cypress-director"
    echo "cd functions && npm run serve"
    echo -e "#####################################################################\n\n"
fi
for file in $CY_TEST_FILES; do

    # check if on mac
    if uname | grep -q Darwin; then

        echo "Assuming we are on local macbook"
        npm run test:scy -- $file &
        pids+=($!)

    # If not, we're probably on Github Actions and need to have a custom xvfb command
    # see: https://github.com/cypress-io/xvfb/issues/98
    else
        echo "Assuming we are on Github Actions"
        xvfb-run -a npm run test:scy -- $file &
        pids+=($!)
    fi

    
done

for pid in "${pids[@]}"; do
    wait "$pid"
done

echo "Parallel testing completed"