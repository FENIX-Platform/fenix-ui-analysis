define([
    'loglevel',
    'jquery',
    'underscore',
    'fx-analysis/start',
    'i18n!test/nls/labels'
], function (log, $, _, Analysis) {

    'use strict';

    var s = {
            STANDARD: "#standard"
        },
        instances = [];

    function Test() {
    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Test.prototype._render = function () {

        this._renderStandard();
    };

    Test.prototype._renderStandard = function () {

        var analysis = this.createInstance({
            $el: s.STANDARD
        });
    };

    //Utils

    Test.prototype.createInstance = function (params) {

        var instance = new Analysis(params);

        instances.push(instance);

        return instance;
    };

    return new Test();

});