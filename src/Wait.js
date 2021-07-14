var Wait = {
    waiting: [],
    sleep: function (ms) {
        /*chamar função com await ou 'sleep(1000).then(()=>{CODIGO});' */
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    element: function (selector, timeoutInMs) {
        return new Promise((success, error) =>{
            var startTimeInMs = Date.now();
            (function loopSearch() {
                if ($(selector) !== null) {
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
    }
};