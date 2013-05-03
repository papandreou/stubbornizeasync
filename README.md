stubbornizeasync
================

Create a "stubborn" version of an asynchronous function so that the
operation is retried a configurable number of times in case the
original function returns an error.

```javascript
var stubbornizeAsync = require('stubbornizeasync');

// This function will fail ~10% of the time
function myFlakyFunction(cb) {
    setTimeout(function () {
        if (Math.random() > .9) {
            cb(new Error("whoops"));
        } else {
            cb();
        }
    }, 10);
}

// This function will fail ~1% of the time:
var stubbornFunction = stubbornizeAsync(myFlakyFunction, {numRetries: 1});

// This function will fail ~0.01% of the time:
var evenMoreStubbornFunction = stubbornizeAsync(myFlakyFunction, {numRetries: 3});

evenMoreStubbornFunction(function (err) {
    if (err) {
        throw err;
    } else {
        // Yay!
    }
});
```

By default the stubbornized function retries the original function 3
times (so it's run a maximum of 4 times), and it waits 250
milliseconds between the attempts. These parameters can be adjusted by
providing an options object as the second parameter to
`stubbornizeAsync`:

```javascript
var veryStubbornAndVeryPatientFunction = stubbornizeAsync(myFlakyFunction, {numRetries: 10, delayMsec: 10000});
```

Installation
------------

Make sure you have node.js and npm installed, then run:

    npm install stubbornizeasync

License
-------

3-clause BSD license -- see the `LICENSE` file for details.
