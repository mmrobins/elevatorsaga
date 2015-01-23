// barely works for level 11
{
  init: function(elevators, floors) {
    var rebalanceQueue = function(e) {
      // console.log("Before rebalance: " + e.destinationQueue)
      e.destinationQueue = _.uniq(e.destinationQueue)
      e.checkDestinationQueue()
      // console.log("After rebalance: " + e.destinationQueue)
    };
    var closestUnfullElevator = function(els, floor) {
       closeElevators = _.sortBy(els, function(ele) {return Math.abs(floor - ele.currentFloor())});
       unfull = _.filter(closeElevators, function(ele) { return ele.loadFactor() < 1 });
       return unfull[0];
    };
    var shortestQueueElevator = function(els, floor) {
       shortest = _.sortBy(els, function(ele) {return ele.destinationQueue.length});
       return shortest[0];
    };
    window.elevators = elevators;
    window.floors = floors;
    _.each(floors, function(f) {
      _.each(['up_button_pressed', 'down_button_pressed'], function(event) {
        f.on(event, function() {
          e = shortestQueueElevator(elevators, f.level);
          e.goToFloor(f.level);
          rebalanceQueue(e);
        });
      });
    });
    _.each([0,1,2], function(e_index) {
      elevators[e_index].on("idle", function() { e.goToFloor(0); })
    });
    elevators[3].on("idle", function() { e.goToFloor(3); })
    elevators[4].on("idle", function() { e.goToFloor(5); })
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
