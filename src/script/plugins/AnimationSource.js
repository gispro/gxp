/**
 * @requires plugins/LayerSource.js
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var animationStore = new Ext.data.JsonStore({ 
	url       : 'animation.json',
	root      : 'layers',
	fields    : [ {name: 'name', mapping: 'owner'}, 'url', 'title', 'x_axis', 'layers'],
	listeners :
    {
   		load : function()
   		{
			animVar.animLoaded   = true;
			animVar.animDownload = false;
			parseAnimationStore();
   		},
		loadexception : function(o, arg, nul, e)
		{
			alert("animationStore.listeners - LoadException : " + e);         
		} 
	}  
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function parseAnimationStore()
{
	animLayers = new Array(animationStore.getRange().length);
	for (var row = 0; row < animationStore.getRange().length; row++)
	{
   		var x_axis = animationStore.getAt(row).get('x_axis');
 		var object = animationStore.getAt(row).get('layers');
		var service = {title  : animationStore.getAt(row).get('title'),
		               url    : animationStore.getAt(row).get('url'  ),
					   names  : new Array(object.length),
					   layers : new Array(object.length),
					   scale  : new Array(object.length)};
 		for (items = 0; items < object.length; items++)
		{
			service.scale  [items] = x_axis[items];
			service.names  [items] = object[items];
			service.layers [items] = null;
		}
		animServices.push (service)
	}
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function downloadAnimation()
{
	if (!animVar.animLoaded && !animVar.animDownload)
	{
		animationStore.load();
		animVar.animDownload = true;
	}
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// extend GeoExt.data.LayerStore.onAdd
function animationOnAdd(store, records, index)
 {
	if(!this._adding)
	{
		this._adding = true;
		var layer;
		for(var i=records.length-1; i>=0; --i)
		{
			layer = records[i].getLayer();
			if (layer)                         //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			{
				this.map.addLayer(layer);
				if(index !== this.map.layers.length-1)
				{
					this.map.setLayerIndex(layer, index);
				}
			}                                  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		}
		delete this._adding;
	}
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// extend GeoExt.tree.LayerNode.onStoreAdd
function animationOnStoreAdd(store, records, index)
{
	var l;
	for(var i=0; i<records.length; ++i)
	{
		if (records[i].getLayer())              //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		{
			l = records[i].getLayer();
			if(this.layer == l)
			{
				this.getUI().show();
				break;
			} else if (this.layer == l.name) {
				// layer is a string, which means the node has not yet
				// been rendered because the layer was not found. But
				// now we have the layer and can render.
				this.render();
				break;
			}
		}                                     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	}
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// extend GeoExt.tree.LayerLoader.onStoreAdd
function animationLayerLoaderOnStoreAdd(store, records, index, node)
{
	if(!this._reordering && node)
	{
		var nodeIndex = node.recordIndexToNodeIndex(index+records.length-1);
		for(var i=0; i<records.length; ++i)
		{
			if ((nodeIndex >= 0) && (records[i].data.group !== 'animation'))      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				this.addLayerNode(node, records[i], nodeIndex);
			else if ((nodeIndex >= 0) && (records[i].data.group === 'animation'))
			{
				isAdded = false;
				for(var j = 0; j < animVar.animationNode.childNodes.length; ++j)
				{
					if (animVar.animationNode.childNodes[j].text == records[i].data.title)
					{
						isAdded = true;
						break;
					}
				}
				if ((animVar.animationNode.childNodes.length === 0) || !isAdded)
					this.addLayerNode(animVar.animationNode, records[i], nodeIndex);
			}                                                                    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		}
	}
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
gxp.plugins.AnimationSource = Ext.extend(gxp.plugins.LayerSource,
{
    ptype  : "gxp_animationsource",
	layersStore : animationStore,
	
	getLayersStore : function () // url)
	{
		downloadAnimation();
		return this.layersStore;
	},

	createLayer : function(name)
	{
		layer = new OpenLayers.Layer (name, 
		{
			transparent   : 'true'
		},
		{
			isBaseLayer   : false
		});
		return layer;
	},
	
    createLayerRecord: function(config)
	{
		downloadAnimation();
		var record = new GeoExt.data.LayerRecord();
		record.setLayer (this.createLayer(config.title));
		record.set ("title"    , config.title );
		record.set ("name"     , config.name  );
		record.set ("source"   , 'animation'  );
		record.set ("group"    , 'animation'  );
		record.set ("selected" , false        );
		record.commit();
		
		return record;
    },
    createRecord: function(title, owner, curl, scale, layer_names)
	{
		var record = new GeoExt.data.LayerRecord();
		record.setLayer (this.createLayer(title));
		
		record.set ("title"     , title             );
		record.set ("name"      , owner             );
		record.set ("source"    , 'animation'       );
		record.set ("group"     , 'animation'       );
		record.set ("selected"  , false             );
		record.commit();

		return record;
    },
    getConfigForRecord: function(record) {
        var layer = record.getLayer();
        return {
            source     : record.get("source"  ),
            name       : record.get("name"    ),
            title      : record.get("title"   ),
            group      : record.get("group"   ),
            selected   : record.get("selected")
        };
    }
});

Ext.preg(gxp.plugins.AnimationSource.prototype.ptype, gxp.plugins.AnimationSource);
