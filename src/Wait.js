const Wait = {
    waiting: [],
    sleep: function (ms) {
        /*chamar função com await ou 'sleep(1000).then(()=>{CODIGO});' */
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    element: function (selector, timeoutInMs) {
        return new Promise((success, error) =>{
            var startTimeInMs = Date.now();
            (function loopSearch() {
                if ($(selector).length) {
                    return success($(selector));
                } else {
                    Wait.sleep(1000).then(()=>{
                         if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
                            return error("Elemento '" + selector + "' não encontrado.");
                        }
                        loopSearch();
                    });
                }
            })();
        });        
    },
    elementNonExist: function (selector, timeoutInMs) {
        return new Promise((success, error) =>{
            var startTimeInMs = Date.now();
            (function loopSearch() {
                if (!$(selector).length) {
                    return success();
                } else {
                    Wait.sleep(1000).then(()=>{
                         if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
                            return error("Elemento '" + selector + "' não desapareceu.");
                        }
                        loopSearch();
                    });
                }
            })();
        });        
    },
    elementVal: function (selector, timeoutInMs) {
        return new Promise((success, error) =>{
            var startTimeInMs = Date.now();
            (function loopSearch() {
                if ($(selector).length && $(selector).val().length > 0) {
                    return success($(selector));
                } else {
                    Wait.sleep(1000).then(()=>{
                         if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
                            return error("Elemento '" + selector + "' não encontrado ou com valor em branco.");
                        }
                        loopSearch();
                    });
                }
            })();
        });        
    }
};