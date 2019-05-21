# Relativity4GPS Simulation

This project was made for a physics class at I.S.E.P. It tries to show the effects of relativity on the GNSS satellites or any other satellite of the earth.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The software you will need to run the simulation local:

* npm
* node.js

### Installing

To install the packages run the following command at the root of your file

```
npm install
```

### Running for developpement

Use the command:

```
npm run dev
```

It will automatically rebuild at each changes in the js files and lauch a serveur at localhost:10001

## Deployment

To deploy you need the build the project with the following command

```
npm run build
```

And you have to serve the content of the dist folder. Opening the index.html won't be enough !

## Built With

* [nodejs](https://nodejs.org/en/) - Javascript interpreter
* [npm](https://www.npmjs.com/) - Dependency Management
* [math.js](https://mathjs.org/) - Extensive math library
* [p5.js](https://p5js.org/) - Software sketchbook

## Authors

* [Ponsaille](https://github.com/Ponsaille)
