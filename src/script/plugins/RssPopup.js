var rssVar = {};
rssVar.dataLoaded      = false;
rssVar.downloadStart   = false;
rssVar.rssVectors      = [];
rssVar.selectControl   = null;
rssVar.selectedFeature = null;
rssVar.show            = 0;

var wmsTool = null;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function onFeatureSelect1(evt)
 {
	if (rssVar.show === 1)
	{
		rssVar.feature = evt.feature;
		var popup = new OpenLayers.Popup("featureRssPopup",
										rssVar.feature.geometry.getBounds().getCenterLonLat(),
										new OpenLayers.Size(250, 180),
										parseRSSContentHTML(evt.feature.data.data.contentHTML),
										false, onPopupClose);
		rssVar.feature.popup = popup;
		popup.feature = rssVar.feature;
		app.mapPanel.map.addPopup(popup, true);
	}
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*
function onFeatureUnselect1(evt)
 {
	var feature = evt.feature;
	if (feature.popup) {
		rssVar.feature.popup.feature = null;
		app.mapPanel.map.removePopup(rssVar.feature.popup);
		rssVar.feature.popup.destroy();
		rssVar.feature.popup = null;
	}
}
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function onPopupClose(evt) 
{
	if (rssVar.feature.layer)
		rssVar.selectControl.unselect(rssVar.feature);
	rssVar.feature.popup.destroy();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function parseRSSContentHTML(text)
{
	if (text)
	{
		if ((text.indexOf ('<b>Дата:') === -1) && (text.indexOf ('Дата:') > 0))
		{
//			text = text.replace ("Дата:"     , "<b>Дата:</b>"             );
//			text = text.replace ("Сообщение:", "<br><b>Сообщение:</b><br>");
			text = text.replace ('Дата:'     , '<b style="font-size:1.1em">Дата:</b>' );
			text = text.replace ('Сообщение:', '<br><b style="font-size:1.1em">Сообщение: </b>');
//			console.log (text);
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
//		text += '<button>Закрыть</button>'
	}
	return text;
}

function onFeatureSelect(feature)
{
	rssVar.selectedFeature = feature;
}

function createRssVector (title, location, icon_url) 
{
	var layer = new OpenLayers.Layer.Vector(title,
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
						}, OpenLayers.Feature.Vector.style["default"]),
						{
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
                }),
			params : {FORMAT : 'image/png', TRANSPARENT : true, OPACITY : 1, LAYERS : location}
		});
	app.mapPanel.map.addLayer(layer);
	return layer;
}

// extend OpenLayers.Layer.GeoRSS.parseData
function RssPopupParseData (ajaxRequest) 
{
	var doc = ajaxRequest.responseXML;
	if (!doc || !doc.documentElement) {
		doc = OpenLayers.Format.XML.prototype.read(ajaxRequest.responseText);
	}
        
	if (this.useFeedTitle)
	{
		var idx = ajaxRequest._object.responseXML.documentURI.indexOf("?url=") + 5;
		var url = ajaxRequest._object.responseXML.documentURI.substring (idx);
		url = url.replace("%3A", ":");
		while (url.indexOf("%2F") > 0)
			url = url.replace("%2F", "/");
//		console.log ('RssPopupParseData : documentURI = ' + ajaxRequest._object.responseXML.documentURI);
//		console.log ('RssPopupParseData : referrer = ' + ajaxRequest._object.responseXML.referrer);
//		console.log ('RssPopupParseData : url = ' + url);
		//var name = rssStore.getRecordName (url); // null;
	//	if (!name)
	//	{
			try {
				name = doc.getElementsByTagNameNS('*', 'title')[0].firstChild.nodeValue;
			}
			catch (e) {
				name = doc.getElementsByTagName('title')[0].firstChild.nodeValue;
			}
	//	}
		if (name) //{
			this.setName(name);
	//	}    
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

	if (features.length == 0)
	{
		// Добавляем в ветку наименование RSS
		rssVector = createRssVector(name, this.location, this.icon.url);
		if (rssVector && record)
			record.data.layer = rssVector;
					
		rssVar.rssVectors.push(rssVector)
		if (rssVar.selectControl != null)
			this.map.removeControl(rssVar.selectControl);
	} else {
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
					rssVector = createRssVector(name, this.location, null);
				rssVector.addFeatures(features);
			}
			else if (feature.geometry instanceof OpenLayers.Geometry.Point)
			{
				var location = feature.geometry.getBounds().getCenterLonLat();

//				data.icon = this.icon == null ? OpenLayers.Marker.defaultIcon() : this.icon.clone();
				data.icon = this.icon;

				data.title = name;
				data.description = description;
				data.properties = "gxp_wmslayerpanel";

				var contentHTML = '<div style="float:left;font-size:1.0em;width:99%;height:99%;background-color:#fafafa;border:solid 1px #909090">';
				contentHTML += '<div style="float:right;margin:5px 5px 0px 0px"><a style="width:18px;height:18x;" onclick="onPopupClose()"><img src="script/images/cross.png"></a></div>'
				contentHTML += '<div>';
				contentHTML += '<table><tr><td><img src="' + this.icon.url + '" style="margin-top:5px;margin-left:5px"></td>';
				contentHTML += '<td><b style="margin:3px 5px 0px 5px">' + title + '</b></td></tr></table><hr>';
				contentHTML += '</div>';
				contentHTML += '<div style="font-size:0.7em;margin:0px 5px 5px 5px;">' + description + '</div>';
				contentHTML += '</div>';

				data['contentHTML'] = contentHTML;

				if (rssVector == null)
				{
					var records = app.mapPanel.layers;
					var record  = null;

					if (records.data.items.length > 0)
					{
						for (var j = 0; j < records.data.items.length; j++)
						{
							if (records.data.items[j].data['title'] === name)
							{
								record = records.data.items[j];
								break;
							}
						}
					};
					rssVector = createRssVector(name, this.location, data.icon.url);
					if (rssVector && record)
						record.data.layer = rssVector;
					
					rssVar.rssVectors.push(rssVector)
					if (rssVar.selectControl != null)
						this.map.removeControl(rssVar.selectControl);

//					rssVar.selectControl = new OpenLayers.Control.SelectFeature(rssVar.rssVectors, {onSelect: onFeatureSelect});
					rssVar.selectControl = new OpenLayers.Control.SelectFeature(rssVar.rssVectors, {hover : true});
					this.map.addControl(rssVar.selectControl);
					rssVar.selectControl.activate();
				}
				var markerStyle = {externalGraphic: data.icon.url, graphicWidth: 21, graphicHeight: 25, graphicXOffset : -10.5, graphicYOffset: -25, graphicOpacity: 0.7};
				var point       = new OpenLayers.Geometry.Point(location.lon, location.lat);
				rssVector.addFeatures([new OpenLayers.Feature.Vector(point, {title: name, data : data}, markerStyle)]);
				rssVector.events.on({
					'featureselected': onFeatureSelect1
////				'featureunselected' : onFeatureUnselect1
				});
			}
		}
	}
	this.events.triggerEvent("loadend");
};

// extend OpenLayers.Control.WMSGetFeatureInfo.getInfoForClick
function RssPopupGetInfoForClick(evt)
{
	if (rssVar.selectedFeature != null)
	{
		text  = parseRSSContentHTML (rssVar.selectedFeature.attributes.data['contentHTML']);
		title = 'RSS : ' + rssVar.selectedFeature.attributes.data['title'];
		wmsTool.displayPopup({xy : evt.xy}, title, text, false);
		rssVar.selectControl.unselect(rssVar.selectedFeature);
		rssVar.selectedFeature = null;
	}

	this.events.triggerEvent("beforegetfeatureinfo", {xy: evt.xy});
	OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
	this.request(evt.xy, {});
}

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
 
// extend gxp.Viewer.getState
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
		if (layer.displayInLayerSwitcher)
		{
			var id = record.get("source");
			if (id)
			{
				var source = this.layerSources[id];

				if (!source)    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				{
					if (id === 'animation')
					{
						source = new gxp.plugins.AnimationSource();
						source.initialConfig = {id:"animation", projection: "EPSG:4326", ptype: "gxp_animationsource"};
						this.layerSources.animation = source;
					} else if (id === 'rss') {
						source = new gxp.plugins.RssSource();
						source.initialConfig = {id:"rss", projection: "EPSG:4326", ptype: "gxp_rsssource"};
						this.layerSources.rss = source;
					} else if (id === 'arcgis93') {
						source = new gxp.plugins.ArcGIS93Source();
						source.id         = "arcgis93";
						source.ptype      = "gxp_arcgis93source";
						source.projection = "EPSG:900913";
						source.initialConfig = {id:"arcgis93", projection: "EPSG:900913", ptype: "gxp_arcgis93source"};
						this.layerSources.arcgis93 = source;
					}
					source = this.layerSources[id];
				}               //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				if (!source)
				{
					throw new Error("Could not find source for layer '" + record.get("name") + "'");
				}
				// add layer
				state.map.layers.push(source.getConfigForRecord(record));
				if (!state.sources[id]) {
					state.sources[id] = Ext.apply({}, source.getState());
				}
			}
		}
	}, this);
	return state;
}
// extend gxp.plugins.RemoveLayer.addActions
function RssPopupAddActions()
{
	var selectedLayer;
	var actions = gxp.plugins.RemoveLayer.superclass.addActions.apply(this, [{
            menuText: this.removeMenuText,
            iconCls: "gxp-icon-removelayers",
            disabled: true,
            tooltip: this.removeActionTip,
            handler: function(a,b,c)
			{
				/*var selectedNode = Ext.getCmp('layertree').selModel.selNode;
                if (selectedNode) {
					selectedNode.ui.checkbox.click();
				}*/
				var node = Ext.getCmp('rubricatorTree').items.items[0].getNodeById(selectedLayer.get('rubricatorNode'));
				if (node) node.ui.checkbox.checked = false;
				var record = selectedLayer;
				
				var layer = record.get('layer');
				var animWin = Ext.getCmp('animationWindow');
				if ((layer)&&animWin&&(layer.id==animWin.node.layer.id))
					animWin.close();
				
                if(record)
				{
					var title = record.data['title'];

                    this.target.mapPanel.layers.remove(record);

					for (var i = 0; i < rssVar.rssVectors.length; i++)
					{
						if (rssVar.rssVectors[i].name === title)
						{
							rssVar.rssVectors.splice(i,1);
							break;
						}
					}
					for (var i = (this.target.mapPanel.layers.data.items.length - 1); i >= 0 ; i--)
					{
						if (this.target.mapPanel.layers.data.items[i].data['title'] === title)
						{
							this.target.mapPanel.layers.data.items[i].visibility = false;
							this.target.mapPanel.layers.remove(this.target.mapPanel.layers.data.items[i]);
							break;
						}
					}
					
					var deleted = false;
					for (var i = (this.target.mapPanel.map.layers.length - 1); i >= 0; i--)
					{
						if (this.target.mapPanel.map.layers[i].name === title)
						{
							this.target.mapPanel.map.removeLayer(this.target.mapPanel.map.layers[i], false);
							deleted = true;
						}
						if (!deleted && this.target.mapPanel.map.layers[i].CLASS_NAME === 'OpenLayers.Layer.Vector.RootContainer')
						{
							this.target.mapPanel.map.removeLayer(this.target.mapPanel.map.layers[i], false);
							deleted = false;
						}
					}
                }
            },
            scope: this
	}]);
	var removeLayerAction = actions[0];

	this.target.on("layerselectionchange", function(record)
		{
			selectedLayer = record;
			app.tools.gxp_removelayer_ctl.selectedLayer = record;
			removeLayerAction.setDisabled(this.target.mapPanel.layers.getCount() <= 1 || !record);
        }, this);
	var enforceOne = function(store)
		{
			removeLayerAction.setDisabled(!selectedLayer || store.getCount() <= 1);
        }
	this.target.mapPanel.layers.on({
		"add": enforceOne,
		"remove": enforceOne
	});
	return actions;
}

// extend GeoExt.tree.LayerLoader
function RsspopupAddLayerNode (node, layerRecord, index)
{
	index = index || 0;
	if (this.filter(layerRecord) === true)
	{
		if (node.childNodes.length > 0)
		{
			for (var idx = 0; idx < node.childNodes.length; idx++)
			{
				if (node.childNodes[idx].text === layerRecord.data.title)
					return;
			}
		}
		if (layerRecord.data.title.length > 0)
		{
			//layerRecord.getLayer().singleTile = true;
			
			var child;
			if (layerRecord.data.group !== 'animation')
			{
				child = this.createNode({
					nodeType: 'gx_layer',
					iconCls: "gxp-islayer",
					layer: layerRecord.getLayer(),
					layerStore: this.store
				});
			} else if (node.attributes.group == 'animation') {
				child = this.createNode({
					checked : false,
					nodeType: 'gx_layer',
					layer: layerRecord.getLayer(),
					layerStore: this.store
				});
			}
			if (child)
			{
				if (!child.text)
					child.text = layerRecord.data.title;
				if ((child.layer.CLASS_NAME === 'OpenLayers.Layer.ArcGIS93Rest') && (child.draggable == false))
					child.draggable = true;
				
				var sibling = node.item(index);
//				if (node.previousSibling === null)
//				{
					if (sibling)
						node.insertBefore(child, sibling);
					else
						node.appendChild(child);
//					console.log ('0. node.childNodes.length = ' + node.childNodes.length + ', title = ' + layerRecord.data.title + 
//								', rssVar.onConfigCreate = ' + rssVar.onConfigCreate + ', index = ' + index);
//				} else {
//					if (sibling) 
//						node.insertBefore(child, sibling);
//					else
//						node.appendChild(child);
//				}
				if(child.ui && child.ui.textNode && child.ui.textNode.setAttribute)
					child.ui.textNode.setAttribute('ext:qtip', layerRecord.data['abstract']);
				child.on("move", this.onChildMove, this);
			}
		}
	}
}
