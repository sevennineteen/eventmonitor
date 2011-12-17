var EVENT_MONITOR = {
	
	counter: 0, // counter for assigning connector ids
	completed: [], // holds completed events
	connectors: {}, // holds active connectors between events and follower actions
	
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
	recordEvent: function (event) {
	   EVENT_MONITOR.log('Completed event: ' + event);
	   EVENT_MONITOR.completed.push(event);
	   // Reevaluate connector states after each recorded event
	   EVENT_MONITOR.evaluateEvents();
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
				v.follower.apply(this, v.args);
			}
		});
	}
};