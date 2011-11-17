/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = GISMeasure
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GISMeasure(config)
 *
 *    Provides two actions for measuring length and area.
 */
gxp.plugins.GISMeasure = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_measure */
    ptype: "gxp_gis_measure",

    /** api: config[outputTarget]
     *  ``String`` Popups created by this tool are added to the map by default.
     */
    outputTarget: "map",

    /** api: config[lengthMenuText]
     *  ``String``
     *  Text for measure length menu item (i18n).
     */
    lengthMenuText: "Length",

    /** api: config[areaMenuText]
     *  ``String``
     *  Text for measure area menu item (i18n).
     */
    areaMenuText: "Area",

    /** api: config[lengthTooltip]
     *  ``String``
     *  Text for measure length action tooltip (i18n).
     */
    lengthTooltip: "Measure length",

    /** api: config[areaTooltip]
     *  ``String``
     *  Text for measure area action tooltip (i18n).
     */
    areaTooltip: "Measure area",

    /** api: config[measureTooltip]
     *  ``String``
     *  Text for measure action tooltip (i18n).
     */
    measureTooltip: "Measure",

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.GISMeasure.superclass.constructor.apply(this, arguments);
    },

    /** private: method[destroy]
     */
    destroy: function() {
        this.button = null;
        gxp.plugins.GISMeasure.superclass.destroy.apply(this, arguments);
    },

    /** private: method[createMeasureControl]
     * :param: handlerType: the :class:`OpenLayers.Handler` for the measurement
     *     operation
     * :param: title: the string label to display alongside results
     *
     * Convenience method for creating a :class:`OpenLayers.Control.Measure`
     * control
     */
    createMeasureControl: function(options) {
		return new GISMeasure(options);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        this.activeIndex = 0;
        this.button = new Ext.SplitButton({
            iconCls: "gxp-icon-measure-length",
            tooltip: this.measureTooltip,
            enableToggle: true,
            toggleGroup: this.toggleGroup,
            allowDepress: true,
            handler: function(button, event) {
                if(button.pressed) {
                    button.menu.items.itemAt(this.activeIndex).setChecked(true);
                }
            },
            scope: this,
            listeners: {
                toggle: function(button, pressed) {
                    // toggleGroup should handle this
                    if(!pressed) {
                        button.menu.items.each(function(i) {
                            i.setChecked(false);
                        });
                    }
                },
                render: function(button) {
                    // toggleGroup should handle this
                    Ext.ButtonToggleMgr.register(button);
                }
            },
            menu: new Ext.menu.Menu({
                items: [
                    new Ext.menu.CheckItem(
                        new GeoExt.Action({
                            text: this.lengthMenuText,
                            iconCls: "gxp-icon-measure-length",
                            toggleGroup: this.toggleGroup,
                            group: this.toggleGroup,
                            listeners: {
                                checkchange: function(item, checked) {
                                    this.activeIndex = 0;
                                    this.button.toggle(checked);
                                    if (checked) {
                                        this.button.setIconClass(item.iconCls);
                                    }
                                },
                                scope: this
                            },
                            map: this.target.mapPanel.map,
                            control: this.createMeasureControl(
                                {measureType:'distance', map:this.target.mapPanel.map, handlerOptions: {"single": true}}, this.lengthTooltip)
                        })
                    ),
                    new Ext.menu.CheckItem(
                        new GeoExt.Action({
                            text: this.areaMenuText,
                            iconCls: "gxp-icon-measure-area",
                            toggleGroup: this.toggleGroup,
                            group: this.toggleGroup,
                            allowDepress: false,
                            listeners: {
                                checkchange: function(item, checked) {
                                    this.activeIndex = 1;
                                    this.button.toggle(checked);
                                    if (checked) {
                                        this.button.setIconClass(item.iconCls);
                                    }
                                },
                                scope: this
                            },
                            map: this.target.mapPanel.map,
                            control: this.createMeasureControl(
								{measureType:'square', map:this.target.mapPanel.map, handlerOptions: {"single": true}},	//distance/square								
                                 this.areaTooltip)
                        })
                    )
                ]
            })
        });

        return gxp.plugins.GISMeasure.superclass.addActions.apply(this, [this.button]);
    }
        
});

Ext.preg(gxp.plugins.GISMeasure.prototype.ptype, gxp.plugins.GISMeasure);
