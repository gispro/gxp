var rssPopupWindow;
var mapCenter = {px : new OpenLayers.Pixel(), treeLayers : 0};

function RssParseData (ajaxRequest) 
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

	for (var i=0, len=features.length; i<len; i++) {
		var data = {};
		var feature = features[i];
            
		if (!feature.geometry) {
			continue;
		}
            
		var title       = feature.attributes.title       ? feature.attributes.title       : "Untitled";
		var description = feature.attributes.description ? feature.attributes.description : "No description.";
		var location    = feature.geometry.getBounds().getCenterLonLat();
            
		data.icon = this.icon == null ? OpenLayers.Marker.defaultIcon() : this.icon.clone();
		data.popupSize = this.popupSize ? this.popupSize.clone() : new OpenLayers.Size(250, 120);
		if (title || description) {
			data.title = title;
			data.description = description;

			var contentHTML = '<div style="float:left;font-size:1.2em;width:100%">';
			contentHTML += '<table><tr><td><img src="' + this.icon.url + '" style="margin-top:5px;margin-left:5px"></td>';
			contentHTML += '<td><b style="margin:3px 5px 0px 5px">' + name + '</b></td></tr></table><hr>';
			contentHTML += '</div>';
			contentHTML += '<div style="float:left;margin:0px 5px 5px 5px">' + description + '</div>';

			data['popupContentHTML'] = contentHTML;
		}
		var feature = new OpenLayers.Feature(this, location, data);
		this.features.push(feature);
		feature.popupClass = gxp.plugins.RssPopup;

		var marker = feature.createMarker();
		marker.events.register('click', feature, this.markerClick);

		mapCenter.px         = GeoExt.MapPanel.guess().map.getLayerPxFromLonLat(GeoExt.MapPanel.guess().map.getCenter());
		mapCenter.treeLayers = Ext.get("tree").dom.clientWidth;

		this.addMarker(marker);
	}
	this.events.triggerEvent("loadend");
};

Ext.namespace("gxp.plugins");

gxp.plugins.RssPopup = Ext.extend(OpenLayers.Popup,
{
 	draw: function(px)
	{
        if (px == null)
			px = this.events.object.feature.marker.icon.px;

		var ox = Ext.get("tree"     ).dom.clientWidth ; 
		var oy = Ext.get("paneltbar").dom.clientHeight; 

		if (mapCenter.treeLayers !== ox)
		{
			mapCenter.px         = this.map.getLayerPxFromLonLat(this.map.getCenter());
			mapCenter.treeLayers = Ext.get("tree").dom.clientWidth;
		}

		center = this.map.getLayerPxFromLonLat(this.map.getCenter());

		if (ox === 0)
			ox = 33;
		var map_move_x = 0;
		var map_move_y = 0;
		if ((mapCenter.px.x !== center.x) || (mapCenter.px.y !== center.y))
		{
			map_move_x = mapCenter.px.x - center.x;
			map_move_y = mapCenter.px.y - center.y;
		}
		ox += map_move_x;
		oy += map_move_y;

        if(!rssPopupWindow){  
			rssPopupWindow = new Ext.Window({  
				width       : 350,  
				height      : 275,  
				title       : 'RSS',
				closeAction : 'hide',
				autoScroll  : true,
				html        : this.parseContentHTML(this.contentHTML),
				bodyStyle   : {'background-color': '#FFFFFF'}  
			})        
        } else {
			rssPopupWindow.body.update (this.parseContentHTML(this.contentHTML));
		}
		
		var y = px.y - 275 + oy; 
		if (y < 0)
			y = px.y + oy;
		var x = px.x + ox
		if ((x + 350) > this.map.getSize().w)
			x -= 350;
		rssPopupWindow.setPagePosition(x, y);

        rssPopupWindow.show();
		return null; 
    },
	parseContentHTML : function (text)
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
		return text;
	}
});
Ext.preg(gxp.plugins.RssPopup.prototype.ptype, gxp.plugins.RssPopup);
