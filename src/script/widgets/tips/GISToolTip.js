var GISToolTipUnicCount = 0;
var GISToolTipCallbacks=[];
var GISToolTipSHIFT = {x:3, y:3};

function GISToolTipApplyCallback(ind){
	if( GISToolTipCallbacks.length > ind)
		GISToolTipCallbacks[ind].apply(window, []);
	
}
function createGISToolTip(map, layer, lonlat, content, hasClose, closeBoxCallback)
{
	var uCount = GISToolTipUnicCount++,
		opt = {map:map, layer:layer, lonlat:lonlat, content:content, hasClose:hasClose, closeCallback:closeBoxCallback,
				spanID:'GISToolTipSpan'+uCount, imgID: 'GISToolTipImg'+uCount},
		callbackCount = GISToolTipCallbacks.length;
		
	if( hasClose && closeBoxCallback)
		GISToolTipCallbacks.push(closeBoxCallback);
	content = content ? content : '';
	opt.html = '<span id="'+opt.spanID+'">'+content + '</span>' + 
		(hasClose && closeBoxCallback
			? '&nbsp;&nbsp;<img class="GISActiveImage" id="'+opt.imgID+
//				'" src="img/MiniRectClose.gif" onClick="GISToolTipApplyCallback('+ callbackCount +')"/>' 
				'" src="externals/gxp/src/theme/img/MiniRectClose.gif" onClick="GISToolTipApplyCallback('+ callbackCount +')"/>' 
			: '');
				
	return new Ext.GISToolTip(opt);
}


Ext.GISToolTip = Ext.extend(Ext.Tip, {
	map:null,
	location:null,
	lonlat:null,
	// private
    initComponent : function(){
        Ext.GISToolTip.superclass.initComponent.call(this);
        this.lastActive = new Date();
       // this.initTarget(this.target);
        this.origAnchor = this.anchor;
		
		if(this.map && this.map instanceof OpenLayers.Map){
			this.location = this.lonlat;
		}
		else if(this.map instanceof GeoExt.MapPanel) {
				this.map = this.map.map;
			}
		else if(!this.map && this.location instanceof OpenLayers.Feature.Vector &&
															this.location.layer) {
				this.map = this.location.layer.map;
		}
		
        if (this.location instanceof OpenLayers.Feature.Vector) {
            this.location = this.location.geometry;
        }
        if (this.location instanceof OpenLayers.Geometry) {
            if (typeof this.location.getCentroid == "function") {
                this.location = this.location.getCentroid();
            }
            this.location = this.location.getBounds().getCenterLonLat();
        } else if (this.location instanceof OpenLayers.Pixel) {
            this.location = this.map.getLonLatFromViewPortPx(this.location);
        }
		
		this.addAnchorEvents();
    },
	
	/** private: method[onMapMove]
     */
    onMapMove: function() {
        this._mapMove = true;
        this.position();
        delete this._mapMove;
    },
    
    /** private: method[addAnchorEvents]
     */
    addAnchorEvents: function() {
        this.map.events.on({
            "move" : this.onMapMove,
            scope : this            
        });
        
        this.on({
            "resize": this.position,
            "collapse": this.position,
            "expand": this.position,
            scope: this
        });
    },
	
	/** private: method[position]
     *  Positions the popup relative to its location
     */
    position: function() {
/*        if(this._mapMove === true) {
            var visible = this.map.getExtent().containsLonLat(this.lonlat);
            if(visible !== this.isVisible()) {
                this.setVisible(visible);
            }
        }
		//var centerPx = this.map.getViewPortPxFromLonLat(this.lonlat);
		//this.moveTo(centerPx);
*/
        if(this.isVisible()) {
            var centerPx = this.map.getViewPortPxFromLonLat(this.lonlat);
		//	this.moveTo(centerPx);
            var mapBox = Ext.fly(this.map.div).getBox(); 
    
            //This works for positioning with the anchor on the bottom.
            
            var anc = this.anc;
            var dx = 0;//anc.getLeft(true) + anc.getWidth() / 2;
            var dy = this.el.getHeight();
    
            //Assuming for now that the map viewport takes up
            //the entire area of the MapPanel
            this.setPosition(centerPx.x + mapBox.x+GISToolTipSHIFT.x /*- dx*/, centerPx.y + mapBox.y + GISToolTipSHIFT.y/*- dy*/);
        }
    },
	isVisible: function(){
		return this.visible();
	},
	visible: function(){
		return !this.hidden;
	},
	setContentHTML: function(content){
		this.sContent = this.sContent ? this.sContent : '';
		var s = document.getElementById(this.spanID);
		s.innerHTML=content;
		if( this.sContent.length != content.length){
			this.sContent = content;
			var _this = this;
			Ext.GISToolTip.superclass.doAutoWidth.call(_this);
			this.el.repaint();
/*			window.setTimeout(function(){
								var s = document.getElementById(_this.spanID);
								s.innerHTML=content+'1';
								Ext.GISToolTip.superclass.doAutoWidth.call(_this,[]);}
							, 500);
							*/
		}
		//this.body.update(content);
	},
	show: function(){
		var xy = this.map.getViewPortPxFromLonLat(this.lonlat);
		var mapBox = Ext.fly(this.map.div).getBox(); 
		xy.x += mapBox.x;
		xy.y += mapBox.y;
		Ext.GISToolTip.superclass.showAt.call(this, [xy.x+GISToolTipSHIFT.x, xy.y+GISToolTipSHIFT.y]);
	},
	hide: function(){
		Ext.ToolTip.superclass.hide.call(this);
	},
	destroy: function(){
		Ext.ToolTip.superclass.hide.call(this);
		Ext.ToolTip.superclass.destroy.call(this);
	},
	moveTo:function(xy, lonlat){ // { x: , y:} pixels
		xy = this.map.getViewPortPxFromLayerPx(xy);
		var mapBox = Ext.fly(this.map.div).getBox(); 
		xy.x += mapBox.x;
		xy.y += mapBox.y;
		Ext.GISToolTip.superclass.showAt.call(this, [xy.x+GISToolTipSHIFT.x, xy.y+GISToolTipSHIFT.y]);
		this.lonlat = lonlat;
	}
	
	
	
});

Ext.reg('GISToolTip', Ext.GISToolTip);