(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.stubbornizeAsync = factory();
    }
}(this, function () {
    return function stubbornizeAsync(lambda, options) {
        options = options || {};
        var numRetries = typeof options.numRetries === 'number' ? options.numRetries : 3,
            delayMsec = typeof options.delayMsec === 'number' ? options.delayMsec : 250;
        return function () { // ...
            var args = Array.prototype.slice.apply(arguments),
                cb = args.pop();
            args.push(function (err) { // ...
                if (err && numRetries > 0) {
                    setTimeout(function () {
                        lambda.apply(this, args);
                    }, delayMsec);
                    numRetries -= 1;
                } else {
                    cb.apply(this, arguments);
                }
            });
            lambda.apply(this, args);
        };
    };
}));
