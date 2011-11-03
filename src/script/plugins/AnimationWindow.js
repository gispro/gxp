var animVar = {};

var animLayers         = []        ;
var animServices       = []        ;
var selectedNode       = null      ; 

var animWindow;
var	slider    ;

var animationNodeTitle    = 'Анимация'        ;
var TEMPL_LAYER_ANIMATION = 'Scale'           ;

// var wmsMaxResolution      = 1.4054492187499998;
// var maxAnimeOpacity       = .71               ;
// var TIMER_INTERVAL        = 25                ;
// var len                   = 400               ;
// var SLIDER_TICK_LEFT      = 6                 ;
// var SLIDER_TICK_TOP       = 12                ;
// var SLIDER_TITLE_TOP      = 18                ;
// var SLIDER_TITLE_LEFT     = 4                 ;

animVar.animLoaded            = false;
animVar.animDownload          = false;
animVar.animationNode         = false;

animVar.wmsMaxResolution      = 1.4054492187499998;
animVar.maxAnimeOpacity       = .71               ;
animVar.TIMER_INTERVAL        = 25                ;
animVar.len                   = 400               ;
animVar.SLIDER_TICK_LEFT      = 6                 ;
animVar.SLIDER_TICK_TOP       = 12                ;
animVar.SLIDER_TITLE_TOP      = 18                ;
animVar.SLIDER_TITLE_LEFT     = 4                 ;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function showAnimWindow(rootNode, selectedNode)
{ 
	if (!animWindow)
	{
		slider = new Ext.Slider({
			name         : 'slider',
			id           : 'slider',
			width        : 200,
			minValue     : 0,
			maxValue     : 100,
			x            : 65,
			y            : 6,
			scale_length : 100/10,
			listeners    : 
			{
				change: function(el, value)
				{
					if (!timer.isRunning())
						timer.setTimeInSeconds(value, animVar.TIMER_INTERVAL);

                                        // affected layers:
                                        var layerUnit = this.maxValue / (animLayers.length-1);
                                        var halfLayerUnit = layerUnit / 2.0;
                                        var curLayer = Math.floor(value/layerUnit);
                                        var transition = value - curLayer*layerUnit;
                                        var nextLayerOpacity = (transition >= halfLayerUnit ? 
                                            animVar.maxAnimeOpacity - (0.3 * ((layerUnit - transition) / halfLayerUnit )) : 
                                            ((animVar.maxAnimeOpacity*0.7) * (transition / halfLayerUnit ) )
                                        );
                                        
                                        var thisLayerOpacity = (transition < halfLayerUnit ? 
                                            animVar.maxAnimeOpacity - (0.3 * (transition / halfLayerUnit ) ): 
                                            ((animVar.maxAnimeOpacity*0.7) * ((layerUnit - transition) / halfLayerUnit ) )
                                        );
                                        
					for (var i = 0; i < animLayers.length; i++){
						if (i < curLayer)
						{
							if (animLayers[i] != null)
								animLayers[i].setOpacity (0);
						} else if (i == curLayer)
						{
							if (animLayers[i] != null)
								animLayers[i].setOpacity (thisLayerOpacity);
						} else if (i == (curLayer + 1))
						{
							if (animLayers[i] != null)
								animLayers[i].setOpacity (nextLayerOpacity);
						} else if (i > (curLayer + 1))
						{
							if (animLayers[i] != null)
								animLayers[i].setOpacity (0);
						}
                                        }
				}
			}
		});
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		drawSliderScale = function (slider, component, scale)
		{
			var cell  = document.getElementById(component);
			var x1    = animVar.SLIDER_TITLE_LEFT;
			var y     = slider.y + animVar.SLIDER_TITLE_TOP;
			var count = scale.length;
			var coord_div = document.createElement('div');
			coord_div.setAttribute('id', 'coordDiv');
			coord_div.innerHTML = "<div style='position:absolute;top:" + y + "px;left:" + x1 + 
			                      "px;font-size:9px;font-family:sans-serif;color:#aaa4a1'>" + scale[0] + "</div>";
	
			cell.appendChild(coord_div);

			var cnt  = (count - 1);
			var offs = animVar.len / cnt;
			x1 = x1 - 3;

//			alert ('drawScale : cnt = ' + cnt + ', len = ' + len + ', offs = ' + offs);

			for (var i = 0; i < cnt; i++)
			{
				coord_div = document.createElement('div');
				coord_div.setAttribute('id', 'coord' + i + 'Div');
				var x = x1 + offs * (i + 1);
				coord_div.innerHTML = "<div style='position:absolute;top:" + y + "px;left:" + x +
		                              "px;font-size:10px;font-family:sans-serif;color:#aaa4a1'>" + scale[i + 1] + "</div>";
				cell.appendChild(coord_div);
			}
		};
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		createImageDesc = function  (x, y)
		{
			return "<img src='script/images/tick.png' style='position:absolute;top:" +
                   	y + "px;left:" + x + "px;width:2px;height:6px'>";
		};
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		drawSliderTicks = function (slider, component, count)
		{
			var cell  = document.getElementById(component);

			var x1    = animVar.SLIDER_TICK_LEFT;
			var y     = slider.y  + animVar.SLIDER_TICK_TOP;

			var img1_div = document.createElement('div');
			img1_div.setAttribute('id', 'imgDiv');
			img1_div.innerHTML = createImageDesc (x1, y);
			cell.appendChild(img1_div);
	
			var xn = x1 + slider.width - 14;

			var cnt = (count - 1) * 2;
			animVar.len = xn - x1;
			var offs = animVar.len / cnt;
			for (var i = 0; i < cnt; i++)
			{
				var img_div = document.createElement('div');
				img_div.setAttribute('id', 'img' + i + 'Div');
				var x = x1 + offs * (i + 1);
				img_div.innerHTML = createImageDesc (x, y);
				cell.appendChild(img_div);
			}
		};
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		removeSliderScale = function (component, count)
		{
			var slider = document.getElementById(component);
			var cnt    = count - 1;
			for (var i = 0; i < cnt; i++)
			{
				var img = document.getElementById('coord' + i + 'Div');
				if (img != null)
					slider.removeChild(img);
			}
			slider.removeChild(document.getElementById('coordDiv'));
		};
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		removeSliderTicks = function (component, count)
		{
			var slider = document.getElementById(component);
			var cnt    = (count - 1) * 2;
			for (var i = 0; i < cnt; i++)
			{
				var img = document.getElementById('img' + i + 'Div');
				slider.removeChild(img);
			}
			slider.removeChild(document.getElementById('imgDiv'));
		};
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		btnReset = new Ext.Button({
			scale    : 'small', 
			cls      : 'x-btn-icon',
			icon     : 'script/images/stop.png',
			x        : 5,
			y        : 10,
			handler  : function (b,e)
			{
				if (!timer.isRunning())
					reset();
			}
		});
		btnPlay = new Ext.Button({
			scale    : 'small', 
			cls      : 'x-btn-icon',
			icon     : 'script/images/play.png',
			x        : 30,
			y        : 10,
			handler  : function (b,e)
			{
				if (!timer.isRunning())
					runAnimation();
				else
					stopAnimation();
			}
		});
		animWindow = new Ext.Window(
		{
			title         : animationNodeTitle, 
			layout        : 'absolute',
			width         : 430,
			height        : 90,
			plain         : true,
			modal         : false,
			border        : true,
//			resizable     : false,
            collapsible   : true,
			root          : rootNode,
			node          : selectedNode,
			animWinClosed : true,
            listeners     :
			{
				close:function()
				{ 
					this.animWinClosed = false;
					resetSelectedNode (this.root, this.node);
					closeAnimWindow();
					animWindow = false;
					this.animWinClosed = true;
                },
				beforeshow : function ()
				{
					if (this.animWinClosed)
					{
						idx = getScenarioIDX (selectedNode);
						if (animServices[idx].scale)
						{
							slider.scale_length = 100 / (animServices[idx].scale.length - 1);
							drawSliderTicks(slider, 'slider', animServices[idx].scale.length);
							drawSliderScale(slider, 'slider', animServices[idx].scale);
						} else
                                   // Сервисы для анимации не загружены
							alert ('\u0421\u0435\u0440\u0432\u0438\u0441\u044B\u0020\u0434\u043B\u044F\u0020\u0430\u043D\u0438\u043C\u0430\u0446\u0438\u0438\u0020\u043D\u0435\u0020\u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u044B');
						if (idx >= 0)
							addLayers(idx);	
					}
					this.animWinClosed = false;
				},
				bodyresize : function (p, w, h)
				{
					slider.width = w - slider.x - 10;
					this.doLayout;
				}
			},
			items : [btnReset, btnPlay, slider]
		});
		getScenarioIDX = function (selectedNode)
		{
			for (i = 0; i < animServices.length; i++)
			{
				if (animServices[i].title === selectedNode.text)
					return i;
			}
			return -1;
		};
		getRootChildNode = function (rootNode, node_name)
		{
			for (i = 0; i < rootNode.childNodes.length; i++)
			{
				if (rootNode.childNodes[i].text === node_name)
					return rootNode.childNodes[i];
			}
			return null;
		};
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		function createAnimationLayerName(scale, item, tree_idx)
		{
			return ' ' + TEMPL_LAYER_ANIMATION + ' ' + tree_idx + '.' + scale [item];
		};
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		function createAnimationLayer(name, url, layer_names, item)
		{
			var layer = new OpenLayers.Layer.WMS (name, url,
				{
					layers        : layer_names [item],
					srs           : new OpenLayers.Projection('EPSG:900913'),
					format        : 'image/png',
					tiled         : 'true',
					minZoomLevel  : 4,
					maxZoomLevel  : 17,
					maxResolution : animVar.wmsMaxResolution,
					transparent   : 'true'
				},
				{
					singleTile    : 'true',
					buffer        : 0,
					ratio         : 1,
					isBaseLayer   : false,
					displayOutsideMaxExtent: 'true'
				});
			return layer;
		};
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		addLayers = function (idx)
		{
			for (items = animServices[idx].names.length - 1; items >= 0; items--)
			{
				name = createAnimationLayerName(animServices[idx].scale, items, idx);
				animServices[idx].layers[items] = createAnimationLayer(name, animServices[idx].url, 
			                                                           animServices[idx].names, items);
				if (items > 0)
					animServices[idx].layers[items].setOpacity (0);
				else
					animServices[idx].layers[items].setOpacity (1);
				app.mapPanel.map.addLayer(animServices[idx].layers[items]);
			}
			for (var j = 0; j < animLayers.length; j++)
				animLayers [j] = null;

			for (items = animServices[idx].names.length - 1; items >= 0; items--)
			{
				var layer = getMapLayer (animServices[idx].layers[items].name); 
				if (layer != null)
					animLayers [items] = layer;
			}
			reset();
		};
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		resetSelectedNode = function  (rootNode, selectedNode)
		{
			node = getRootChildNode(rootNode, animationNodeTitle);
			if (selectedNode != null)
			{
				if ((node != null) && (node.childNodes != null))
				{
					for (i = 0; i < node.childNodes.length; i++)
					{
						if (node.childNodes[i].text == selectedNode.text)
						{
							selectedNode.getUI().toggleCheck(false); 
							break;
						}
					}
				}
			}
		};
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		function getMapLayer (layerName)
		{
			for (var i=0, ii = app.mapPanel.map.layers.length; i<ii; ++i)
			{
				if (app.mapPanel.map.layers[i].name === layerName)
				{
					var record = app.mapPanel.map.layers[i].layerRecord;
					return app.mapPanel.map.layers[i];
				}
			}
			return null;
		}
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		function timerRunCB ()
		{
			slider.setValue (slider.getValue() + 1); 
		}
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		function runAnimation()
		{
			if (slider.getValue() === 0)
				timer.init (animVar.TIMER_INTERVAL);
			timer.setRunCallBack (timerRunCB   );
			timer.setEndCallBack (stopAnimation);
			timer.start();
			btnPlay.setIcon('script/images/pause.png');
			slider.disable (true);
		}
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		function stopAnimation()
		{
			timer .stop();
			slider.enable (true);
			btnPlay.setIcon('script/images/play.png');
		}
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		function reset()
		{
			for (var j = 0; j < animLayers.length; j++)
			{
				if (animLayers [j] != null)
				{
					if (j > 0)
						animLayers [j].setOpacity(0);
					else
						animLayers [j].setOpacity(animVar.maxAnimeOpacity);
				}
			}
			slider.setValue(0);
		}
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		function closeAnimWindow()
		{
			if (!animWindow)
				animWindow = false;
			if (animLayers [0] != null)
			{
				reset();
				animLayers [0].setOpacity(0);
			}		

			for (var i = (app.mapPanel.map.layers.length - 1); i >= 0; i--)
			{
				if (app.mapPanel.map.layers[i].name.indexOf (TEMPL_LAYER_ANIMATION) > 0)
					app.mapPanel.map.layers.remove (app.mapPanel.map.layers[i]);
			}
			for (var i = (app.mapPanel.layers.data.items.length - 1); i >= 0; i--)
			{
				if (app.mapPanel.layers.data.items[i].data.title.indexOf (TEMPL_LAYER_ANIMATION) > 0)
					app.mapPanel.layers.data.items.remove (app.mapPanel.layers.data.items[i]);
			}
		}
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	} else
		animWindow.node = selectedNode; 
//		animWindow.node = selectedNode; 

	//animWindow.setPosition(5, 580, null);
	animWindow.show();
        animWindow.alignTo(app.mapPanel.body, "bl-bl?", [10, -10]);
} // end showAnimWindow(rootNode, selectedNode)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// extend GeoExt.LegendPanel.addLegend
function animationAddLegend(record, index)
 {
	if (record.getLayer().name.indexOf(TEMPL_LAYER_ANIMATION) === -1)
	{
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
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// extend GeoExt.tree.LayerNode.render
function animationRender(bulkRender)
{
	var layer = this.layer instanceof OpenLayers.Layer && this.layer;
	if(layer)
	{
	if (layer.name.indexOf (TEMPL_LAYER_ANIMATION) === -1)
	{
		if(!layer)
		{
			// guess the store if not provided
			if(!this.layerStore || this.layerStore == "auto") {
				this.layerStore = GeoExt.MapPanel.guess().layers;
			}
			// now we try to find the layer by its name in the layer store
			var i = this.layerStore.findBy(function(o) {
				return o.get("title") == this.layer;
			}, this);
			if(i != -1) {
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
					Ext.applyIf(this.attributes, {checkedGroup: "gx_baselayer"});
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
	}
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// extend GeoExt.LegendPanel.recordIndexToPanelIndex
function animationRecordIndexToPanelIndex(index)
 {
	var store = this.layerStore;
	var count = store.getCount();
	var panelIndex = -1;
	var legendCount = this.items ? this.items.length : 0;
	var record, layer;
	for(var i=count-1; i>=0; --i)
	{
		record = store.getAt(i);
		if (record)
		{
			layer = record.getLayer();
			var types = GeoExt.LayerLegend.getTypes(record);
			if(layer.displayInLayerSwitcher && types.length > 0 && (store.getAt(i).get("hideInLegend") !== true))
			{
				++panelIndex;
				if(index === i || panelIndex > legendCount-1)
				{
					break;
				}
			}
		}
	}
    return panelIndex;
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var timer = 
{
	installTimeInSeconds  : 100,
    currentTimeInSeconds  : 0,

    runCallBack           : null,
    endCallBack           : null,

    running               : false,
    interval              : 1000,
    
    init : function (interval)
    {
		this.installTimeInSeconds = 100;
		this.currentTimeInSeconds = this.installTimeInSeconds;
		this.interval = interval;
    },
    
    run: function()
    {
        this.currentTimeInSeconds = this.currentTimeInSeconds - 1;
        if (this.runCallBack != null)
        	this.runCallBack();
        if (this.isFinished())
        {
            this.stop();
            return;
        }
    },
    
    isFinished: function()
    {
        if ( this.currentTimeInSeconds <= 0 )
            return true;
        return false;
    },
    
    setRunCallBack: function (fn)
    {
        this.runCallBack = fn;
    },

    setEndCallBack: function (fn)
    {
        this.endCallBack = fn;
    },

    setTimeInSeconds: function(seconds, interval)
    {
    	this.currentTimeInSeconds = this.installTimeInSeconds - seconds;
    	this.interval             = interval;
    },
    start: function()
    {
        Ext.TaskMgr.start (this);
        this.running = true;
    }, 
    
    stop: function()
    {
        if (this.running)
        {
            Ext.TaskMgr.stop( this );
            this.running = false;
			if (this.endCallBack != null)
				this.endCallBack();
        }
    },
    
    isRunning : function()
    {
        return this.running;
    }
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
