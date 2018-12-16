import Settings from './Settings';
import World from '../../core/World';

let world;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    world = new World(p5, Settings);
    world.createInitialWalkers();

    // Set up initial (seed) particles for clusters
    createInitialClusters();
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    world.iterate();
    world.draw();
  }

  function resetWorld() {
    world.removeAll();
    world.createInitialWalkers();
    createInitialClusters();
  }

  function createInitialClusters() {
    let params = [];

    switch (Settings.InitialClusterType) {
      // Single particle in center of screen
      case 'Point':
        params.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        });

        break;

      // Series of particles evenly spaced in a circle around center of screen
      case 'Ring':
        let radius = 100,
          numParticles = 20;

        for (let i = 0; i < numParticles; i++) {
          params.push({
            x: window.innerWidth / 2 + radius * Math.cos((360 / numParticles) * i * Math.PI / 180),
            y: window.innerHeight / 2 + radius * Math.sin((360 / numParticles) * i * Math.PI / 180)
          });
        }

        break;

      // Individual particles randomly distributed across entire screen
      case 'Random':
        for (let i = 0; i < 5; i++) {
          params.push({
            x: p5.random(world.edges.left, world.edges.right),
            y: p5.random(world.edges.top, world.edges.bottom)
          });
        }

        break;
    }

    world.createClusterFromParams(params);
  }

  // Key handler ---------------------------------------------------------
  p5.keyReleased = function () {
    switch (p5.key) {
      case ' ':
        world.togglePause();
        break;

      case 'w':
        world.toggleShowWalkers();
        break;

      case 'c':
        world.toggleShowClusters();
        break;

      case 'r':
        resetWorld();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);