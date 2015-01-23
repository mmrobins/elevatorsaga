// Messing the floor indicators didn't go well
// Worked for level 13
{
  init: function(elevators, floors) {
    var rebalanceQueue = function(e) {
      console.log("Floor: " + e.currentFloor())
      console.log("Before rebalance: " + e.destinationQueue)
      console.log("Going up: " + e.goingUpIndicator());
      console.log("Going down: " + e.goingDownIndicator());
      e.destinationQueue = _.uniq(e.destinationQueue);
        var above;
        var below;
      above = _.filter(e.destinationQueue, function(q) {
        return e.currentFloor() <= q;
      });
      below = _.filter(e.destinationQueue, function(q) {
        return e.currentFloor() > q;
      });
      if (e.destinationQueue[0] > e.currentFloor() || e.destinationQueue[0] === e.currentFloor() && e.destinationQueue[1] > e.currentFloor()) {
        e.goingUpIndicator(true);
        e.goingDownIndicator(false);
        e.destinationQueue = above.sort().concat(below.sort().reverse());
      };
      if (e.destinationQueue[0] < e.currentFloor() || e.destinationQueue[0] === e.currentFloor() && e.destinationQueue[1] < e.currentFloor()) {
        e.goingUpIndicator(false);
        e.goingDownIndicator(true);
        e.destinationQueue = below.sort().reverse().concat(above.sort());
      };

      console.log("After rebalance: " + e.destinationQueue)
      console.log("Going up: " + e.goingUpIndicator());
      console.log("Going down: " + e.goingDownIndicator());
      e.checkDestinationQueue();
    };
    var closestUnfullElevatorGoingCorrectDirection = function(els, floor, ev) {
       var closeElevators = _.sortBy(els, function(ele) {
         return Math.abs(floor - ele.currentFloor());
       });
       var correctDirection = _.filter(closeElevators, function(ele) { 
         if (ev === 'up_button_pressed') {
           return ele.currentFloor() <= floor && ele.goingUpIndicator();
         } else if (ev === 'down_button_pressed') {
           return ele.currentFloor() >= floor && ele.goingDownIndicator();
         };
       });
       var unfull = _.filter(correctDirection, function(ele) { 
         return ele.loadFactor() < 1; 
       });
       if (unfull.length === 0) {
         return shortestQueueElevator(els, floor);
       } else {
         return unfull[0];
       }
    };
    var shortestQueueElevator = function(els, floor) {
       var shortest = _.sortBy(els, function(ele) {
         var queueLength = ele.destinationQueue.length.toString();
         var floorDistance = Math.abs(floor - ele.currentFloor()).toString();
         var sortString =  queueLength + floorDistance;
         return sortString;
       });
       //console.log("shortest from floor" + floor)
       //console.log(_.map(shortest, function(e) { return [e.destinationQueue.length, e.currentFloor()]; }  ))
       return shortest[0];
    };
    window.elevators = elevators;
    window.floors = floors;
    _.each(floors, function(f) {
      _.each(['up_button_pressed', 'down_button_pressed'], function(ev) {
        f.on(ev, function() {
          var e = closestUnfullElevatorGoingCorrectDirection(elevators, f.level, ev);
          e.goToFloor(f.level);
          rebalanceQueue(e);
        });
      });
    });
    elevators[3].on("idle", function() { elevators[3].goToFloor(5); });
    elevators.forEach(function(e) {
      e.on("idle", function() { 
        e.goToFloor(0); 
        e.goingDownIndicator(true);
        e.goingUpIndicator(true);
      });
      e.on("stopped_at_floor", function(floorNum) {
        if (e.currentFloor() === floors[floors.length - 1]) {
          e.goingUpIndicator(false);
          e.goingDownIndicator(true);
        }
        if (e.destinationQueue.length === 0 || e.destinationQueue.length === 1 && e.destinationQueue[0] === e.currentFloor()) {
          e.goingUpIndicator(true);
          e.goingDownIndicator(true);
        }
        console.log("Stopped at floor: " + e.currentFloor())
        console.log("Going up: " + e.goingUpIndicator());
        console.log("Going down: " + e.goingDownIndicator());
        console.log("Queue: " + e.destinationQueue);
      })

      e.on("floor_button_pressed", function(floorNum) {
        e.goToFloor(floorNum);
        rebalanceQueue(e);
      });
    });
  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}
