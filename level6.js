// sucks for wait time, but OK for # moves
// works for level 7 too
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
            f.on('up_button_pressed', function() {
                if (_.find(elevators, function(e) { return _.include(e.destinationQueue, f.level) })) {
                    console.log("elevator already en route");
                    return
                };

                e = _.sortBy(elevators, function(ele){return Math.abs(f.level - ele.currentFloor())})[0];
                e.goToFloor(f.level);
                rebalanceQueue(e);

            });
            f.on('down_button_pressed', function() {
                if (_.find(elevators, function(e) { return _.include(e.destinationQueue, f.level) })) {
                    console.log("elevator already en route");
                    return
                };
                e = _.sortBy(elevators, function(ele){return Math.abs(f.level - ele.currentFloor())})[0];
                e.goToFloor(f.level);
                e.destinationQueue = _.uniq(e.destinationQueue);
                rebalanceQueue(e);
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
