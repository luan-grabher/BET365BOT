const Wait = {
    elements = function (selectors, callback, checkFrequencyInMs, timeoutInMs) {
        var startTimeInMs = Date.now();
        (function loopSearch() {
            if (document.querySelector(selectors[0]) !== null || document.querySelector(selectors[1]) !== null) {
                callback();
                return;
            } else {
                setTimeout(function () {
                    if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                        return;
                    loopSearch();
                }, checkFrequencyInMs);
            }
        })();
    },
    element = function waitElement(selector, callbackSuccess, callbackFail, timeoutInMs) {
        var startTimeInMs = Date.now();
        (function loopSearch() {
            if (document.querySelector(selector) !== null) {
                callbackSuccess();
                return;
            } else {
                setTimeout(function () {
                    if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
                        callbackFail();
                        return;
                    }
                    loopSearch();
                }, 1000);
            }
        })();
    }
};