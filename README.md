# Pacific War Engagement Scenario App

This program runs Engagement Scenario 1 of GMT Games' *Pacific War* (designer: Mark Herman)

As of May 1st, the app runs only the first scenario but the intention is to add the other Engagement Scenarios in due course.

The app will do all of of the player tasks such as task force creation, air strikes (including target allocation and prioritisation), searches, flak, CAP etc. and print out final stats for the single run.

Additionally as many runs as is desirable can be run as a Monte Carlo simulation and then, once done, the app will print out
statistics for the whole set of runs.

My motivation for writing this program derives from several objectives:

1. To learn the rules to a (very) high level of understanding
2. To provide detailed AARs of all the scenarios to help others learn the game
3. To accept the challenge of codifying a significant chunk of the Pacific War rule set is
4. To be able to run Monte Carlo simulations of the scenarios to get some data on the accuracy of the game
5. To (Maybe, big if) be able to write an AI for the battle scenarios to aid with solo play

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

The app will allocate targets for the air strikes in the two battle cycles. The allocation is semi-random in the sense that it will always prioritise battleships and air units at Pearl Harbor over other targets, but the allocation of targets and priorities will vary from run to run.

Air Unit targeting for first battle cycle
1. This algorithm targets between 1 and 3 air units (in total) and 6 battleships (per attacking unit)
2. Each Japanese air unit attacking US air units will target the one US air unit not already targeted containing the most steps 
3. The remaining (3-5) Japanese air units attacking US naval units will target the same group of 6 battleships
4. To prevent hits bunching on one or two ships the order of targeting amongst the six is reversed for each air unit
5. The Shokaku carrier air group will always conduct the first air attack to maximise the advantage of the -5 DRM (since it is a six step L2 air unit)

In the second battle cycle the app will not allocate (battleship) targets which are already damaged with 4 hits or greater and will try to prioritise according to whatever targets will give the best chance of achieving the VPs required for the Japanese to win the scenario.
1. Alerted Air Units; CAP unit is strongest F unit (anti-air) - will select B unit if no F units available


## Searches 

The US will search for the Japanese task forces in the advantage movement phase of Battle Cycle II and if it detects them will launch an air strike against the two Japanese Carrier Task Forces in the disadvantage air mission phase (if any elegible air units remain)

## App Design Notes

# Language

# Data Load
Uses Excel - CSV files
In the /resources folder there is an Excel spreadsheet - one per scenario - which contains the data for all units in the scenario.
This is then exported to a comma-separated file (CSV), and it is this file that is loaded by the app at the start of the run, which uses the data to create all the unit objects for the scenario.

# Unit tests

Uses Jest

## Possible Future Enhancements

1. Remaining Engagement Scenarios
2. Possibly Battle Scenario (this will need a decent AI)
3. Database or other persistent storage to store the results of runs for comparative purposes 
4. A UI showing map, counters etc. would be nice







