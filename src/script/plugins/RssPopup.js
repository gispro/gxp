var wmsTool         = null;
var rssVectors      = [];
var selectControl   = null;
var selectedFeature = null;

function rssPopupGetInfoForClick(evt)
{
	if (selectedFeature != null)
	{
		wmsTool.displayPopup({xy : evt.xy}, 'RSS : ' + selectedFeature.attributes.data['title'], 
							parseRSSContentHTML( selectedFeature.attributes.data['contentHTML']), false);
		selectControl.unselect(selectedFeature);
		selectedFeature = null;
	}

	this.events.triggerEvent("beforegetfeatureinfo", {xy: evt.xy});
	OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
	this.request(evt.xy, {});
}
	
function parseRSSContentHTML (text)
{
	if (text)
	{
		if ((text.indexOf ("<b>Дата:") === -1) && (text.indexOf ("Дата:") > 0))
		{
			text = text.replace ("Дата:"     , "<b>Дата:</b>"             );
			text = text.replace ("Сообщение:", "<br><b>Сообщение:</b><br>");
		} else if ((text.indexOf ("<b>Дата</b>:") > 0) && ((text.indexOf ("<b>Видимость, км:</b>") > 0) || (text.indexOf ("<b>Ветер, м/c:</b>") > 0)))
		{
			text = text.replace ("<b>Дата</b>:"             ,  "<table style=\"margin:5px\"><tr><td width=130px><b>Дата</b></td><td>");
			text = text.replace ("<b>Т воды, С&deg;:</b>"   , "</td></tr><tr><td></tr><td><b>Т воды, С&deg;</b></td><td>");
			text = text.replace ("<b>Т воздуха, С&deg;:</b>", "</td></tr><tr><td></tr><td><b>Т воздуха, С&deg;</b></td><td>");
			text = text.replace ("<b>Ветер, м/c:</b>"       , "</td></tr><tr><td></tr><td><b>Ветер, м/c</b></td><td>");
			text = text.replace ("<b>Высота волны, м:</b>"  , "</td></tr><tr><td><b>Высота волны, м</b></td><td>");
			text = text.replace ("<b>Видимость, км:</b>"    , "</td></tr><tr><td></tr><td><b>Видимость, км</b></td><td>");
			
			text = text + '</td></tr></table>';
		}
	}
	return text;
}

function onFeatureSelect(feature)
{
	selectedFeature = feature;
}
function createRssVector (name, icon_url) 
{
	var rssVector = new OpenLayers.Layer.Vector(name,
		{
			styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
						externalGraphic	: icon_url, 
						graphicOpacity	: 1,
						strokeWidth		: 2,
						strokeColor		: '#47FFFF',
						fillColor		: '#9dfdfd',
						fillOpacity		: 0.4,
						pointRadius		: 5
                    }, OpenLayers.Feature.Vector.style["default"])
					, {
							rules: [
								new OpenLayers.Rule({
									name   : 'RSS',
									title  : 'RSS',
				                   symbolizer: { externalGraphic: icon_url }
								})
							]
						}
					),
                    "select": new OpenLayers.Style({
                        externalGraphic : icon_url
                    })
                })
		});
	app.mapPanel.map.addLayer(rssVector);
	return rssVector;
}

function RssPopupParseData (ajaxRequest) 
{
	var doc = ajaxRequest.responseXML;
	if (!doc || !doc.documentElement) {
		doc = OpenLayers.Format.XML.prototype.read(ajaxRequest.responseText);
	}
        
	if (this.useFeedTitle) {
		var name = null;
		try {
			name = doc.getElementsByTagNameNS('*', 'title')[0].firstChild.nodeValue;
		}
		catch (e) {
			name = doc.getElementsByTagName('title')[0].firstChild.nodeValue;
		}
		if (name) {
			this.setName(name);
		}    
	}
	var options = {};
	
	OpenLayers.Util.extend(options, this.formatOptions);
        
	if (this.map && !this.projection.equals(this.map.getProjectionObject())) {
		options.externalProjection = this.projection;
		options.internalProjection = this.map.getProjectionObject();
	}    
        
	var format = new OpenLayers.Format.GeoRSS(options);
	var features = format.read(doc);

	var rssVector  = null;
	var style_mark = null;
	for (var i=0, len=features.length; i<len; i++)
	{
		var data = {};
		var feature = features[i];
			
		if (!feature.geometry) {
			continue;
		}
		var title       = feature.attributes.title       ? feature.attributes.title       : "Untitled";
		var description = feature.attributes.description ? feature.attributes.description : "No description.";

		if (feature.geometry instanceof OpenLayers.Geometry.Polygon)
		{
			if (rssVector == null)
				rssVector = createRssVector(name, null);
			rssVector.addFeatures(features);
		}
		else if (feature.geometry instanceof OpenLayers.Geometry.Point)
		{
			var location = feature.geometry.getBounds().getCenterLonLat();

			data.icon = this.icon == null ? OpenLayers.Marker.defaultIcon() : this.icon.clone();

			data.title = name;
			data.description = description;

			var contentHTML = '<div style="float:left;font-size:1.2em;width:100%">';
			contentHTML += '<table><tr><td><img src="' + this.icon.url + '" style="margin-top:5px;margin-left:5px"></td>';
			contentHTML += '<td><b style="margin:3px 5px 0px 5px">' + title + '</b></td></tr></table><hr>';
			contentHTML += '</div>';
			contentHTML += '<div style="float:left;margin:0px 5px 5px 5px">' + description + '</div>';

			data['contentHTML'] = contentHTML;

			if (rssVector == null)
			{
				rssVector = createRssVector(name, data.icon.url);
				
				rssVectors.push(rssVector)
				if (selectControl != null)
					this.map.removeControl(selectControl);

				selectControl = new OpenLayers.Control.SelectFeature(rssVectors, {onSelect: onFeatureSelect});
				this.map.addControl(selectControl);
				selectControl.activate();
			}
			var markerStyle = {externalGraphic: data.icon.url, graphicWidth: 21, graphicHeight: 25, graphicXOffset : -10.5, graphicYOffset: -25, graphicOpacity: 0.7};
			var point       = new OpenLayers.Geometry.Point(location.lon, location.lat);
			rssVector.addFeatures([new OpenLayers.Feature.Vector(point, {title: name, data : data}, markerStyle)]);
			}
	}
	this.events.triggerEvent("loadend");
};
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

// extend GeoExt.tree.LayerNode.render
function RssPopupLayerNodeRender (bulkRender)
 {
	var layer = this.layer instanceof OpenLayers.Layer && this.layer;
	if (layer.id.indexOf ('OpenLayers.Layer.GeoRSS') === -1)
	{
		if(!layer)
		{
			// guess the store if not provided
			if(!this.layerStore || this.layerStore == "auto")
			{
				this.layerStore = GeoExt.MapPanel.guess().layers;
			}
			// now we try to find the layer by its name in the layer store
			var i = this.layerStore.findBy(function(o)
				{
					return o.get("title") == this.layer;
				}, this);
			if( i != -1)
			{
				// if we found the layer, we can assign it and everything will be fine
				layer = this.layerStore.getAt(i).getLayer();
			}
		}
		if (!this.rendered || !layer)
		{
			var ui = this.getUI();
            
			if(layer)
			{
				this.layer = layer;
				// no DD and radio buttons for base layers
				if(layer.isBaseLayer)
				{
					this.draggable = false;
					Ext.applyIf(this.attributes, { checkedGroup: "gx_baselayer" });
				}
				if(!this.text) {
					this.text = layer.name;
				}
                
				ui.show();
				this.addVisibilityEventHandlers();
			} else {
				ui.hide();
			}
			if(this.layerStore instanceof GeoExt.data.LayerStore) {
				this.addStoreEventHandlers(layer);
			} 
		}
		GeoExt.tree.LayerNode.superclass.render.apply(this, arguments);
	}
 };
 
// extend gxp.Viewer.getState()
function RssPopupGetState()
 {
        // start with what was originally given
        var state = Ext.apply({}, this.initialConfig);
        
        // update anything that can change
        var center = this.mapPanel.map.getCenter();
        Ext.apply(state.map, {
            center: [center.lon, center.lat],
            zoom: this.mapPanel.map.zoom,
            layers: []
        });
        
        // include all layer config (and add new sources)
        this.mapPanel.layers.each(function(record){
            var layer = record.getLayer();
            if (layer.displayInLayerSwitcher && (layer.CLASS_NAME  !== 'OpenLayers.Layer.Vector'))
			{
                var id = record.get("source");
                var source = this.layerSources[id];
                if (!source) {
                    throw new Error("Could not find source for layer '" + record.get("name") + "'");
                }
                // add layer
                state.map.layers.push(source.getConfigForRecord(record));
                if (!state.sources[id]) {
                    state.sources[id] = Ext.apply({}, source.initialConfig);
                }
            }
        }, this);
        
        return state;
};

/*
function RssPopupAddLegend (record, index)
{
//		if (record.getLayer().name.indexOf('Scale') === -1)  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//		if (record.getLayer().name.indexOf(TEMPL_LAYER_ANIMATION) === -1)  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//	console.log ('RssSourceAddLegend : ' + record);
	if (this.filter(record) === true)
	{
		var layer = record.getLayer();
		index = index || 0;
		var legend;
		var types = GeoExt.LayerLegend.getTypes(record, this.preferredTypes);
		if(layer.displayInLayerSwitcher && !record.get('hideInLegend') && types.length > 0)
		{
			this.insert(index, {
						xtype: types[0],
						id: this.getIdForLayer(layer),
						layerRecord: record,
						hidden: !((!layer.map && layer.visibility) || (layer.getVisibility() && layer.calculateInRange()))
			});
		}
	}
}
*/