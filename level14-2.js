// Worked for level 15 && 16 - but not level 14. lots of luck involved though,
// doesn't always work.  prioritizing pick ups over drop offs doesn't seem like
// a good real world strategy, but works for this scenario
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
      if (e.destinationQueue[0] > e.currentFloor()) {
        //e.goingUpIndicator(true);
        //e.goingDownIndicator(false);
        e.destinationQueue = above.sort().concat(below.sort().reverse());
      };
      if (e.destinationQueue[0] < e.currentFloor()) {
        //e.goingUpIndicator(false);
        //e.goingDownIndicator(true);
        e.destinationQueue = below.sort().reverse().concat(above.sort());
      };

      console.log("After rebalance: " + e.destinationQueue)
      console.log("Going up: " + e.goingUpIndicator());
      console.log("Going down: " + e.goingDownIndicator());
      e.checkDestinationQueue();
    };
    var closestUnfullElevator = function(els, floor) {
       var closeElevators = _.sortBy(els, function(ele) {
         return Math.abs(floor - ele.currentFloor());
       });
       var unfull = _.filter(closeElevators, function(ele) {
         return ele.loadFactor() < 1;
       });
       return unfull[0];
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
      _.each(['up_button_pressed', 'down_button_pressed'], function(event) {
        f.on(event, function() {
          var alreadyInQueue = _.some(elevators, function(e) {
            return _.include(e.destinationQueue, f.level) && e.destinationQueue.length < 3;
          });
          if (alreadyInQueue) {
            return
          };
          var e = shortestQueueElevator(elevators, f.level);
          e.destinationQueue.unshift(f.level);
          e.checkDestinationQueue();
          // rebalanceQueue(e);
        });
      });
    });
    _.each([0,1,2], function(e_index) {
      elevators[e_index].on("idle", function() { elevators[e_index].goToFloor(0); });
    });
    elevators[3].on("idle", function() { elevators[3].goToFloor(3); });
    elevators[4].on("idle", function() { elevators[4].goToFloor(5); });
    elevators.forEach(function(e) {

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

