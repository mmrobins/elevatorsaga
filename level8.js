// only had to remove a tiny bit of code from 6 to decrease wait time
// which also increases # moves
// works for level 9 also
{
  init: function(elevators, floors) {
    var rebalanceQueue = function(e) {
      // console.log("Before rebalance: " + e.destinationQueue)
      e.destinationQueue = _.uniq(e.destinationQueue)
      e.checkDestinationQueue()
      // console.log("After rebalance: " + e.destinationQueue)
    };
    var closestElevator = function(els, floor) {
       es = _.sortBy(els, function(ele) {return Math.abs(floor - ele.currentFloor())});
       console.log(es);
       return es[0];
    };
    window.elevators = elevators;
    window.floors = floors;
    _.each(floors, function(f) {
      _.each(['up_button_pressed', 'down_button_pressed'], function(event) {
        f.on(event, function() {
          e = closestElevator(elevators, f.level);
          e.goToFloor(f.level);
          rebalanceQueue(e);

        });
      });
    });
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
