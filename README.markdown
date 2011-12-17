# eventmonitor

## Overview

**eventmonitor** is a simple JavaScript module for managing dependencies asynchronously by allowing functions to be triggered once their defined prereqs have been satisified. 

This makes it easy to build non-blocking code without complex callback nesting, and also to tie a function's execution to multiple, independent preconditions.

To make something trackable, simply record an *event*:

        EVENT_MONITOR.recordEvent('MY_EVENT');

Then create *connectors* to tie a given follower function's execution to one or more *prereqs*:

        EVENT_MONITOR.connect(['MY_EVENT'], my_follower_func);

This is somewhat similar to a pub/sub model. However, completed events are reevaluated each time either an event is recorded or a connector created, meaning that connectors can be instantiated even after their prereqs have occurred and will still trigger their followers.

## Usage

1. Define your functions, recording significant events.

        function a () {
             console.log('a');
             EVENT_MONITOR.recordEvent('A');
        }
        function b () {
             console.log('b');
             EVENT_MONITOR.recordEvent('B');
        }
        function c () {
             console.log('c');
             EVENT_MONITOR.recordEvent('C');
        }

2. Connect them to prerequisite events.

        // Make sure C is called after A and B.
        EVENT_MONITOR.connect(['A', 'B'], c);

3. Let the event monitor call them.

## Complete Syntax

        // Record event
        EVENT_MONITOR.recordEvent(event);
        
        // Create connector
        // EVENT_MONITOR.connect([prereq_arr], follower_fn, [args_arr], label);
        
        // Disable logging
        EVENT_MONITOR.debug = false;

## Notes

1. Any arguments in the `args_arr` parameter will be passed to the follower function; this parameter may be omitted if the function does not take arguments.

2. Connector names are completely optional but may be useful for tracing a certain sequence of events.

3. Requires [JQuery](http://jquery.com).