define([
    'loglevel',
    'jquery',
    'underscore',
    '../../../src/js/index',
    '../nls/labels'
], function (log, $, _, Analysis) {

    'use strict';

    var s = {
            STANDARD: "#standard",
            ADD_BTN: "#add-btn"
        },
        instances = [],
        environment = "production";

    function Dev() {
        console.clear();

        this._importThirdPartyCss();

        log.setLevel('silent');

        this.start();
    }

    Dev.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Dev.prototype._render = function () {

        this._renderStandard();
    };

    Dev.prototype._renderStandard = function () {


        var analysis = this.createInstance({
                el: s.STANDARD,
                lang: "EN",
                loadResourceServiceQueryParams : {
                    perPage: 2001,
                    maxSize: 2000
                },
                environment: environment,
                catalog: {
                    pagination: false,
                    perPage: 10,
                    pluginRegistry: {
                        contextSystem: {
                            selector: {
                                id: 'dropdown',
                                source: [
                                    {value: "cstat_training", label: "CountrySTAT Training"}
                                ],
                                default: ["cstat_training"]
                            }
                        },
                        dataDomain: {
                            selector: {
                                id : "dropdown",
                                config : {
                                    plugins: ["remove_button"], //in combination with mode:"multi" create a "X" button to remove items
                                    mode: "multi"
                                }
                            },
                            cl : {
                                uid:  "CSTAT_Core"
                            },
                            format : {
                                output : "codes",
                                metadataAttribute: "meContent.seCoverage.coverageSectors"
                            }

                        },
                        referencePeriod: {
                            selector: {
                                id : "dropdown",
                                config: {
                                    plugins: ["remove_button"], //in combination with mode:"multi" create a "X" button to remove items
                                },
                                sort: function (a, b) {
                                    var hash = {  9:1, 6:2, 4:3, 3:4, 14:5, 13:6, 12:7, 11:8, 10:9, 8:10, 7:11, 5:12, 2:13, 1:14 };
                                    return hash[a.value] - hash[b.value];
                                }

                            },
                            cl : {
                                uid: "FAO_Period_cstat",
                                version: "1.0"
                            },
                            format : {
                                output : "codes",
                                metadataAttribute: "meContent.seReferencePopulation.referencePeriod"
                            }
                        },
                        freeText: {
                            selector : {
                                id : "input",
                                type : "text"
                            },
                            template : {
                                footer: ""
                            },
                            format : {
                                output : "freeText",
                                metadataAttribute: "freetext"
                            }
                        }
                    },
                    baseFilter: {
                        "dsd.contextSystem": {"enumeration": ["cstat_training"]},
                        "meContent.resourceRepresentationType": {"enumeration": ["dataset"]}
                    },
                    defaultSelectors: ["freeText", "dataDomain", "referenceArea"],
                    menuExcludedItems: ["accessibility"],
                    findServiceParams: {
                        engine: ['cstat','fenix'],
                        full: true,
                        order : "meMaintenance.seUpdate.updateDate:desc" //order by last update
                    }
            }
            })
        ;

        analysis.on("initialized", function (payload) {
        });

        $(s.ADD_BTN).on("click", function () {
            analysis.add({
                uid: "adam_usd_commitment",
                process: [
                    {
                        "name": "filter",
                        "parameters": {
                            "rows": {
                                "year": {
                                    "time": [
                                        {
                                            "from": 2000,
                                            "to": 2014
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    {
                        "name": "pggroup",
                        "parameters": {
                            "by": [
                                "year"
                            ],
                            "aggregations": [
                                {
                                    "columns": ["value"],
                                    "rule": "SUM"
                                },
                                {
                                    "columns": ["unitcode"],
                                    "rule": "pgfirst"
                                },
                                {
                                    "columns": ["flowcategory"],
                                    "rule": "pgfirst"
                                }
                            ]
                        }
                    },
                    {
                        "name": "order",
                        "parameters": {
                            "year": "ASC"
                        }
                    }
                ]
            })
        })
    };

    //Utils

    Dev.prototype.createInstance = function (params) {

        var instance = new Analysis(params);

        instances.push(instance);

        return instance;
    };

    // utils

    Dev.prototype._importThirdPartyCss = function () {

        //Bootstrap
        require('bootstrap/dist/css/bootstrap.css');

        //map
        require("../../../node_modules/leaflet/dist/leaflet.css");
        require("../../../node_modules/fenix-ui-map/dist/fenix-ui-map.min.css");

        //dropdown selector
        require("../../../node_modules/selectize/dist/css/selectize.bootstrap3.css");
        // fenix-ui-filter
        require("../../../node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");
        // fenix-ui-dropdown
        require("../../../node_modules/fenix-ui-dropdown/dist/fenix-ui-dropdown.min.css");

        // bootstrap-table
        require("../../../node_modules/bootstrap-table/dist/bootstrap-table.min.css");

        //tree selector
        require("../../../node_modules/jstree/dist/themes/default/style.min.css");

        // fenix-ui-table-creator
        require("../../../node_modules/fenix-ui-table-creator/dist/fenix-ui-table-creator.min.css");

        // jquery-grid for fenix-ui-metadata-viewer
        require("../../../node_modules/jquery-treegrid-webpack/css/jquery.treegrid.css");

        // iDangerous swiper
        require("../../../node_modules/swiper/dist/css/swiper.min.css");

        // fenix-ui-catalog
        require("../../../node_modules/fenix-ui-catalog/dist/fenix-ui-catalog.min.css");

        // fenix-ui-visualization-box
        require("../../../node_modules/fenix-ui-visualization-box/dist/fenix-ui-visualization-box.min.css");

    };

    return new Dev();

});