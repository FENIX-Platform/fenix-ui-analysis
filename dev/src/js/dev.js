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
                environment: environment,
                //catalog:{"pluginRegistry":{"contextSystem":{"selector":{"source":[{"value":"cstat_ago","label":"CountrySTAT Angola"}],"default":["cstat_ago"]}},"dataDomain":{"cl":{"uid":"CSTAT_Core","level":1,"levels":1}}},"baseFilter":{"dsd.contextSystem":{"enumeration":["cstat_ago"]},"meContent.resourceRepresentationType":{"enumeration":["dataset"]}},"defaultSelectors":["freeText","dataDomain","region","referenceArea"],"menuExcludedItems":["accessibility"]}

                catalog: {
                    defaultSelectors: ['contextSystem', "dataDomain", "resourceType"],
                    selectorsRegistry: {
                        contextSystem: {
                            selector: {
                                id: "dropdown",
                                source: [
                                    {value: "uneca", label: "UNECA"},
                                    {value: "FAOSTAT", label: "FAOSTAT"}
                                ],
                                default: ["uneca"],
                                hideSummary: true
                            },

                            template: {
                                hideRemoveButton: false
                            },

                            format: {
                                output: "enumeration",
                                metadataAttribute: "dsd.contextSystem"
                            }
                        }
                    }
                }
                //catalog: false
            });

        analysis.on("change", function( arg) {

            console.log(arg.instance.getVisualizationBoxesAmount())

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
        require("../../../node_modules/ion-rangeslider/css/ion.rangeSlider.css");
        require("../../../node_modules/ion-rangeslider/css/ion.rangeSlider.skinNice.css");
        require("../../../node_modules/fenix-ui-map-creator/src/css/fenix-ui-leaflet.css");
        require("../../../node_modules/fenix-ui-map-creator/src/css/fenix-ui-map-creator.css");
        require("../../../node_modules/fenix-ui-map-creator/dist/fenix-ui-map-creator.min.css");

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