if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function () {

    'use strict';

    return {
        submit_button: "Submit",
        reset_button: "Reset",

        //menu and selector titles
        resourceType: "Resource Type",
        referencePeriod: "Reference Period",
        referenceArea: "Reference Area",
        dataDomain: "Data Domain",
        statusOfConfidentiality: "Status of Confidentiality",
        uid: "Uid",
        region : "Region",
        
        content : "Content",
        search_by_id : "Search by id",
        accessibility : "Accessibility",

        action_select : "Select",
        action_download : "Download",
        action_view : "View",

        //Errors
        request : "Request error",
        empty_values : "Empty selection",

        courtesy_intro_title: "Welcome to the Fenix Platform Analysis Section",

        courtesy_intro: "Here you will be able to produce statistic analysis by using all the data stored in the Fenix Network.<br> Please start with your first AVB (Analysis Visualization Box) by choosing a resource from the catalog by clicking the pulsing button above.",

        tooltip_open_catalog : "Open FENIX Catalog"
    }
});