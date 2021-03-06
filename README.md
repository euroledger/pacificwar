# Pacific War Engagement Scenario App

This program runs the Engagement Scenarios of GMT Games' *Pacific War* (designer: Mark Herman)

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


# Installation Instructions

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

Air Unit targeting for first battle cycle
1. This algorithm targets between 1 and 3 air units and 6 battleships 
2. Each Japanese air unit attacking US air units will target the one US air unit not already targeted containing the most steps 
3. The remaining (3-5) Japanese air units attacking US naval units will target the same group of 6 battleships
4. To prevent hits bunching on one or two ships the order of targeting amongst the six is reversed for each air unit

In the second battle cycle the app will not allocate targets already damaged with 4 hits or greater and will try to prioritise according to whatever targets will give the best chance of achieving the VPs required for the Japanese to win the scenario.

## Searches 

The US will search for the Japanese task forces in the advantage movement phase of Battle Cycle II and if it detects them will launch an air strike against the two Japanese Carrier Task Forces in the disadvantage air mission phase.

# App Design Notes

## Language

Uses Typescript - the type safe version of Javascript.

## Data Load

Uses Excel - CSV files. In the /resources folder there is an Excel spreadsheet - one per scenario - which contains the data for all units in the scenario. This is then exported to a comma-separated file (CSV), and it is this file that is loaded by the app at the start of the run, which uses the data to create all the unit objects for the scenario.

Unit tests
Uses Jest

Possible Future Enhancements
Remaining Engagement Scenarios
Possibly Battle Scenario (this will need a decent AI)
Database or other persistent storage to store the results of runs for comparative purposes, and some persistence mechanism
to be able to save and load games (json-server maybe?)

A UI showing map, counters etc. would be nice
## Contributors

If any developers wish to contribute to this project, comments, suggestions and code submissions are welcome. Please feel free
to submit Pull Requests.





