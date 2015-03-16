WaterlooAnswersAngular
======================

The web client for the Waterloo Answers API. [Project Management is done through Pivotal Tracker](https://www.pivotaltracker.com/n/projects/1282866)

## Install Notes

1. Clone this repo and navigate to the project root.
2. Go to `APIFactory.js` and change `urlBase` value to be "http://askuw.sahiljain.ca/api". If you want to run a local version of the API, [read these instructions](https://github.com/sahiljain/WaterlooAnswersAPI/blob/master/README.md). You'll have to work with the `public` submodule of the node server instead of this repo directly.
3. Start a local HTTP server in this folder (easiest way is to do the following steps).
4. Install [Node](http://nodejs.org/).
5. Run `npm install -g http-server`.
6. Run `http-server`
7. Go to *localhost:8080* in your browser!

## How to Contribute

1. Fork this repo
2. Make changes
2. Make a pull request!
