# Pacific War Engagement Scenario App

This program runs Engagement Scenario 1 of GMT Games' *Pacific War* (designer: Mark Herman)

As of May 1st, the app runs only the first scenario but the intention is to add the other Engagement Scenarios in due course.

The app will do all of of the player tasks such as task force creation, air strikes (including target allocation and prioritisation), searches, flak, CAP etc. and print out final stats for the single run.

Additionally as many runs as is desirable can be run as a Monte Carlo simulation and then, once done, the app will print out
statistics for the whole set of runs.

# Pre-Requisites

The app has been tested on Windows and Linux. 

You will need to install the following:
  - git
      -> Download and Install instructions here: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
  - node/npm
      -> Download and Install instructions here: https://nodejs.org/en/download/
  - yarn
      -> Use npm from command line: npm install --global yarn


Download and run the code by doing the following (from the command line):

1. git clone https://github.com/euroledger/pacificwar.git

2. cd pacificwar

3. yarn install 

4. runapp.bat (windows),
or
5. runapp.sh (linux)

# Unit Tests

There are extensive unit tests for the app. These can be run by executing the following command:

- yarn test --silent --verbose

# What the App does

## Task Force Creation

The app will allocate the Japanese ships to the two task forces. It is semi-random but adheres to the rules concerning core and screen, capital ship limit etc.

## Air Strikes 

The app will allocate targets for the air strikes in th two battle cycles. The allocation is semi-random in the sense that it will always prioritise battleships and air units at Pearl Harbor over other targets, but the allocation of targets and priorities will vary from run to run. 

In the second battle cycle the app will not allocate targets already damaged with 4 hits or greater and will try to prioritise according to whatever targets will give the best chance of achieving the VPs required for the Japanese to win the scenario.

## Searches 

The US will search for the Japanese task forces in the disadvantage phase of Battle Cycle II and if it detects them will launch an air strike against the two Japanese Carrier Task Forces







