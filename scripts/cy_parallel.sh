#! /usr/bin/env bash
# adapted from: https://gist.github.com/mjambon/79adfc5cf6b11252e78b75df50793f24
set -eu

pids=()
CY_TEST_FILES=$( ls cypress/e2e/**/*.js )
BUILD_ID=$( date +%s )
echo "Test start: $( date )" > nohup.out

for file in $CY_TEST_FILES; do

    # check if on mac
    if uname | grep -q Darwin; then

        bash -lic 'nohup npm run test:scy & echo $! >> run.pids'
        # echo "New pid: $new_pid"
        # pids+=(new_pid)

    # If not, we're probably on Github Actions and need to have a custom xvfb command
    # see: https://github.com/cypress-io/xvfb/issues/98
    else
        xvfb-run -a npm run test:scy &
        pids+=($!)
    fi

    
done

pids_string=$( cat run.pids )
pids=($pids_string)

for pid in "${pids[@]}"; do
    
    while ps -p $pid > /dev/null; do
        echo "$pid is running, waiting"
        sleep 5
        # Do something knowing the pid exists, i.e. the process with $PID is running
    done

done

echo "Parallel testing completed"

## ###############
## Check if test errored
## ###############

if ! grep -q "TEST FAILED" nohup.out; then
    echo "No failed tests, all good"
else
    echo "Tests failed! Logs:"
    cat nohup.out
fi