# eventmonitor

## Overview

**eventmonitor** is a simple JavaScript module for managing dependencies asynchronously by allowing functions to be triggered once their defined prereqs have been satisified. 

This makes it easy to build non-blocking code without complex callback nesting, and also to tie a function's execution to multiple, independent preconditions.

To make something trackable, simply announce an *event*:

        EVENT_MONITOR.announce('MY_EVENT');

Then create *connectors* to tie a given follower function's execution to one or more *prereqs*:

        EVENT_MONITOR.connect(['MY_EVENT'], my_follower_func);

This is somewhat similar to a pub/sub model. However, completed events are reevaluated each time either an event is announced or a connector created, meaning that connectors can be instantiated even after their prereqs have occurred and will still trigger their followers.

## Usage

1. Define your functions, announcing significant events.

        function a () {
             console.log('a');
             EVENT_MONITOR.announce('A');
        }
        function b () {
             console.log('b');
             EVENT_MONITOR.announce('B');
        }
        function c () {
             console.log('c');
             EVENT_MONITOR.announce('C');
        }

2. Connect them to prerequisite events.

        // Make sure C is called after A and B.
        EVENT_MONITOR.connect(['A', 'B'], c);

3. Let the event monitor call them.

## Complete Syntax

        // Announce event
        EVENT_MONITOR.announce(event, {data_map});
        
        // Create connector
        EVENT_MONITOR.connect([prereq_arr], follower_fn, [args_arr], label);
        
        // Directly provide data to event monitor
        EVENT_MONITOR.provide({data_map});
        
        // Disable logging
        EVENT_MONITOR.debug = false;

## Notes

1. Any arguments in the `args_arr` parameter will be passed to the follower function; this parameter may be omitted if the function does not take arguments.

2. Although data may be provided to via the `provide` function, it's more useful to send the `data_map` when announcing an event. When a connector's follower function is executed, event monitor will substitute items in the connector's `args_arr` with the latest data which has been provided to it, if available.

3. Connector names are completely optional but may be useful for tracing a certain sequence of events.

4. Requires [JQuery](http://jquery.com).