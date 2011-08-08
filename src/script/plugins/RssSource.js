/**
 * @requires plugins/LayerSource.js
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: RssSource(config)
 *
 *    Plugin for using ArcGIS93Source layers with :class:`gxp.Viewer` instances.
 */

 gxp.plugins.RssSource = Ext.extend(gxp.plugins.LayerSource,
 {
    ptype : "gxp_rsssource",
	layersStore : new Ext.data.JsonStore({ 
		root   : 'layers',
		fields    : ['title', 'name']
	}),
	createRssLayer: function(img, url)
	{
		var icon  = new OpenLayers.Icon(img, new OpenLayers.Size(21,25));
		var parts = url.split("/");            
		return new OpenLayers.Layer.GeoRSS (parts[parts.length-1], url, {'projection': new OpenLayers.Projection("EPSG:4326"), 'icon': icon});
	},
	getLayersStore : function ()
	{
		this.layersStore.loadData(app.map.rss_layers);

		return this.layersStore;
	},
    /** api: method[createStore]
     *  Creates a store of layer records. Fires "ready" when store is loaded.
     */
    createStore: function()
	{
		this.store = new GeoExt.data.LayerStore({
            fields: [
                {name: "timer"   , type: "string"}, 
                {name: "name"    , type: "string"},
                {name: "title"   , type: "string"},
                {name: "url"     , type: "string"},
                {name: "icon"    , type: "string"},
                {name: "fixed"   , type: "boolean", defaultValue: true},
                {name: "selected", type: "boolean", defaultValue: true}
            ]
        });

        this.fireEvent("ready", this);
    },
    createLayerRecord: function(config)
	{
		return this.createRecord (config.title, config.name);
	},
    createRecord: function(title, name)
	{
		var record = new GeoExt.data.LayerRecord();
		var icon;
		var url;
		var layer = null;
		for (idx in app.map.rss_layers.layers)
		{
			if (title === app.map.rss_layers.layers[idx].title)
			{
				layer = this.createRssLayer (app.map.rss_layers.layers[idx].icon, app.map.rss_layers.layers[idx].url);
				break;
			}
		}
		record.setLayer(layer);
		//record.set("name" , layer.name);
		record.set("title", name);

		record.set("selected", true);
		record.set("source"  , 'rss');
                record.set("url"     , layer.url);
		record.data.layer = layer;
		record.commit();
		
		return record;
    },
    getConfigForRecord: function(record) {
        var layer = record.getLayer();
        return {
            source: record.get("source"),
            name: record.get("name"),
	    title: record.get("title"),
            selected: record.get("selected"),
            timer: record.get("timer"),
            icon: record.get("icon"),
            url: record.get("url")
        };
    }
});

Ext.preg(gxp.plugins.RssSource.prototype.ptype, gxp.plugins.RssSource);
