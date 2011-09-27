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

/*	
	createLayer: function(name, url)
	{
//		return new OpenLayers.Layer.ArcGIS93Rest(name, url, app.map.params, app.map.options);
		return new OpenLayers.Layer.GeoRSS (name, url, {'projection': new OpenLayers.Projection("EPSG:4326")}); //, 'icon': icon});
	},
	createLayers : function()
	{
		layers = [];
		for (idx in app.map.rss_layers.layers)
			layers.push(this.createLayer (app.map.rss_layers.layers[idx].name, app.map.rss_layers.layers[idx].url));
//		console.log ('... ' + app.map.rss_layers + ', ' + app.map.rss_layers.layers)
//		for (var i = 0; i < app.map.rss_layers.layers.length; i++)
//			layers.push(this.createLayer (app.map.rss_layers[i].name, app.map.rss_layers[i].url));
		return layers;
	},

    createStore: function()
	{
		layers = this.createLayers(),
        this.store = new GeoExt.data.LayerStore({
            layers: layers,
            fields: [
                {name: "source"  , type: "string", defaultValue: "rss"}, 
                {name: "url"     , type: "string"},
                {name: "name"    , type: "string"},
                {name: "title"   , type: "string"},
            ]
        });
        this.fireEvent("ready", this);
    },
*/
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

//				layer = new OpenLayers.Layer.GeoRSS (parts[parts.length-1], url, {'projection': new OpenLayers.Projection("EPSG:4326"), 'icon': icon});
				layer = new OpenLayers.Layer.GeoRSS (name, url, {'projection': new OpenLayers.Projection("EPSG:4326"), 'icon': icon});
//				console.log ('name = ' + name + ', url = ' + url);
/*				
				layer = new OpenLayers.Layer.Vector(title,
						{
							styleMap: new OpenLayers.StyleMap({
								"default": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
										externalGraphic	: app.map.rss_layers.layers[idx].icon, 
										graphicOpacity	: 1,
										strokeWidth		: 2,
										strokeColor		: '#47FFFF',
										fillColor		: '#9dfdfd',
										fillOpacity		: 0.4,
										pointRadius		: 5
									}, OpenLayers.Feature.Vector.style["default"]),
									{
										rules: [
											new OpenLayers.Rule({
												name   : 'RSS',
												title  : 'RSS',
												symbolizer: { externalGraphic: app.map.rss_layers.layers[idx].icon }})
										]
									}),
								"select": new OpenLayers.Style({
									externalGraphic : app.map.rss_layers.layers[idx].icon
								})
							}),
							url        : app.map.rss_layers.layers[idx].url,
							params     : {FORMAT : 'image/png', TRANSPARENT : true, OPACITY : 1, LAYERS : location},
							protocol   : new OpenLayers.Protocol.HTTP({
									url    : app.map.rss_layers.layers[idx].url,
//									format : OpenLayers.Format.GeoRSS
									format : new OpenLayers.Format.GeoRSS(parts[parts.length-1], app.map.rss_layers.layers[idx].url, {
											'projection': new OpenLayers.Projection("EPSG:4326"),
											'icon' : icon})
									})
							//, strategies: [new OpenLayers.Strategy.Fixed()]
						});
				// app.mapPanel.map.addLayer(layer);
*/						
				break;
			}
		}
/*
 vector_layer = new OpenLayers.Layer.Vector("More Advanced Vector Layer",{
              protocol: new OpenLayers.Protocol.HTTP({
                url: 'admpol8000.geojson',
                format: new OpenLayers.Format.GeoJSON({
                'internalProjection': new OpenLayers.Projection("EPSG:102012"),
                'externalProjection': new OpenLayers.Projection("EPSG:4326")})
              }),
              strategies: [new OpenLayers.Strategy.Fixed()]
             });
*/
		
		record.setLayer(layer);
		record.set("title"     , title                );
		record.set("name"      , parts[parts.length-1]);
		record.set("source"    , 'rss'                );
        record.set("url"       , layer.url            );
//		record.set("selected"  , true                 );
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
//			selected   : record.get("selected")
            visibility : layer.getVisibility(),
            opacity    : layer.opacity || undefined
        };
    }
});

Ext.preg(gxp.plugins.RssSource.prototype.ptype, gxp.plugins.RssSource);
