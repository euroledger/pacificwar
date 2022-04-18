# pacificwar

This program runs the Engagement Scenario 1 of GMT Games' *Pacific War* (designer: Mark Herman)

As of May 1st, the app runs only the first scenario but the intention is to add the other Engagement Scenarios in due course.

The app will do all of of the player tasks such as task force creation, air strikes (including target allocation and prioritisation), searches, flak, CAP etc. and print out final stats for the single run.

Additionally as many runs as is desirable can be run as a Monte Carlo simulation and then, once done, the app will print out
statistics for the whole set of runs.

# Pre-Requisites

The app has been tested on Windows and Linux. 

You will need to install the following:
  - git
  - yarn
  - npm

Download and run the code by doing the following:

1. git clone https://github.com/euroledger/pacificwar.git

2. cd pacificwar

3. yarn install 

4. runapp.bat (windows),
or
5. runapp.sh (linux)

# Unit Tests

There are extensive unit tests for the app. These can be run by executing the following command:

- yarn test --silent --verbose





