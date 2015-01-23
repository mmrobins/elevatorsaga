// only had to remove a tiny bit of code from 6 to decrease wait time
// which also increases # moves
{
  init: function(elevators, floors) {
    var rebalanceQueue = function(e) {
      console.log("Before rebalance: " + e.destinationQueue)
      e.destinationQueue = _.uniq(e.destinationQueue)
      e.checkDestinationQueue()
      console.log("After rebalance: " + e.destinationQueue)
    };
    window.elevators = elevators;
    window.floors = floors;
    _.each(floors, function(f) {
      _.each(['up_button_pressed', 'down_button_pressed'], function(event) {
        f.on(event, function() {
          e = _.sortBy(elevators, function(ele){return Math.abs(f.level - ele.currentFloor())})[0];
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
