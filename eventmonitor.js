var EVENT_MONITOR = {
	
	completed: [], // holds completed events
	connectors: {}, // holds active connectors between events and follower actions
	
	/* Connectors take the following form:
		connectors: {
			'label': {
				'prereqs': ['a', 'b'],
				'follower': fn
			},
		}
	*/
	
	// Define connectors to bind prerequisite events to follower actions
	connect: function (prereq_arr, follower_fn, label) {
		EVENT_MONITOR.connectors[label] = {'prereqs': prereq_arr, 'follower': follower_fn};
		console.log('Added event connector: ' + label);
		console.log('Active connectors: ' + JSON.stringify(EVENT_MONITOR.connectors));
		EVENT_MONITOR.evaluateEvents();
	},
	
	// Record completion of prerequisite events
	recordEvent: function (event) {
	   console.log('++ Completed ' + event);
	   EVENT_MONITOR.completed.push(event);
	   // Reevaluate connector states after each recorded event
	   EVENT_MONITOR.evaluateEvents();
	},
	
	// Check each connector and call follower if all prereqs are completed
	evaluateEvents: function () {
		console.log('Completed events: ' + JSON.stringify(EVENT_MONITOR.completed));
		$.each(EVENT_MONITOR.connectors, function (k, v) {
			var unsatisfied = [];
			$.each(v.prereqs, function (i, p) {
				if ($.inArray(p, EVENT_MONITOR.completed) == -1) {
					unsatisfied.push(p);
				}
			});
			if (unsatisfied.length == 0) {
				console.log('++++ Prereqs completed for ' + k);
				// Destroy the connector
				delete EVENT_MONITOR.connectors[k];
				// Call the follower function
				v.follower();
			}
		});
	}
};