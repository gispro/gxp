/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = LayerTree
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: LayerTree(config)
 *
 *    Plugin for adding a tree of layers to a :class:`gxp.Viewer`. Also
 *    provides a context menu on layer nodes.
 */   
gxp.plugins.LayerTree = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_layertree */
    ptype: "gxp_layertree",

    /** api: config[rootNodeText]
     *  ``String``
     *  Text for root node of layer tree (i18n).
     */
    rootNodeText: "Layers",

    /** api: config[overlayNodeText]
     *  ``String``
     *  Text for overlay node of layer tree (i18n).
     */
    overlayNodeText: "Overlays",

    /** api: config[baseNodeText]
     *  ``String``
     *  Text for baselayer node of layer tree (i18n).
     */
    baseNodeText: "Base Layers",
    
    /** api: config[groups]
     *  ``Object`` The groups to show in the layer tree. Keys are group names,
     *  and values are either group titles or an object with ``title`` and
     *  ``exclusive`` properties. ``exclusive`` means that nodes will have
     *  radio buttons instead of checkboxes, so only one layer of the group can
     *  be active at a time. Optional, the default is
     *
     *  .. code-block:: javascript
     *
     *      groups: {
     *          "default": "Overlays", // title can be overridden with overlayNodeText
     *          "background": {
     *              title: "Base Layers", // can be overridden with baseNodeText
     *              exclusive: true
     *          }
     *      }
     */
    groups: null,
    
    /** api: config[defaultGroup]
     *  ``String`` The name of the default group, i.e. the group that will be
     *  used when none is specified. Defaults to ``default``.
     */
    defaultGroup: "default",

    denyDefaultTree: false,
    
    /** private: method[constructor]
     *  :arg config: ``Object``
     */
    constructor: function(config) {
        gxp.plugins.LayerTree.superclass.constructor.apply(this, arguments);
        if (!this.denyDefaultTree) {
            var groups = {}

            groups["default"] = this.overlayNodeText
            groups["background"] = { title: this.baseNodeText, exclusive: true, id: 'backgroundLayers'}

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Added by gispro (before me)
            this.groups["animation"] = {
              title : animationNodeTitle //
            }
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            //Add groups from config to the end of layer list
            for(k in this.groups){
              groups[k] = this.groups[k]
            }
            this.groups = groups
        }
    },

    showProjectionError: function(node,record,projection){
      var icoEl = node.ui.getEl()
      if(!record.get('srs') || record.get('srs')[projection]){
        node.attributes.iconCls = node.attributes.correctProjectionIconCls
        if( icoEl ) icoEl.firstChild.getElementsByClassName('x-tree-node-icon')[0].setAttribute('class','x-tree-node-icon ' + node.attributes.correctProjectionIconCls)
        node.enable()
      }else{
        node.attributes.iconCls = 'gxp-tree-projectionerror-icon'
        if( icoEl ) icoEl.firstChild.getElementsByClassName('x-tree-node-icon')[0].setAttribute('class','x-tree-node-icon gxp-tree-projectionerror-icon')
        if(record.get('isHardProjection')) node.disable()
      }
    },

    
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {

        //target is gxp.Viewer instance
        var target = this.target, me = this;
        //intance of LayerStore: target.mapPanel.layers

        var addListeners = function(node, record) {
            if (record) {
              target.on("layerselectionchange", function(rec) {
                if (!me.selectionChanging && rec === record) {
                  node.select();
                }
              });
              if (record === target.selectedLayer) {
                node.on("rendernode", function() {
                  node.select();
                });
              }

              me.showProjectionError(node,record,target.map.projection)
              target.mapPanel.on('projectionchanged', function(projection){ this.showProjectionError(node,record,projection); },me);

				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				if (record.get("group") === "animation")
				{
					node.on(
					{
						checkchange : function(node, evtObj)
							{
								if (animWindow && !animWindow.hidden)
									animWindow.close();
									
								if ((selectedNode !== null) && (selectedNode !== node))
									resetSelectedNode (node.getOwnerTree().getRootNode(), selectedNode);

								if (node.attributes['checked'])
									selectedNode = node;
								else
									selectedNode = null;
									
								if (selectedNode !== null)
									showAnimWindow(node.getOwnerTree().getRootNode(), selectedNode);
							}
					});
				}
				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            }

        };
        
        // create our own layer node UI class, using the TreeNodeUIEventMixin
        var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI,
            new GeoExt.tree.TreeNodeUIEventMixin());
        
        var treeRoot = new Ext.tree.TreeNode({
            text: this.rootNodeText,
            expanded: true,
            isTarget: false,
            allowDrop: false
        });
        
        var groupConfig, defaultGroup = this.defaultGroup;
        for (var group in this.groups) {
            groupConfig = typeof this.groups[group] == "string" ?
                {title: this.groups[group]} : this.groups[group];
            treeRoot.appendChild(new GeoExt.tree.LayerContainer({
                id : groupConfig.id,
				text: groupConfig.title,
                iconCls: "gxp-folder",
                expanded: true,
                group: group == defaultGroup ? undefined : group,
                loader: new GeoExt.tree.LayerLoader({
                    baseAttrs: groupConfig.exclusive ?
                        {checkedGroup: group} : undefined,
                    store: this.target.mapPanel.layers,
                    filter: (function(group) {
                        return function(record) {
							//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
							if (record)
							{
								if (record.data.group == 'animation')
									return true;
								else
									return ((record.get("group") || defaultGroup) == group) &&
                                           (record.getLayer() && (record.getLayer().displayInLayerSwitcher == true));
							}else
							   return false;
							//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                        };
                    })(group),
                    createNode: function(attr) {
						//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
						if (attr.layer && (attr.layer.CLASS_NAME === 'OpenLayers.Layer.GeoRSS'))
							return null;
						//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                        attr.uiProvider = LayerNodeUI;
                        var layer = attr.layer;
                        var store = attr.layerStore;
                        if (layer && store) {
                            var record = store.getAt(store.findBy(function(r) {
                                return r.getLayer() === layer;
                            }));
                            if (record) {
                                if (!record.get("queryable")) {
                                    attr.iconCls = "gxp-tree-rasterlayer-icon";
                                }
                                attr.correctProjectionIconCls = attr.iconCls
                                if (record.get("fixed")) {
                                    attr.allowDrag = false;
                                }
                            }
                        }
                        var node = GeoExt.tree.LayerLoader.prototype.createNode.apply(this, arguments);
						addListeners(node, record);
                        return node;
                    }
                }),
                singleClickExpand: true,
                allowDrag: false,
                listeners: {
                    append: function(tree, node) {
                        //node.expand();
                    }
                }
            }));
        }
        
        config = Ext.apply({
            xtype: "treepanel",
            root: treeRoot,
            rootVisible: false,
            border: false,
            enableDD: true,
            selModel: new Ext.tree.DefaultSelectionModel({
                listeners: {
                    beforeselect: function(selModel, node) {
                        var changed = true;
                        var layer = node && node.layer;
                        if (layer) {
                            var store = node.layerStore;
                            var record = store.getAt(store.findBy(function(r) {
                                return r.getLayer() === layer;
                            }));
                            this.selectionChanging = true;
                            changed = this.target.selectLayer(record);
                            this.selectionChanging = false;
                        }
                        return changed;
                    },
                    scope: this
                }
            }),
            listeners: {
				afterrender: function(t) {
					t.nodeHash.backgroundLayers.collapse();
				},
				contextmenu: function(node, e) {
                    if(node && node.layer) {
                        node.select();
                        var tree = node.getOwnerTree();
                        if (tree.getSelectionModel().getSelectedNode() === node) {
                            var c = tree.contextMenu;
                            c.contextNode = node;
                            c.items.getCount() > 0 && c.showAt(e.getXY());
							Ext.getCmp("tree").doLayout();
							c.hide();
							c.items.getCount() > 0 && c.showAt(e.getXY());
                        }
                    }
                },
                beforemovenode: function(tree, node, oldParent, newParent, i) {
                    // change the group when moving to a new container
                    if(oldParent !== newParent) {
                        var store = newParent.loader.store;
                        var index = store.findBy(function(r) {
                            return r.getLayer() === node.layer;
                        });
                        var record = store.getAt(index);
                        record.set("group", newParent.attributes.group);
                    }
                },                
                scope: this
            },
            contextMenu: new Ext.menu.Menu({
                items: []
            })
        }, config || {});

        var layerTree = gxp.plugins.LayerTree.superclass.addOutput.call(this, config);

        animVar.animationNode = layerTree.root.findChild('group','animation')
        if(!animVar.animationNode) animVar.animationNode = layerTree.root.childNodes[layerTree.root.childNodes.length-1]

        return layerTree;
    }
});

Ext.preg(gxp.plugins.LayerTree.prototype.ptype, gxp.plugins.LayerTree);
