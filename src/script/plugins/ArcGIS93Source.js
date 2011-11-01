/**
 * @requires plugins/LayerSource.js
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

var arcgisVar = {};
arcgisVar.arcgisLoaded   = false;
arcgisVar.arcgisDownload = false;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var arcgisStore = new Ext.data.JsonStore({ 
	url       : 'arcgis.json',
	root      : 'arcgis',
	fields    : [ 'params', 'options', 'servers'],
	listeners :
    {
   		load : function()
   		{
			arcgisVar.arcgisLoaded   = true;
			arcgisVar.arcgisDownload = false;
   		},
		loadexception : function(o, arg, nul, e)
		{
			alert("arcgisStore.listeners - LoadException : " + e);         
		} 
	}  
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function downloadArcgis()
{
	if (!arcgisVar.arcgisLoaded && !arcgisVar.arcgisDownload)
	{
		arcgisStore.load();
		arcgisVar.arcgisDownload = true;
	}
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
gxp.plugins.ArcGIS93Source = Ext.extend(gxp.plugins.LayerSource,
{
    ptype  : "gxp_arcgis93source",

	layersLoader : new Ext.data.JsonStore({ 
		url       : "",
		proxy     : null,
		root      : 'layers',
//		fields    : [{name : 'name', mapping:'id'}, {name: 'title', mapping: 'name'}],
		fields    : ['id', {name: 'title', mapping: 'name'}],
		listeners :
		{
			beforeload : function()
			{
				this.proxy = new Ext.data.HttpProxy({  
					url   : this.url
				});
            },
			loadexception : function(o, arg, nul, e)
			{
				alert("layersLoader.listeners - LoadException : " + e);
			} 
		}
	}),
	getLayersStore : function ()
	{
		downloadArcgis();
		return this.arcgisStore;
	},

	getLayersStore : function (url)
	{
		this.layersLoader.url = url;
		this.layersLoader.load();
		return this.layersLoader;
	},
	
	createLayer: function(name, url)
	{
		return new OpenLayers.Layer.ArcGIS93Rest(name, url, arcgisStore.reader.jsonData.arcgis.params, arcgisStore.reader.jsonData.arcgis.options);
	},
	createBaseLayers : function()
	{
		layers = [];
		for (idx in app.map.layers)
		{
			if (app.map.layers[idx].source === 'arcgis93')
				layers.push(this.createLayer (app.map.layers[idx].name, app.map.layers[idx].url));
		}
		return layers;
	},
	extractServerURL : function(title)
	{
		var layersURL;
		if (arcgisStore && arcgisStore.reader.jsonData.arcgis.servers.length > 0)
		{
			for (var idx=0; idx < arcgisStore.reader.jsonData.arcgis.servers.length; ++idx) 
			{
				if (title === arcgisStore.reader.jsonData.arcgis.servers[idx].title)
				{
					layersURL = arcgisStore.reader.jsonData.arcgis.servers[idx].url;
					break;
				}
			}
		}
		return layersURL;
	},
	getServerURL : function(title)
	{
		var serverURL = this.extractServerURL (title);
		if (serverURL.length > 0)
			serverURL = serverURL + '/export';
		return serverURL;
	},
	getLayersURL : function(title)
	{
		var layersURL = this.extractServerURL (title);
		if (layersURL.length > 0)
			layersURL = layersURL + '?f=json';
		return layersURL;
	},
    createStore: function()
	{
		layers = this.createBaseLayers(),
        this.store = new GeoExt.data.LayerStore({
            layers: layers,
            fields: [
                {name: "source"  , type: "string"}, 
                {name: "url"     , type: "string"},
                {name: "name"    , type: "string"},
                {name: "title"   , type: "string"},
                {name: "group"   , type: "string" , defaultValue: "background"},
                {name: "fixed"   , type: "boolean", defaultValue: true},
                {name: "selected", type: "boolean", defaultValue: true}
            ]
        });
        this.store.each(function(l)
		{
            l.set("group", "background");
		});
        this.fireEvent("ready", this);
    },
    
    createLayerRecord: function(config)
	{
        var record;
        var index = this.store.findExact("name", config.name);
        if (index > -1) 
		{
            record = this.store.getAt(index).copy(Ext.data.Record.id({}));
			var layer = record.getLayer().clone();
			if (config.title)
			{
				layer.setName(config.title);
				record.set("title", config.title);
			}
	
			if ("visibility" in config) {
				layer.visibility = config.visibility;
			}
//			record.draggable = true;
            
			record.setLayer(layer);
			record.set("selected"  , config.selected || true);
//			record.set("selected"  , true               );
			record.set("source"    , 'arcgis93'         ); // config.source      );
			record.set("name"      , config.name        );
			record.set("url"       , layer.url          );
			record.set("properties", "gxp_wmslayerpanel");
			record.data.layer = layer;

			if ("group" in config) {
				record.set("group", config.group);
			} else 
				record.set("group", null);
			
			record.commit();
		};
        return record;
    },
    createRecord: function(server, layer)
	{
		var record = new GeoExt.data.LayerRecord();
		record.setLayer(layer);

		record.set("title"     , layer.name         );
		record.set("selected"  , true               );
		record.set("source"    , 'arcgis93'         );
        record.set("url"       , layer.url          );
		record.set("properties", "gxp_wmslayerpanel");
		record.set("name"      , server + ' : ' + layer.name);
		record.data.layer = layer;
		record.commit();
		
		return record;
    },
    getConfigForRecord: function(record) {
        var layer = record.getLayer();
        return {
            source     : record.get("source"    ),
            name       : record.get("name"      ),
            title      : record.get("title"     ),
            group      : record.get("group"     ),
            fixed      : record.get("fixed"     ),
            selected   : record.get("selected"  ),
            url        : record.get("url"       ),
            visibility : layer.getVisibility()   ,
            opacity    : layer.opacity || undefined
        };
    }
});

Ext.preg(gxp.plugins.ArcGIS93Source.prototype.ptype, gxp.plugins.ArcGIS93Source);
