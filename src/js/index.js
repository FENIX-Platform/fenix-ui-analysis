define([
    'jquery',
    'underscore',
    'loglevel',
    '../config/errors',
    '../config/events',
    '../config/config',
    '../html/analysis.hbs',
    '../html/item.hbs',
    '../nls/labels',
    'fenix-ui-catalog',
    'fenix-ui-visualization-box',
    'fenix-ui-filter-utils',
    "fenix-ui-reports",
    './fx-fluid-grid',
], function ($, _, log, ERR, EVT, C, TemplateAnalysis, TemplateItem, i18nLabels, Catalog, Box, Utils, Report, Grid) {

    'use strict';

    var s = {
        ANALYSIS: "[data-role='analysis']",
        MODAL: "[data-role='modal']",
        CATALOG_EL: "[data-role='catalog-container']",
        CATALOG_BUTTON: "[data-action='catalog']",
        GRID: "[data-role='grid']",
        STACK: "[data-role='stack']",
        STACK_ITEM: "[data-role='stack-item']",
        STACK_ITEM_REMOVE_BUTTON: "[data-action='stack-item-remove']",
        STACK_ITEM_ENLARGE_BUTTON: "[data-action='stack-item-enlarge']",
        COURTESY: "[data-role='courtesy']"
    };

    function Analysis(o) {
        log.info("FENIX analysis");
        log.info(o);

        //import css
        require("../css/fenix-ui-analysis.css");

        $.extend(true, this, {initial: o}, C);

        this._parseInput();

        var valid = this._validateInput();

        log.info("Analysis has valid input? " + JSON.stringify(valid));

        if (valid === true) {

            this._attach();

            this._hideError();

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();

            //make async the event
            window.setTimeout(_.bind(function () {
                if (this.autostart) {
                    this.$modal.modal("show");
                    this._trigger("catalog.show");
                }
                this._trigger("ready");
            }, this), 100);

            return this;

        } else {
            log.error("Impossible to create analysis");
            log.error(valid)
        }
    }

    Analysis.prototype.getVisualizationBoxesAmount = function () {
        var length = Object.keys(this.gridItems).length;
        console.log(length);
        return length;
    }

    /**
     * Reset the view content
     * @return {null}
     */
    Analysis.prototype.reset = function () {

        log.info("analysis reset");
    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Analysis.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    /**
     * Dispose
     * @return {null}
     */
    Analysis.prototype.dispose = function () {

        //unbind event listeners
        this._unbindEventListeners();

        log.info("analysis disposed successfully");

    };

    /**
     * Add model to analysis
     * @param obj
     * @returns {*}
     *
     */
    Analysis.prototype.add = function ( obj ){
        log.info("Add model to analysis:");
        log.info(obj);

        if (!obj.hasOwnProperty('uid')){
            log.error("Impossible to add model to Analysis: uid missing. Abort add() fn");
            return;
        }

        this._addToGrid(obj);
    };

    // end API

    Analysis.prototype._trigger = function (channel) {

        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    };

    Analysis.prototype._parseInput = function () {

        this.$el = $(this.initial.el);
        this.environment = this.initial.environment;
        this.lang = this.initial.lang || C.lang;
        this.lang = this.lang.toUpperCase();
        this.cache = typeof this.initial.cache === "boolean" ? this.initial.cache : C.cache;

        // catalog proxied config
        //this.catalogConfig =  this.initial.catalog || C.catalog;
        this.catalogConfig = (typeof this.initial.catalog === "boolean" && this.initial.catalog === false )? false : this.initial.catalog || C.catalog;

        // box proxied config
        this.boxConfig = this.initial.box || C.box;
    };

    Analysis.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //set analysis id
        if (!this.id) {

            window.fx_analysis_id >= 0 ? window.fx_analysis_id++ : window.fx_analysis_id = 0;

            this.id = "fx-analysis-" + String(window.fx_analysis_id);

            log.info("Set analysis id: " + this.id);
        }


        if (!this.$el) {
            errors.push({code: ERR.missing_container});

            log.warn("Impossible to find analysis container");
        }

        this.$el = $(this.$el);

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.missing_container});

            log.warn("Impossible to find box container");

        }

        return errors.length > 0 ? errors : valid;
    };

    Analysis.prototype._attach = function () {

        var $html = $(TemplateAnalysis($.extend(true, {hideCatalog : !!this.catalogConfig}, i18nLabels)));

        this.$el.html($html);

        log.info("template attached successfully");

    };

    Analysis.prototype._initVariables = function () {

        //pub/sub
        this.channels = {};

        this.$catalogButton = this.$el.find(s.CATALOG_BUTTON);
        this.$modal = this.$el.find(s.MODAL);
        this.$stack = this.$el.find(s.STACK);
        this.stackItems = {};
        this.gridItems = {};
        this.pulsingButtonClassName = C.pulsingButtonClassName;

        this.autostart = this.initial.autostart || C.autostart;

    };

    Analysis.prototype._bindEventListeners = function () {

        if (!!this.catalogConfig) {
            this.$catalogButton.on("click", _.bind(function () {
                this.$modal.modal("show");
                this._trigger("catalog.show");
            }, this));

            this.catalog.on("select", _.bind(function (payload) {
                this.$modal.modal("hide");
                this._addToGridFromCatalog(payload);
            }, this));

            if (this.autostart) {
                this.$modal.modal("show");
                this._trigger("catalog.show");
            }
        }

    };

    Analysis.prototype._initComponents = function () {

        this.report = new Report({
            cache: this.cache,
            environment: this.environment
        });

        if (!!this.catalogConfig) {
            this._initCatalog();
        }

        this.grid = new Grid({
            $el: s.GRID,
            config: {
                containment: s.GRID
            }
        });

    };

    Analysis.prototype._initCatalog = function () {

        var config = $.extend(true, {}, {
            cache: this.cache,
            environment: this.environment,
            el: s.CATALOG_EL,
            lang : this.lang
        }, this.catalogConfig);

        this.catalog = new Catalog(config);

        this.catalog.on("download", _.bind(this._onDownloadResult, this));

    };

    Analysis.prototype._onDownloadResult = function (p) {

        this.$modal.modal("hide");

        var uid = Utils.getNestedProperty("model.uid", p),
            payload = {
                resource: {
                    "metadata": {
                        "uid": uid
                    }
                },
                input: {
                    config: {}
                },
                output: {
                    config: {
                        lang: this.lang.toUpperCase()
                    }
                }
            };

        log.info("Configure FENIX export: table");

        log.info(payload);

        this.report.export({
            format : "table",
            config: payload
        });
    };

    //Grid

    Analysis.prototype._addToGrid = function (obj) {

        this._checkCourtesy();

        var $blank = this.grid.getBlankContainer(),
            config = $.extend(true, obj, {
                el: $blank,
                environment: this.environment,
                cache: this.cache,
                lang : this.lang
            }, this.boxConfig),
            box;

        $blank.attr('data-size', config.size);

        window.setTimeout(_.bind(function () {

            box = new Box(config);

            this.gridItems[box.id] = {model: box, el: $blank};

            this.grid.add($blank);

            this._checkCourtesy();

            this._bindBoxEventListeners(box);

            this._trigger("add", {
                box: box,
                instance: this
            });
            this._trigger("change", {
                instance: this
            });

        }, this), 100);

    };

    Analysis.prototype._addToGridFromCatalog = function (obj) {

        var uid = Utils.getNestedProperty("model.uid", obj),
            version = Utils.getNestedProperty("model.version", obj);

        if (!uid) {
            log.error("Impossible to find model.uid. Abort addToGrid() fn");
            return;
        }

        var config = {
            uid: uid
        };

        if (version) {
            config.version = version;
        }

        this._addToGrid(config);

    };

    Analysis.prototype._removeFromGrid = function (obj) {

        delete this.gridItems[obj.id];
        this.grid.redraw();

        this._trigger("removed", {
            instance: this
        });

        // hide courtesy message if it is first box
        this._checkCourtesy();

    };

    Analysis.prototype._bindBoxEventListeners = function (Box) {

        var self = this;

        Box.on("minimize", function (payload) {
            self._addToStack(payload);
            self.grid.redraw();
            self._checkCourtesy()
        });

        Box.on("remove", function (payload) {
            self._removeFromGrid(payload);
        });

        Box.on("clone", function (payload) {
            self._addToGrid(payload)
        });

        Box.on("resize", function (payload) {
            self._setBoxSize(payload)
        });

        Box.on("initializated", function (payload) {
            self._trigger("initialized", payload);
        });

        Box.on("ready", function () {
            self.grid.redraw();
        });

        Box.on("noelem", function (param) {
            self._trigger("noelem", {
                instance: self
            });
        });

    };

    //Stack

    Analysis.prototype._addToStack = function (obj) {

        var $item = this._createStackItem(obj);

        this.stackItems[obj.id] = {model: obj, el: $item};

        this.$stack.append($item);

    };

    Analysis.prototype._removeFromStack = function ($item) {

        this._unbindStackItemEventListeners($item);

        $item.remove();

    };

    Analysis.prototype._createStackItem = function (obj) {

        var $html = $(TemplateItem($.extend(true, {}, i18nLabels, obj)));

        this._bindStackItemEventListeners($html);

        return $html;
    };

    Analysis.prototype._bindStackItemEventListeners = function ($html) {

        $html.find(s.STACK_ITEM_REMOVE_BUTTON).on('click', _.bind(function (e) {
            var $html = $(e.target).closest(s.STACK_ITEM),
                id = $html.attr("data-id");

            //remove item from list
            delete this.gridItems[id];

            this._removeFromStack($html);

        }, this));

        $html.find(s.STACK_ITEM_ENLARGE_BUTTON).on('click', _.bind(function (e) {

            var $html = $(e.target).closest(s.STACK_ITEM),
                id = $html.attr("data-id"),
                item = this._findModelFromStack(id),
                model = item.model;

            //remove item from list

            delete this.stackItems[id];

            this._removeFromStack($html);

            this._addToGrid(model);

        }, this));

    };

    Analysis.prototype._setBoxSize = function (model) {

        var item = this._findModelFromGrid(model.id),
            $el = item.el,
            size = model.size || "";

        if ($el.length === 0) {

            log.error("Impossible to find $el for " + model.id);
        }

        $el.attr("data-size", size);

        this.grid.redraw();

    };

    Analysis.prototype._unbindStackItemEventListeners = function ($html) {

        $html.find(s.STACK_ITEM_REMOVE_BUTTON).off();
        $html.find(s.STACK_ITEM_ENLARGE_BUTTON).off();

    };

    // courtesy

    Analysis.prototype._checkCourtesy = function () {

        var length = Object.keys(this.gridItems).length;

        if (length === 0) {
            this._showCourtesy();
        }

        if (length !== 0) {
            this._hideCourtesy();
        }

    };

    Analysis.prototype._showCourtesy = function () {

        this.$catalogButton.removeClass(this.pulsingButtonClassName);

        this.$el.find(s.COURTESY).show();
    };

    Analysis.prototype._hideCourtesy = function () {

        this.$catalogButton.addClass(this.pulsingButtonClassName);

        this.$el.find(s.COURTESY).hide();
    };

    // utils

    Analysis.prototype._getEventName = function (evt, excludeId) {

        var baseEvent = EVT[evt] ? EVT[evt] : evt;

        return excludeId === true ? baseEvent : baseEvent + "." + this.id;
    };

    Analysis.prototype._findModelFromGrid = function (id) {
        return this._findModelFromList(this.gridItems, id);
    };

    Analysis.prototype._findModelFromStack = function (id) {
        return this._findModelFromList(this.stackItems, id);
    };

    Analysis.prototype._findModelFromList = function (list, id) {

        return list[id];
    };

    //disposition

    Analysis.prototype._unbindEventListeners = function () {

        //amplify.unsubscribe(this._getEventName("view"), this._onViewResult);

    };

    Analysis.prototype._showError = function (err) {

        _.each(err, _.bind(function (e) {

            var $li = $("<li>" + i18nLabels[e] + "</li>");

            this.$el.find(s.ERROR_CONTAINER).show().append($li);

        }, this));
    };

    Analysis.prototype._hideError = function () {

        this.$el.find(s.ERROR_CONTAINER).hide();
    };

    Analysis.prototype._setObjState = function (key, val) {

        this._assign(this.state, key, val);

    };

    Analysis.prototype._getObjState = function (path) {

        return Utils.getNestedProperty(path, this.state);
    };

    Analysis.prototype._assign = function (obj, prop, value) {
        if (typeof prop === "string")
            prop = prop.split(".");

        if (prop.length > 1) {
            var e = prop.shift();
            this.assign(obj[e] =
                    Object.prototype.toString.call(obj[e]) === "[object Object]"
                        ? obj[e]
                        : {},
                prop,
                value);
        } else {
            obj[prop[0]] = value;
        }
    };

    Analysis.prototype._getNestedProperty = function (path, obj) {

        var obj = $.extend(true, {}, obj),
            arr = path.split(".");

        while (arr.length && (obj = obj[arr.shift()]));

        return obj;

    };


    return Analysis;
});