var EVENT_MONITOR = {
  
  counter: 0, // counter for assigning connector ids
  completed: [], // holds completed events
  connectors: {}, // holds active connectors between events and follower actions
  event_data: {}, // holds data provided by events
  
  /* Connectors take the following form:
      connectors: {
        'id': {
          'prereqs': ['a', 'b'],
          'follower': fn,
          'args': []
        },
      }
  */
  
  // Set EVENT_MONITOR.debug as false to disable console logging
  debug: true,
  log: function (msg) {
    if (EVENT_MONITOR.debug) {
      console.log('EVENT_MONITOR>> ' + msg);
    }
  },
  
  // Define connectors to bind prerequisite events to follower actions
  connect: function (prereq_arr, follower_fn, args_arr, label) {
    EVENT_MONITOR.counter += 1;
    var id = label || EVENT_MONITOR.counter;
    var args = args_arr || [];
    EVENT_MONITOR.connectors[id] = {'prereqs': prereq_arr, 'follower': follower_fn, 'args': args};
    EVENT_MONITOR.log('Added connector: ' + id);
    // Reevaluate completion states after connector is added
    EVENT_MONITOR.evaluateEvents();
  },
  
  // Record completion of prerequisite events
  recordEvent: function (event, data) {
    EVENT_MONITOR.log('"' + event + '" event occurred.');
    // add supplied properties to event data
    for (var prop in data) {
      EVENT_MONITOR.event_data[prop] = data[prop];
    }
    EVENT_MONITOR.log('Current event data: ' + JSON.stringify(EVENT_MONITOR.event_data));
    EVENT_MONITOR.completed.push(event);
    // Reevaluate connector states after each recorded event
    EVENT_MONITOR.evaluateEvents();
  },
  
  // Substitutes args with event data if available
  inform: function (args) {
    var new_args = [];
    for (var k in args) {
      new_args.push(EVENT_MONITOR.event_data[args[k]] || args[k]);
    }
    return new_args;
  },
  
  // Check each connector and call follower if all prereqs are completed
  evaluateEvents: function () {
    $.each(EVENT_MONITOR.connectors, function (k, v) {
      var unsatisfied = [];
      $.each(v.prereqs, function (i, p) {
        if ($.inArray(p, EVENT_MONITOR.completed) == -1) {
          unsatisfied.push(p);
        }
      });
      if (unsatisfied.length == 0) {
        EVENT_MONITOR.log('Prereqs satisfied for: ' + k);
        // Destroy the connector
        delete EVENT_MONITOR.connectors[k];
        // Call the follower function
        v.follower.apply(this, EVENT_MONITOR.inform(v.args));
      }
    });
  }
};