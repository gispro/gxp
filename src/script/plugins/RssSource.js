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

	getLayersStore : function (url)
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
		var layer = null;
		for (idx in app.map.rss_layers.layers)
		{
			if (title === app.map.rss_layers.layers[idx].title)
			{
				var icon  = new OpenLayers.Icon(app.map.rss_layers.layers[idx].icon, new OpenLayers.Size(21,25));
				var url   = app.map.rss_layers.layers[idx].url;
//				var parts = app.map.rss_layers.layers[idx].url.split("/");
				var name;
				var parts = (app.map.rss_layers.layers[idx].url ? app.map.rss_layers.layers[idx].url.split("/") : null);
				if (parts)
					name = parts[parts.length-1];
				else
					name = 'Unreachable';

				layer = new OpenLayers.Layer.GeoRSS (name, url, {'projection': new OpenLayers.Projection("EPSG:4326"), 'icon': icon});
				break;
			}
		}
		
		record.setLayer(layer);
		record.set("title"     , title                );
		record.set("name"      , parts[parts.length-1]);
		record.set("source"    , 'rss'                );
        record.set("url"       , layer.url            );
		record.set("properties", "gxp_wmslayerpanel"  );
		record.data.layer = layer;
		
		record.commit();

		return record;
    },
    getConfigForRecord: function(record) {
        var layer = record.getLayer();
        return {
            source     : record.get("source"),
            name       : record.get("name"  ),
			title      : record.get("title" ),
            timer      : record.get("timer" ),
            icon       : record.get("icon"  ),
            url        : record.get("url"   ),
            visibility : layer.getVisibility(),
            opacity    : layer.opacity || undefined
        };
    }
});

Ext.preg(gxp.plugins.RssSource.prototype.ptype, gxp.plugins.RssSource);
