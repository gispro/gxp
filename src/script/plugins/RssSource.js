/**
 * @requires plugins/LayerSource.js
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

gxp.plugins.RssSource = Ext.extend(gxp.plugins.LayerSource,
{
    ptype : "gxp_rsssource",
	layersStore : new Ext.data.JsonStore({ 
		root   : 'layers',
		fields : ['title', 'name']
	}),
	createRssLayer: function(img, url)
	{
            var icon  = new OpenLayers.Icon(img, new OpenLayers.Size(21,25));
            var parts = (url?url.split("/"):null) ;
            var name;
            if (parts == null){
                name = "Unreachable";
            }else{
                name = parts[parts.length-1];
            }
            return new OpenLayers.Layer.GeoRSS (name, url, {'projection': new OpenLayers.Projection("EPSG:4326"), 'icon': icon});
	},
	getLayersStore : function ()
	{
		this.layersStore.loadData(app.map.rss_layers);

		return this.layersStore;
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
		record.set("name"  , title    );
		record.set("source", 'rss'    );
        if(layer)record.set("url"   , layer.url);
		record.data.layer = layer;
		record.commit();

		return record;
    },
    getConfigForRecord: function(record) {
        var layer = record.getLayer();
        return {
            source : record.get("source"),
            name   : record.get("name"  ),
			title  : record.get("title" ),
            timer  : record.get("timer" ),
            icon   : record.get("icon"  ),
            url    : record.get("url"   )
        };
    }
});

Ext.preg(gxp.plugins.RssSource.prototype.ptype, gxp.plugins.RssSource);
