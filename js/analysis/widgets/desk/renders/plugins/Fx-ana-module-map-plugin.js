/*global define, Promise */

define([
    'jquery',
    'fx-m-c/start'
], function ($, MapCreator) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        label: 'Map'
    };


    function MapPlugin(options) {

        console.log(options)

        this.mapCreator = new MapCreator();

        this.o = {};
        $.extend(true, this, defaultOptions, options);
        return this;
    }

    MapPlugin.prototype.renderMap = function () {

        this.mapCreator.addLayer(this._model);
        this.mapCreator.addCountryBoundaries();
    };

    //Mandatory
    MapPlugin.prototype.isSuitable = function () {

        return true;
    };

    //Mandatory
    MapPlugin.prototype.show = function () {

        if (!this.initialized) {
            this.renderMap();
            this.initialized = true;
        }
    };

    //Optional
    MapPlugin.prototype.get = function (attr, lang) {

        var o = this[attr];

        if (!o) {
            return '';
        }

        if (typeof o === 'object') {
            return o[lang] ? o[lang] : '';
        }

        return o;
    };

    //Optional
    MapPlugin.prototype.init = function () {

        //cache original model
        this._model = $.extend(true, {}, this.model);

        console.log(this)
        console.log(this.o)
        console.log(this.o.$el)


        this.mapCreator.render({
            container: this.$el,
            model: {}
        });
    };

    return MapPlugin;

});