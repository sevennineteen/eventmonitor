var EVENT_MONITOR = {
	
	completed: [],
	
	// Define connectors to bind prerequisite events to follower actions
	connectors: {
		'record_page_view': {
			'prereqs': ['profile_ready', 'pagedata_ready'],
			'follower': PROFILE.recordPageView
		},
		'example_inline': {
			'prereqs': ['example1', 'example2'],
			'follower': function () {
				alert('Just an example!');
			}
		}
	},
	
	connect: function (prereq_arr, follower_fn, label) {
		EVENT_MONITOR.connectors[label] = {'prereqs': prereq_arr, 'follower': follower_fn};
		console.log('Added event connector: ' + label);
	},
	
	// Record completion of prerequisite events
	recordEvent: function (event) {
	   console.log('Completed ' + event);
	   EVENT_MONITOR.completed.push(event);
	   // Reevaluate connectors after each recorded event
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
				console.log('++++ Prereqs completed for ' + k);
				// Destroy the connector
				delete EVENT_MONITOR.connectors[k];
				// Call the follower function
				v.follower();
			}
		});
	}
};