/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/WMSSource.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WMSCSource
 */

/** api: (extends)
 *  plugins/WMSSource.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WMSCSource(config)
 *
 *    Plugin for using WMS-C layers with :class:`gxp.Viewer` instances. The
 *    plugin issues a GetCapabilities request to create a store of the WMS's
 *    layers. If tilesets are available, it will use them.
 */   
/** api: example
 *  Configuration in the  :class:`gxp.Viewer`:
 *
 *  .. code-block:: javascript
 *
 *    defaultSourceType: "gxp_wmscsource",
 *    sources: {
 *        "opengeo": {
 *            url: "http://suite.opengeo.org/geoserver/wms"
 *        }
 *    }
 *
 *  A typical configuration for a layer from this source (in the ``layers``
 *  array of the viewer's ``map`` config option would look like this:
 *
 *  .. code-block:: javascript
 *
 *    {
 *        source: "opengeo",
 *        name: "world",
 *        group: "background"
 *    }
 *
 */
gxp.plugins.WMSCSource = Ext.extend(gxp.plugins.WMSSource, {
    
    /** api: ptype = gxp_wmscsource */
    ptype: "gxp_wmscsource",
    
    /** api: config[version]
     *  ``String``
     *  Only WMS 1.1.1 is supported at the moment.
     */
    version: "1.1.1",

    /** private: method[constructor]
     */
    constructor: function(config) {
        config.baseParams = {
            SERVICE: "WMS",
            REQUEST: "GetCapabilities"/*,
            TILED: true*/
        };
        gxp.plugins.WMSCSource.superclass.constructor.apply(this, arguments); 
        this.format = new OpenLayers.Format.WMSCapabilities({profile: 'WMSC'});
    },

    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
        var original = gxp.plugins.WMSCSource.superclass.createLayerRecord.apply(this, arguments);
        var record = original
        var caps = this.store.reader.raw.capability;
        //console.log(caps)
        var tileSets = (caps && caps.vendorSpecific && caps.vendorSpecific) ? 
            caps.vendorSpecific.tileSets : null;
        if (tileSets !== null) {

            // add additional fields
            var fields = [
                {name: "resolutions" }, //Array
                {name: "minResolution" }, //Array
                {name: "maxResolution" }, //Array
                {name: "wgsMaxExtentArray" } //Array
            ];

            original.fields.each(function(field) {
                fields.push(field);
            });

            var resolutions = {}, minResolution = {}, maxResolution = {}, wgsMaxExtentArray = null

            for (var i=0, len=caps.layers.length; i<len; i++) {
                var layer = caps.layers[i];
                if( ( config.name == layer.name ) && layer.bbox["EPSG:4326"] ){
                  wgsMaxExtentArray = layer.bbox["EPSG:4326"].bbox
                }
            }

            for (var i=0, len=tileSets.length; i<len; i++) {
                var tileSet = tileSets[i];
                if( config.name == tileSet.layers ){
                  var srs
                  for( var k in tileSet.srs) srs = k
                  resolutions[srs] = tileSet.resolutions
                  minResolution[srs] = tileSet.resolutions[0]
                  maxResolution[srs] = tileSet.resolutions[tileSet.resolutions.length-1]
                  //maxExtent[srs] = new OpenLayers.Bounds.fromArray( tileSet.bbox[srs].bbox )
                  if(!wgsMaxExtentArray && srs == "EPSG:4326" && tileSet.bbox["EPSG:4326"]) wgsMaxExtentArray = tileSet.bbox["EPSG:4326"].bbox
                }
            }

            var data = Ext.applyIf({
                resolutions: resolutions,
                minResolution: minResolution,
                maxResolution: maxResolution,
                wgsMaxExtentArray: wgsMaxExtentArray
            }, original.data);

            var layer = original.get("layer");

            var Record = GeoExt.data.LayerRecord.create(fields);
            record = new Record(data, layer.id);

            var mapProjection = this.getMapProjection();
            // look for tileset with same name and equivalent projection
            for (var i=0, len=tileSets.length; i<len; i++) {
                var tileSet = tileSets[i];
                if (tileSet.layers === layer.params.LAYERS) {
                    var tileProjection;
                    for (var srs in tileSet.srs) {
                        tileProjection = new OpenLayers.Projection(srs);
                        break;
                    }
                    if (mapProjection.equals(tileProjection)) {
                        var bbox = tileSet.bbox[srs].bbox;
                        layer.projection = tileProjection;
                        layer.addOptions({
                            //resolutions: tileSet.resolutions,
                            tileSize: new OpenLayers.Size(tileSet.width, tileSet.height),
                            tileOrigin: new OpenLayers.LonLat(bbox[0], bbox[1])
                        });
                        // unless explicitly configured otherwise, use cached version
                        layer.params.TILED = (config.cached !== false) && true;
                        break;
                    }
                }
            }
        }
        return record;
    },

    /** api: method[getConfigForRecord]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :returns: ``Object``
     *
     *  Create a config object that can be used to recreate the given record.
     */
    getConfigForRecord: function(record) {
        var config = gxp.plugins.WMSCSource.superclass.getConfigForRecord.apply(this, arguments);
        // the "tiled" property is already used to indicate singleTile
        // the "cached" property will indicate whether to send the TILED param
        return Ext.apply(config, {
            cached: !!record.getLayer().params.TILED
        });
    }

});

Ext.preg(gxp.plugins.WMSCSource.prototype.ptype, gxp.plugins.WMSCSource);
