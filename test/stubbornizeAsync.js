var stubbornizeAsync = require('../lib/stubbornizeAsync'),
    expect = require('expect.js');

describe('stubbornizeAsync', function () {
    function createFunctionThatFailsTheFirstNTimes(n) {
        var invocationNumber = 1;
        return function (cb) {
            process.nextTick(function () {
                if (invocationNumber <= n) {
                    cb(new Error('error #' + invocationNumber));
                    invocationNumber += 1;
               } else {
                    cb(null, 'success #' + (invocationNumber - n));
                }
            });
        };
    };

    it('should return a function that eventually succeeds when numRetries is equal to the number of failures', function (done) {
        stubbornizeAsync(createFunctionThatFailsTheFirstNTimes(4), {numRetries: 4, delayMsec: 1})(function (err, result) {
            expect(err).to.equal(null);
            expect(result).to.equal('success #1');
            done();
        });
    });

    it('should return a function that eventually succeeds when numRetries is greater than or equal to the number of failures', function (done) {
        stubbornizeAsync(createFunctionThatFailsTheFirstNTimes(3), {numRetries: 4, delayMsec: 1})(function (err, result) {
            expect(err).to.equal(null);
            expect(result).to.equal('success #1');
            done();
        });
    });

    it('should return a function that eventually fails when numRetries is one less than the number of failures', function (done) {
        stubbornizeAsync(createFunctionThatFailsTheFirstNTimes(5), {numRetries: 4, delayMsec: 1})(function (err, result) {
            expect(err).to.be.an(Error);
            expect(err.message).to.equal('error #5');
            done();
        });
    });
});
