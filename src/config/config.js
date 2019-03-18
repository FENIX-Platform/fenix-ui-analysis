define(function () {

    'use strict';

    return {

        catalog : {
            defaultSelectors: ['resourceType', 'contextSystem', 'uid'],
            actions: ["download", "select"], /* , 'view' */
            //baseFilter : { test : "test"}
            //selectorsRegistry : {}
            menuExcludedItems : [],
        },

        autostart : false,

        box: {
            hideMinimizeButton : true
        },

        pulsingButtonClassName: 'first-init',

        cache : false,
        
        lang : "EN"
    }

});