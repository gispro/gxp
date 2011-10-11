/**
 * @requires plugins/LayerSource.js
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

var	dataLoaded = false;
var downloadStart = false;

var	rssStore = new Ext.data.JsonStore({ 
	url       : 'rss.json',
	root      : 'layers',
	fields    : ['timer', 'name', 'title', 'icon', 'url'],
	listeners :
	{
		load : function()
		{
			dataLoaded    = true;
			downloadStart = false;
		},
		loadexception : function(o, arg, nul, e)
		{
			alert("rssStore.listeners - LoadException : " + e);
		} 
	}  
});

function downloadRSS()
{
	if (!dataLoaded && !downloadStart)
	{
		rssStore.load();
		downloadStart = true;
	}
};

gxp.plugins.RssSource = Ext.extend(gxp.plugins.LayerSource,
{
    ptype : "gxp_rsssource",
	layersStore : rssStore,

	getLayersStore : function (url)
	{
		downloadRSS();
		return this.layersStore;
	},

    createLayerRecord: function(config)
	{
		downloadRSS();
		var record = new GeoExt.data.LayerRecord();

		layer = new OpenLayers.Layer.GeoRSS (config.name, config.url, {'projection': new OpenLayers.Projection("EPSG:4326"), 'icon': config.icon});

		record.setLayer(layer);
		record.set("title"     , config.title         );
		record.set("name"      , config.name          );
		record.set("source"    , 'rss'                );
        record.set("icon"      , config.icon          );
        record.set("url"       , config.url           );
		record.set("properties", "gxp_wmslayerpanel"  );
		record.data.layer = layer;
		
		record.commit();
		return record;
	},
	
    createRecord: function(title, name)
	{
		var record = new GeoExt.data.LayerRecord();
		var layer  = null;
		var name;
		var icon;
		var url;
		for (var idx = 0; idx < this.layersStore.data.length; idx++)
		{
			if (title === this.layersStore.data.items[idx].get('title'))
			{
				icon  = new OpenLayers.Icon(this.layersStore.data.items[idx].get('icon'), new OpenLayers.Size(21,25));
				url   = this.layersStore.data.items[idx].get('url');
				var parts = (this.layersStore.data.items[idx].get('url') ? this.layersStore.data.items[idx].get('url').split("/") : null);
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
		record.set("name"      , name                 );
		record.set("source"    , 'rss'                );
        record.set("icon"      , icon                 );
        record.set("url"       , url                  );
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

/**
  * private: createDisplayPanel
  * Creates the display panel.
*/
// extends gxp.WMSLayerPanel.createDisplayPanel
function RssSourceCreateDisplayPanel()
{
	var record = this.layerRecord;
	var layer = record.getLayer();
	var opacity = layer.opacity;
	if(opacity == null) {
		opacity = 1;
	}
	var formats = [];
	var currentFormat = layer.params["FORMAT"].toLowerCase();
	Ext.each(record.get("formats"), function(format) {
		if(this.imageFormats.test(format)) {
			formats.push(format.toLowerCase());
		}
	}, this);
	if(formats.indexOf(currentFormat) === -1) {
		formats.push(currentFormat);
	}
	var transparent = layer.params["TRANSPARENT"];
	transparent = (transparent === "true" || transparent === true);
        
	return {
		title: this.displayText,
		style: {"padding": "10px"},
		layout: "form",
		labelWidth: 100,
		items: [{
			xtype: "slider",
			name: "opacity",
			fieldLabel: this.opacityText,
			value: opacity * 100,
			//TODO remove the line below when switching to Ext 3.2 final
			values: [opacity * 100],
			anchor: "99%",
			isFormField: true,
			listeners: {
				change: function(slider, value) {
					//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					if (layer.CLASS_NAME !== 'OpenLayers.Layer.Vector')
						layer.setOpacity(value / 100);
//					else
//						layer.params['OPACITY'] = (value / 100);
					//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					this.fireEvent("change");
				},
				scope: this
			}
		}, {
			xtype: "combo",
			fieldLabel: this.formatText,
			store: formats,
			value: currentFormat,
			mode: "local",
			triggerAction: "all",
			editable: false,
			anchor: "99%",
			listeners: {
				select: function(combo) {
					var format = combo.getValue();
					//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					if (layer.CLASS_NAME !== 'OpenLayers.Layer.Vector')
					{
						layer.mergeNewParams({
							format: format
						});
					}
					//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					if (format == "image/jpeg") {
						this.transparent = Ext.getCmp('transparent').getValue();
                        Ext.getCmp('transparent').setValue(false);
					} else if (this.transparent !== null) {
						Ext.getCmp('transparent').setValue(this.transparent);
						this.transparent = null;
					}
					Ext.getCmp('transparent').setDisabled(format == "image/jpeg");
					this.fireEvent("change");
				},
				scope: this
			}
		}, {
			xtype: "checkbox",
			id: 'transparent',
			fieldLabel: this.transparentText,
			checked: transparent,
			listeners: {
				check: function(checkbox, checked) {
					//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					if (layer.CLASS_NAME !== 'OpenLayers.Layer.Vector')
					{
						layer.mergeNewParams({
							transparent: checked ? "true" : "false"
						});
						this.fireEvent("change");
					}
					//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				},
                scope: this
			}
		}]
	};
};

