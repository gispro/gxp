	GISMeasure = OpenLayers.Class(OpenLayers.Control, {
		defaultHandlerOptions: {
			'type':'LINE', // POLIGON
			'single': true,
			'double': true,
			'pixelTolerance': 0,
			'stopSingle': false,
			'stopDouble': false,
			'CreatePopupFn': null
		},

		initialize: function(options) {
			this.options = options;
			if( options.measureType ==='distance' ||
				options.measureType ==='square') this.measureType = options.measureType;
			else throw('Недопустимый тип измерения ' + options.measureType);

			this.overPointID = null;
			this.dragPointID = null;
			this.downInfo = null;

			this.handlerOptions = OpenLayers.Util.extend(
				{}, this.defaultHandlerOptions
			);
 			OpenLayers.Control.prototype.initialize.apply(
				this, arguments
			);
				
			if(this.scope === null) {
				this.scope = this;
			}
			var callbacks = {
				'click': this.onClick,
				'dblclick': this.onDblclick
			};


            callbacks.over = this.overFeature;
            callbacks.out = this.outFeature;
            callbacks.up = this.upFeature;
            callbacks.down = this.mouseDown;
			callbacks.move = this.mouseMove;
			callbacks.done = this.mouseDone;

	        this.callbacks = OpenLayers.Util.extend(callbacks, this.callbacks);
		},
		
		getDrawLayer: function(){
			return this.layer;
		},
		setMap: function(m){
//			this.map = m;
			OpenLayers.Control.prototype.setMap.apply(	this, arguments	);
			this.options.map = m;
			this.parentClick = new _GISMeasureManager(this.options, this);
			this.layer = this.parentClick.vectors;
			this.handlers = {
				feature: new OpenLayers.Handler.Feature(
					this, this.layer, this.callbacks,
					{geometryTypes: ["OpenLayers.Geometry.Point"]}
				),
				click: new OpenLayers.Handler.Click(
					this, this.callbacks, this.handlerOptions
				),
				drag: new OpenLayers.Handler.Drag(
					this, this.callbacks,
					{documentDrag: true,
						geometryTypes: ["OpenLayers.Geometry.Point"]})
			};
		},
		onClick: function(evt) {
			// Feature Vector (Point)
			var point = this.parentClick.onClick(evt);
			return true;
		},

		onDblclick: function(evt) {
			var mp = this.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(evt.geometry.x, evt.geometry.y));
			addMess("dblclick " + evt.id + " " + this.key + ' '  + mp.lon + " " + mp.lat);
			this.parentClick.onDblClick(evt);
		},
		overFeature: function(evt) {
			this.overOnPoint(evt.id);
			return true;
		},
		overOnPoint: function(pointID){
			if( !this.handlers.drag.dragging){
				this.handlers.drag.activate();
				OpenLayers.Element.addClass(
					this.map.viewPortDiv, "olControlGISFeatureOver"
				);
				this.overPointID = pointID;
				addMess("Over " + pointID);
				this.overPointID=this.parentClick.overPoint(pointID);
			}
		},
		outFeature: function(evt) {
			if( //this.overPointID &&
				!this.handlers.drag.dragging){
				this.handlers.drag.deactivate();
				OpenLayers.Element.removeClass(
					this.map.viewPortDiv, "olControlGISFeatureOver"
				);
				addMess("Out " + (evt ? evt.id : null));
				this.parentClick.outPoint(this.overPointID);
				this.overPointID = null;
			}
			return true;
		},
		mouseDown: function(evt) {
			addMess("Down");
			if( this.overPointID){
				var nodeLonLat = this.parentClick.getNodeLonLat(
									this.parentClick.getPointInd(this.overPointID));
				var downLonLat = this.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(evt.x, evt.y));
				this.downInfo = {dlon: nodeLonLat.lon - downLonLat.lon, dlat: nodeLonLat.lat - downLonLat.lat};
				this.dragPointID = this.overPointID;
			}
			return true;
		},
		upFeature: function(pixel) {
			addMess("Up "+ (this.over ? 'Over' : 'NOT Over'));
			if(false && !this.over) {
				this.outFeature(null);
			}
		},
		mouseMove: function(evt) {
			if( this.dragPointID){
				var ll = this.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(evt.x, evt.y));

				this.parentClick.onPointMoved(this.dragPointID, new OpenLayers.LonLat(ll.lon+this.downInfo.dlon, ll.lat+ this.downInfo.dlat ));
			}
			return true;
		},
		mouseDone: function(evt) {
			addMess("Done");
			this.dragPointID = null;
			return true;
		},
		activate: function () {
			var isActive = this.active,
				ret = OpenLayers.Control.prototype.activate.apply( this, arguments);
			if (this.map && !isActive) {
				this.handlers.feature.activate();
				this.handlers.click.activate();
			}
	        return ret;
		},
		deactivate: function () {
			if (this.map && this.active) {
				OpenLayers.Element.removeClass(
					this.map.viewPortDiv, "olControlGISFeatureOver"
				);
				this.handlers.feature.deactivate();
				this.handlers.click.deactivate();
				this.parentClick.clear();
				//this.handlers.drag.deactivate();
			}
			return OpenLayers.Control.prototype.deactivate.apply(this, arguments);
		},
		onPointRemoved: function(feature){
			if( feature && feature.id === this.overPointID){
				this.outFeature(null);
			}
		}
	});


	


	function _GISMeasureManager( options, mouseControl ){
		this.measureType = options.measureType;	//distance/square
		if( options.CreatePopupFn)
			this.fnCreatePopup = options.CreatePopupFn;

		if( this.measureType ==='distance')	this.distance = true;
		else if( this.measureType ==='square')this.square = true;
		else throw('Недопустимый тип измерения ' + this.measureType);
		this.centerPopup = null;

		this.geometry = null;
		this.feature = null;
		this.nodes = new Array(); //{point:  feature: popup:}

		var sketchSymbolizers = 
			OpenLayers.Util.extend(
			(options.symbolizer ? options.symbolizer : {}),
			{"Point": {
				rotation:90,
				pointRadius: 4,
				graphicName: "circle",
				fillColor: "red",
				fillOpacity: 1,
				strokeWidth: 1,
				strokeOpacity: 1,
				strokeColor: "white",//"#c60000"
				graphicZIndex:10
				},
			"Line": {
				strokeWidth: 2,
				strokeOpacity: 1,
				strokeColor: "#c60000",//,     strokeDashstyle: "dash"
				graphicZIndex:1
				},
			"Polygon": {
				strokeWidth: 2,
				strokeOpacity: 1,
				strokeColor: "#c60000",
				fillColor: "#a4a4a4",
				fillOpacity: 0.3,
				graphicZIndex:1
				}
			});
			this.firstPointSketchSymbolizers = 
			OpenLayers.Util.extend(
			(options.symbolizer ? options.symbolizer : {}),
			{"Point": {
				rotation:90,
				pointRadius: 6,		graphicName: "circle",
				fillColor: "red",	fillOpacity: 1,
				strokeWidth: 1,		strokeOpacity: 1,	strokeColor: "white",//"#c60000"
				graphicZIndex:15
				},
			"Line": {},	"Polygon": {}
			});
			this.lastPointSketchSymbolizers = 
			OpenLayers.Util.extend(
			(options.symbolizer ? options.symbolizer : {}),
			{"Point": {
				rotation:90,
				pointRadius: 6,		graphicName: "circle",
				fillColor: "red",	fillOpacity: 1,
				strokeWidth: 1,		strokeOpacity: 1,	strokeColor: "white",//"#c60000"
				graphicZIndex:15
				},
			"Line": {},	"Polygon": {}
			});
			
		var style = new OpenLayers.Style();
		
		style.addRules([new OpenLayers.Rule({symbolizer: sketchSymbolizers})]);
		var styleMap = new OpenLayers.StyleMap({"default": style});

		this.vectors = new OpenLayers.Layer.Vector("Vector Layer", {styleMap:styleMap, rendererOptions: {yOrdering: true}, displayInLayerSwitcher:false});
		this.oFirstPoint = {
			vectors: this.vectors,
			features: undefined,
			geometry: undefined
		};
		this.oLastPoint = {
			vectors: this.vectors,
			features: undefined,
			geometry: undefined
		};
		
		//this.vecLastPoint = new OpenLayers.Layer.Vector("Last point Vector Layer", {styleMap:lStyleMap, displayInLayerSwitcher:false});
		//this.vecFirstPoint = new OpenLayers.Layer.Vector("First point Vector Layer", {styleMap:fStyleMap, displayInLayerSwitcher:false});
		
		
		this.map = options.map;
		this.map.addLayers([ this.oLastPoint.vectors, this.vectors ]);

		this.mouseControl = mouseControl;

		this.measureControl = 
				new OpenLayers.Control.Measure(
					this.measureType ==='distance'
						? OpenLayers.Handler.Path
						: OpenLayers.Handler.Polygon,
					{
						geodesic:true,
						persist: false,
						showDistances: false,
						handlerOptions: {
							layerOptions: {styleMap: styleMap}
						}
	                }
				);
		this.map.addControl(this.measureControl);

	}

_GISMeasureManager.prototype.createMeasureGeometry = function (points){
	var ret;
	if( this.measureType === 'distance')
		ret = new OpenLayers.Geometry.LineString(points);
	else if( this.measureType === 'square'){
		var ring = new OpenLayers.Geometry.LinearRing(points),
			poligon = new OpenLayers.Geometry.Polygon([ring]);
		ret = {ring:ring, poligon: poligon};
	}
	return ret;
}
_GISMeasureManager.prototype.createMeasureFeature = function (geometry){
	var ret;
	if( this.measureType === 'distance')
		ret = new OpenLayers.Feature.Vector(geometry);
	else if( this.measureType === 'square')
		ret = new OpenLayers.Feature.Vector(geometry.poligon);
	return ret;
}


_GISMeasureManager.prototype.reMeasureWith = function(ind){
	if( this.distance){
		for(var il = this.nodes.length; ind < il; ind++){
			var node = this.nodes[ind];
			if( node.popup && node.popup.visible())
				this.reMeasureFor(ind);
			else
				node.measure = undefined;
		}
	}
	else
		this.reMeasureFor();
}


_GISMeasureManager.prototype.reMeasureFor = function(ind){
	var ls = ind  == undefined
				? this.geometry.poligon
				: new OpenLayers.Geometry.LineString(this.getPoints(ind));
	var popup, measure, arr;
	if( this.distance){
		arr = this.measureControl.getBestLength(ls);
		var node = this.nodes[ind];
		popup = node.popup;
		node.measure = node.measure ? node.measure	: {};
		if(!arr[0])	node.measure = '0';
		else		node.measure =	"<b>"+arr[0].toFixed(
											arr[1] == 'm' || arr[0] >= 100
													? 0
													: arr[0] >= 10
														? 1
														: 2)
									+"</b>&nbsp;"+
									toMetricSystem(arr[1]);
		measure = node.measure;
	}
	else {
		popup = this.centerPopup;
		arr = this.measureControl.getBestArea(ls);
		if(!arr[0])	measure = '0';
		else		measure =	"<b>"+arr[0].toFixed(
											arr[1] == 'm' || arr[0] >= 100
													? 0
													: arr[0] >= 10
														? 1
														: 2)
									+"</b>&nbsp;"+
								toMetricSystem(arr[1])+'<sup>2</sup>';
	}

	if( popup && popup.visible())
		popup.setContentHTML(measure);
	return measure;
}

_GISMeasureManager.prototype.onPointMoved = function(pointFeatureID, lonlat, evt){
	var ind = this.getPointInd(pointFeatureID);
	if( ind >= 0){
		var node = this.nodes[ind];
		node.feature.geometry.x = lonlat.lon;
		node.feature.geometry.y = lonlat.lat;
		node.feature.geometry.clearBounds();
		this.vectors.drawFeature(node.feature);
		if(this.feature)
			this.vectors.drawFeature(this.feature);
		if( node.popup){
			movePopupFeatureTo(this.map, node.popup, lonlat);
		}
		else if( this.centerPopup){
			node.lonlat.lon = lonlat.lon;
			node.lonlat.lat = lonlat.lat;
			//var centerPoint = this.getgeometry.poligon.getCentroid(true),
			//	ll = new OpenLayers.LonLat(centerPoint.x, centerPoint.y);
			var ll = this.getLonLatCentroid();
			ll = this.moveCenterPopupToPoint(ll);

			movePopupFeatureTo(this.map, this.centerPopup, ll);
		}
		this.reMeasureWith(ind);
		if( node.shadowPoint){
			this.moveShadowPointTo(node.shadowPoint, lonlat);
		}
	}
}

_GISMeasureManager.prototype.moveShadowPointTo = function(pinfo, lonlat){
	pinfo.geometry.x = lonlat.lon;
	pinfo.geometry.y = lonlat.lat;
	pinfo.geometry.clearBounds();
	pinfo.vectors.drawFeature(pinfo.features);
}

_GISMeasureManager.prototype.getNodeLonLat = function(ind){
	if( !this.nodes[ind])
		addMess(ind);
	return new OpenLayers.LonLat(	this.nodes[ind].feature.geometry.x,
									this.nodes[ind].feature.geometry.y)
}

_GISMeasureManager.prototype.getPointInd = function(pointFeatureID){
	for( var i = 0, il = this.nodes.length; i < il; i++){
		if(pointFeatureID === this.nodes[i].feature.id)
			return i;
		if(	this.nodes[i].shadowPoint && 
			this.nodes[i].shadowPoint.features &&
			this.nodes[i].shadowPoint.features.id === pointFeatureID)
			return i;
	}
	
	return -1;
}
_GISMeasureManager.prototype.getScreenPx = function(ind){
	return this.map.getLayerPxFromLonLat(this.getNodeLonLat(ind));
}

_GISMeasureManager.prototype.overPoint = function(pointFeatureID){
	var ind = this.getPointInd(pointFeatureID),
		node = this.nodes[ind];
	if( this.distance){
		if( ind > 0 && ind !== this.nodes.length-1 ){
			if( node.measure === undefined)
				this.reMeasureFor(ind);
			if( !node.popup){
				node.popup =
					this.createPopupFeature( this.getNodeLonLat(ind), node.measure,
											 false);
			}
			else
				node.popup.setContentHTML(node.measure);
			movePopupFeatureTo(this.map, node.popup, this.getNodeLonLat(ind));
			node.popup.show();
		}
	}
	return this.nodes[ind].feature.id;
}

_GISMeasureManager.prototype.outPoint = function(pointFeatureID){
	if( this.distance){
		var ind = this.getPointInd(pointFeatureID)
		if( ind > 0 && ind !== this.nodes.length-1){
			if( this.nodes[ind].popup)
				this.nodes[ind].popup.hide();
		}
	}
}

_GISMeasureManager.prototype.onDblClick = function(evt){
	var mp = this.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(evt.geometry.x, evt.geometry.y));
	var ind = this.getPointInd(evt.id);
	if( ind >= 0)
		this.removePoint(ind);
}

_GISMeasureManager.prototype.removePoint = function(ind){
	var node = this.nodes[ind],
		reMeasureInd = ind;
	if( this.nodes.length > 2){
		if( this.square && this.nodes.length === 3){
			this.centerPopup.destroy();
			this.centerPopup = null;
		}
		else if(this.distance){
			if( ind == this.nodes.length-1){ // remove last node
				var lastPopup = this.nodes[ind].popup;
				this.nodes[ind-1].popup = lastPopup;
				movePopupFeatureTo(this.map, lastPopup, this.getNodeLonLat(ind-1));
				reMeasureInd --;
			}
		}
		this.vectors.removeFeatures([node.feature]);

		if( this.square && this.nodes.length === 3){
			var ind0, ind1;
			switch(ind){
				case 0:ind0 = 1, ind1 = 2;break;
				case 1:ind0 = 0, ind1 = 2;break;
				case 2:ind0 = 0, ind1 = 1;break;
			}
			this.vectors.removeFeatures([this.feature, this.nodes[ind0].feature, this.nodes[ind1].feature]);
			this.geometry = this.createMeasureGeometry([this.nodes[ind0].point, this.nodes[ind1].point]);
			this.feature = this.createMeasureFeature(this.geometry);
			this.vectors.addFeatures([this.feature,this.nodes[ind0].feature, this.nodes[ind1].feature]);
		}
		else{
			(this.distance
				? this.geometry
				: this.geometry.ring).removeComponent(node.point);
			this.vectors.drawFeature(this.feature);
		}
		if( ind === 0){ // && this.nodes.length > 2
			this.nodes[1].shadowPoint = this.nodes[0].shadowPoint;
			this.nodes[0].shadowPoint = undefined;
			this.moveShadowPointTo(this.nodes[1].shadowPoint, {lon:this.nodes[1].feature.geometry.x, lat:this.nodes[1].feature.geometry.y});
		} else if (ind === this.nodes.length-1){
			this.nodes[this.nodes.length - 2].shadowPoint = this.nodes[this.nodes.length - 1].shadowPoint;
			this.nodes[this.nodes.length - 1].shadowPoint = undefined;
			this.moveShadowPointTo(this.nodes[this.nodes.length - 2].shadowPoint, {lon:this.nodes[this.nodes.length - 2].feature.geometry.x, lat:this.nodes[this.nodes.length - 2].feature.geometry.y});
		}
	}
	else if(this.nodes.length === 2){
		if( this.distance){
			this.nodes[1].popup.destroy();
			this.nodes[1].popup = null;
		}
		
		this.nodes[1].shadowPoint.vectors.removeFeatures([this.nodes[1].shadowPoint.features]);
		this.nodes[1].shadowPoint.features = undefined;
		if( ind === 0){ // && this.nodes.length > 2
			this.nodes[1].shadowPoint = this.nodes[0].shadowPoint;
			this.nodes[0].shadowPoint = undefined;
			this.moveShadowPointTo(this.nodes[1].shadowPoint, {lon:this.nodes[1].feature.geometry.x, lat:this.nodes[1].feature.geometry.y});
		}
		
		this.vectors.removeFeatures([node.feature, this.feature]);
		this.feature = null;
	}
	else {
		this.nodes[0].shadowPoint.vectors.removeFeatures([this.nodes[1].shadowPoint.features]);
		this.nodes[0].shadowPoint.features = undefined;
		this.vectors.removeFeatures([node.feature]);
	}

	this.mouseControl.onPointRemoved(node.feature);
	this.nodes.splice(ind, 1);
	this.reMeasureWith(reMeasureInd);

	if( this.centerPopup){
		var centerPoint = this.geometry.poligon.getCentroid(true),
			ll = new OpenLayers.LonLat(centerPoint.x, centerPoint.y);
			ll = this.moveCenterPopupToPoint(ll);

			movePopupFeatureTo(this.map, this.centerPopup, ll);
	}
}

_GISMeasureManager.prototype.onClick = function(evt){
	var mp = this.map.getLonLatFromViewPortPx(evt.xy);

	if( mp ){
		var p = new OpenLayers.Geometry.Point(mp.lon, mp.lat);
		// Return point Feature
		return this.addPoint(p, mp);
	}
	return null;
}

_GISMeasureManager.prototype.addPoint = function(p, ll, xy){
	var node = {point:p,
				lonlat: new OpenLayers.LonLat(ll.lon, ll.lat),
				feature: new OpenLayers.Feature.Vector(p),
				measure:null, //measure:{val: null, unit: null},
				popup:null};
	this.nodes.push(node);

	this.vectors.addFeatures([node.feature]);

	addMess("click  Add point " + node.feature.id);
	var _this = this;
	if(	this.nodes.length === 1  &&
		!this.oFirstPoint.features )
	{
		this.oFirstPoint.geometry = new OpenLayers.Geometry.Point(ll.lon, ll.lat);
		this.oFirstPoint.features = new OpenLayers.Feature.Vector(this.oFirstPoint.geometry);
		this.oFirstPoint.features.style = this.firstPointSketchSymbolizers.Point;//{graphicZIndex: 15,  pointRadius: 10 };
		this.oFirstPoint.vectors.addFeatures([this.oFirstPoint.features]);
		this.nodes[0].shadowPoint = this.oFirstPoint;
	}
	if(this.nodes.length === 2){

		this.geometry = this.createMeasureGeometry([this.nodes[0].point, this.nodes[1].point]);
		this.feature = this.createMeasureFeature(this.geometry);
		this.vectors.addFeatures([this.feature]);
		this.vectors.removeFeatures([this.nodes[0].feature, this.nodes[1].feature]);
/*		var ff = this.vecFirstPoint.features[0];
		this.vecFirstPoint.removeFeatures([ff]);*/
		this.vectors.addFeatures([this.nodes[0].feature, this.nodes[1].feature]);
/*		this.vecFirstPoint.addFeatures([ff]);*/

		if(	!this.oLastPoint.features )
		{
			this.oLastPoint.geometry = new OpenLayers.Geometry.Point(ll.lon, ll.lat);
			this.oLastPoint.features = new OpenLayers.Feature.Vector(this.oLastPoint.geometry);
			this.oLastPoint.features.style = this.lastPointSketchSymbolizers.Point;
			this.oLastPoint.vectors.addFeatures([this.oLastPoint.features]);
		}
		this.nodes[1].shadowPoint = this.oLastPoint;

		if( this.distance){
			this.reMeasureFor(1);
			node.popup =
				this.createPopupFeature(ll, node.measure, true,
										function(){_this.clear();});
			node.popup.show();
		}
		addMess('Vectors: ' + this.map.getLayerIndex(this.vectors));
		addMess('First Point: ' + this.map.getLayerIndex(this.oFirstPoint.vectors));
		addMess('Last Point: ' + this.map.getLayerIndex(this.oLastPoint.vectors));
	}
	else if( this.nodes.length > 2){
		if( this.distance)
			this.geometry.addPoint(node.point);
		else {
			this.geometry.ring.addComponent(node.point);
		}
		this.vectors.drawFeature(this.feature);
		var oldLastNode = this.nodes[this.nodes.length-2];
		if(this.distance){
			node.popup = oldLastNode.popup;
			oldLastNode.popup = null;
			movePopupFeatureTo(this.map, node.popup, ll)
			this.reMeasureFor(this.nodes.length-1);
		}
		else { // squere
			//var centerPoint = this.geometry.poligon.getCentroid(false);
			//ll = new OpenLayers.LonLat(centerPoint.x, centerPoint.y);
			var cll = this.getLonLatCentroid();
			var content = this.reMeasureFor();


			if(this.nodes.length === 3 ){
				cll = this.moveCenterPopupToPoint(cll);
				this.centerPopup = this.createPopupFeature(	cll, content, true,
															function(){_this.clear();});
				this.centerPopup.show();
			}
			cll = this.moveCenterPopupToPoint(cll);
			movePopupFeatureTo(this.map, this.centerPopup, cll);
		}
		
		node.shadowPoint = oldLastNode.shadowPoint;
		oldLastNode.shadowPoint = undefined;
		this.moveShadowPointTo(node.shadowPoint, ll);
	}
	return node.feature;
}

_GISMeasureManager.prototype.getLonLatCentroid = function(){
	var ll = new OpenLayers.LonLat(0, 0);

	for( var i = 0, il = this.nodes.length; i<il; i++){
		ll.lon += this.nodes[i].lonlat.lon;
		ll.lat += this.nodes[i].lonlat.lat;
	}
	ll.lon = ll.lon/this.nodes.length;
	ll.lat = ll.lat/this.nodes.length;

	return ll;
}

_GISMeasureManager.prototype.moveCenterPopupToPoint = function(ll){
	var p = this.map.getViewPortPxFromLonLat(ll),
		size = this.centerPopup 
				? this.centerPopup.size
					? this.centerPopup.size
					: this.centerPopup.getSize()
				: new OpenLayers.Size(0,0);
	p.x -= (size.w === undefined ? size.width : size.w )/2;
	p.y -= (size.h === undefined ? size.height : size.h)/2;

	return this.map.getLonLatFromViewPortPx(p);
}

_GISMeasureManager.prototype.activate = function(){
	this.mouseControl.activate();
}

_GISMeasureManager.prototype.deactivate = function(){
	this.mouseControl.deactivate();
	if( this.centerPopup)
		this.centerPopup.hide();
}

_GISMeasureManager.prototype.getPointFeatures = function(){
	var pointFeatures = new Array();
	for( var i = 0, il = this.nodes.length; i < il; i++ )
		pointFeatures.push(this.nodes[i].feature);
	return pointFeatures;
}
_GISMeasureManager.prototype.getPoints = function(ind){
	ind = ind === undefined ? (this.nodes.length-1) : ind;
	var points = new Array();
	for( var i = 0; i <= ind; i++ )
		points.push(this.nodes[i].point);
	return points;
}


_GISMeasureManager.prototype.clear = function(){
	this.mouseControl.outFeature();
	var features = this.getPointFeatures();
	if( this.feature)
		features.push(this.feature);
	if( features.length > 0)
		this.vectors.removeFeatures(features);
	this.geometry = null;
	this.feature = null;
	for(var i = 0, il = this.nodes.length; i < il; i++){
		var popup = this.nodes[i].popup;
		if( popup){
			popup.destroy();
		}
		if( this.nodes[i].shadowPoint &&
			this.nodes[i].shadowPoint.features){
			this.nodes[i].shadowPoint.vectors.removeFeatures([this.nodes[i].shadowPoint.features]);
			this.nodes[i].shadowPoint.features = undefined;
		}
	}
	if( this.centerPopup)
		this.centerPopup.destroy()
	this.centerPopup = null;
	
	this.nodes = new Array();
}
//this.map, this.vectors, ll, content, hasClose. closeBoxCallback
_GISMeasureManager.prototype.createPopupFeature = function ( 
							ll,			//LonLat Coordinates
							content, 
							hasClose, 
							closeBoxCallback ){
	var popup;
	if( this.fnCreatePopup ){
		popup = this.fnCreatePopup.apply(window, [this.map, this.vectors, ll, content, hasClose, closeBoxCallback]);
	}
	else {
		popup = new OpenLayers.Popup(	null, ll,
								new OpenLayers.Size(100, 22),
								content,
								hasClose,
								closeBoxCallback);
		popup.autoSize = true;
		popup.padding = new OpenLayers.Bounds(0,0,0,0);
		popup.opacity =0.6;
		popup.backgroundColor = '#fcb100';//'lightgray';
		popup.keepInMap=false;
		popup.panMapIfOutOfView=true;
		this.map.addPopup(popup);
	}

	return popup;
}

function addMess(mess){
	var output = document.getElementById("MessageOutput");
	if( output )
		output.innerHTML = mess + '\n'+output.innerHTML;
}

function movePopupFeatureTo(map, popup, lonlat){
	popup.lonlat = lonlat;
	popup.moveTo(map.getLayerPxFromLonLat(lonlat), lonlat);
}

function toMetricSystem(v){
	var lang = navigator.userLanguage
				? navigator.userLanguage
				: navigator.language
					? navigator.language
					: navigator.browserLanguage
						? navigator.browserLanguage
						: "en";
	return lang.indexOf('ru') == 0
			? toRussianMetricSystem(v)
			: v;
}

function toRussianMetricSystem(engl){
	switch(engl){
		case 'm':return 'м';
		case 'km':return 'км';
	}
	return engl;
}

var PS_START = new OpenLayers.Style({
		fillColor: "green",
		strokeColor: "white",
		graphicName: "circle",
		pointRadius: 10
	});
var PS_END = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
		fillColor: "red",
		strokeColor: "white",
		graphicName: "circle",
		pointRadius: 10
	}, OpenLayers.Feature.Vector.style["default"]));
var PS_MIDDLE = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
		fillColor: "red",
		strokeColor: "red",
		graphicName: "circle",
		pointRadius: 5
	}, OpenLayers.Feature.Vector.style["default"]));
