/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp
 *  class = NewSourceWindow
 *  extends = Ext.Window
 */
Ext.namespace("gxp");

/** api: constructor
 * .. class:: gxp.NewSourceWindow(config)
 *
 *     An Ext.Window with some defaults that better lend themselves toward use 
 *     as a quick query to get a service URL from a user.
 */
 
var	wmsStore =  new Ext.data.JsonStore({ 
	//url       : OVROOT+'wms.json',
	url       : OVROOT+'services?service=wms&action=getList',
	root      : 'services',
	fields    : ['id', 'server_name', 'url', 'owner', 'access', 'rest_url'],
	listeners :
	{
		loadexception : function(o, arg, nul, e)
		{
			gxp.plugins.Logger.log("Ошибка при загрузке списка сохраненных ресурсов WMS: "+e, gxp.plugins.Logger.prototype.LOG_LEVEL_NETWORK_LOCAL_ERRORS);
		} 
	},
	isRecordPresent : function (url)
	{
		var result = false;
		for (var i = 0; i < this.data.length; i++)
		{
			if (url === this.data.items[i].get('url'))
			{
				result = true;
				break;
	}  
		}
		return result;
	}
});

var	rssStore =  new Ext.data.JsonStore({ 
	//url       : OVROOT+'rss.json',
	url 	  : OVROOT + 'services?service=rss&action=getList',	
	root      : 'services',
	fields    : ['id', 'name', 'title', 'icon', 'url', 'owner', 'access'],
	listeners :
	{
		loadexception : function(o, arg, nul, e)
		{
			gxp.plugins.Logger.log("Ошибка при загрузке списка сохраненных ресурсов GeoRSS: "+e, gxp.plugins.Logger.prototype.LOG_LEVEL_NETWORK_LOCAL_ERRORS);
		} 
	},
	isRecordPresent : function (url)
	{
		var result = false;
		for (var i = 0; i < this.data.length; i++)
		{
			if (url === this.data.items[i].get('url'))
			{
				result = true;
				break;
	}  
		}
		return result;
	}
});

var arcgisStore =  new Ext.data.JsonStore({ 
	//url       : OVROOT+'arcgis.json',
	url       : OVROOT+'services?service=arcgis&action=getList',
	root      : 'servers',
	fields    : ['id', 'title', 'url'],
	listeners :
	{
		loadexception : function(o, arg, nul, e)
		{
			gxp.plugins.Logger.log("Ошибка при загрузке списка сохраненных ресурсов ArcGIS: "+e, gxp.plugins.Logger.prototype.LOG_LEVEL_NETWORK_LOCAL_ERRORS);
		} 
	},
	isRecordPresent : function (url)
	{
		var result = false;
		for (var i = 0; i < this.data.length; i++)
		{
			if (url === this.data.items[i].get('url'))
			{
				result = true;
				break;
	}  
		}
		return result;
	}
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
gxp.NewSourceWindow = Ext.extend(Ext.Window, {

    /** api: config[title]
     *  ``String``
     *  Window title (i18n).
     */
    title: "Add New Server...",

    /** api: config[cancelText]
     *  ``String``
     *  Text for cancel button (i18n).
     */
    cancelText: "Cancel",
    
    /** api: config[addServerText]
     *  ``String``
     *  Text for add server button (i18n).
     */
    addServerText: "Add Server",
    
    /** api: config[invalidURLText]
     *  ``String``
     *  Message to display when an invalid URL is entered (i18n).
     */
    invalidURLText: "Enter a valid URL to a WMS endpoint (e.g. http://example.com/geoserver/wms)",

    /** api: config[contactingServerText]
     *  ``String``
     *  Text for server contact (i18n).
     */
    contactingServerText: "Contacting Server...",

    blankText: "Name should not be null",

    /** api: config[bodyStyle]
     * The default bodyStyle sets the padding to 0px
     */
    bodyStyle: "padding: 0px",

    /** api: config[width]
     * The width defaults to 300
     */
    width: 600,

    /** api: config[closeAction]
     * The default closeAction is 'hide'
     */
    closeAction: 'hide',

    /** api: property[error]
     * ``String``
     * The error message set (for example, when adding the source failed)
     */
    error: null,

    /** api: event[server-added]
     * Fired with the URL that the user provided as a parameter when the form 
     * is submitted.
     */
    initComponent: function() {

        this.addEvents("server-added");
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*		
		this.serversStore =  new Ext.data.JsonStore({ 
			url       : 'wms.json',
			root      : 'services',
			fields    : [ 'serverName', 'url'],
			autoLoad  : true,
			listeners :
			{
				loadexception : function(o, arg, nul, e)
				{
					alert ("gxp.NewSourceWindow :  serversStore.listeners - LoadException : " + e);         
				} 
			}  
		});
*/		
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~		
		this.iconStore = new Ext.data.SimpleStore({
			fields: ['color', 'url'],
			data : [ 
				['голубой'   , 'script/images/marker-blue.gif'  ],
				['коричневый', 'script/images/marker-brown.gif' ],
				['желтый'    , 'script/images/marker-gold.png'  ],
				['зеленый'   , 'script/images/marker-green.png' ],
				['фиолетовый', 'script/images/marker-purple.gif'],
				['красный'   , 'script/images/marker-red.png'   ]]
		});
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~		
        this.serversSelector = new Ext.form.ComboBox({
		    fieldLabel: "WMS",
            emptyText: "Введите или выберите сервис WMS",
            displayField: 'server_name',
            valueField: 'url',
            editable: true,
            triggerAction: 'all',
            mode: 'local',
            store: wmsStore, // this.serversStore,
			anchor: '100%',
			getServerName : function()
			{
				var result = "";
				for (var i = 0; i < this.store.data.length; i++)
				{
					if (this.store.data.items[i].data.url === this.getValue())
					{
						result = this.store.data.items[i].data.server_name;
						break;
					}
				}
				return result;
			}
        });
		
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~		
        this.rssServersSelector = new Ext.form.ComboBox({
		    fieldLabel: "GeoRSS",
            emptyText: "Введите или выберите сервис GeoRSS",
            displayField: 'name',
            valueField: 'url',
            editable: true,
            triggerAction: 'all',
            mode: 'local',
            store: rssStore, // this.serversStore,
			anchor: '100%',
			getServerName : function()
			{
				var result = "";
				for (var i = 0; i < this.store.data.length; i++)
				{
					if (this.store.data.items[i].data.url === this.getValue())
					{
						result = this.store.data.items[i].data.title;
						break;
					}
				}
				return result;
			}
        });
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~		
        this.arcgisServersSelector = new Ext.form.ComboBox({
		    fieldLabel: "ArcGIS",
            emptyText: "Введите или выберите сервис ArcGIS",
            displayField: 'title',
            valueField: 'url',
            editable: true,
            triggerAction: 'all',
            mode: 'local',
            store: arcgisStore, // this.serversStore,
			anchor: '100%',
			getServerName : function()
			{
				var result = "";
				for (var i = 0; i < this.store.data.length; i++)
				{
					if (this.store.data.items[i].data.url === this.getValue())
					{
						result = this.store.data.items[i].data.title;
						break;
					}
				}
				return result;
			}
        });
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~		
        this.iconSelector = new Ext.form.ComboBox({
            fieldLabel: "Иконка",
            emptyText: "Введите или выберите иконку для GeoRSS",
            displayField: 'color',
            valueField: 'url',
            editable: true,
            triggerAction: 'all',
            mode: 'local',
            store: this.iconStore,
            anchor: '100%',
            allowBlank: false,
            blankText: this.blankText

        });

        this.serversSelector.on({
            //click: this.stopMouseEvents,
            //mousedown: this.stopMouseEvents,
            select: function(combo, record, index)
            {
                this.urlTextField.setValue(record.data.url);
                this.restUrlTextField.setValue(record.data.rest_url);
                this.titleTextField.setValue (record.data.server_name);
            },
            scope: this
        });
		
		this.rssServersSelector.on({
            //click: this.stopMouseEvents,
            //mousedown: this.stopMouseEvents,
            select: function(combo, record, index)
            {
                this.rssUrlTextField.setValue(record.data.url);                
                this.rssTitleTextField.setValue (record.data.name);
				this.iconSelector.setValue (record.data.icon);
            },
            scope: this
        });
		
		this.arcgisServersSelector.on({
            //click: this.stopMouseEvents,
            //mousedown: this.stopMouseEvents,
            select: function(combo, record, index)
            {
                this.arcgisUrlTextField.setValue(record.data.url);                
                this.arcgisTitleTextField.setValue (record.data.title);
            },
            scope: this
        });

        this.urlTextField = new Ext.form.TextField({
            fieldLabel: "URL",
            allowBlank: false,
            blankText: this.blankText,
            editable: false,
            anchor: '100%',
            msgTarget: "under",
//          validator: this.urlValidator.createDelegate(this),
            hidden: false
        });
		
		this.rssUrlTextField = new Ext.form.TextField({
            fieldLabel: "URL",
            allowBlank: false,
            blankText: this.blankText,
            editable: false,
            anchor: '100%',
            msgTarget: "under",
//          validator: this.urlValidator.createDelegate(this),
            hidden: false
        });
		
		this.arcgisUrlTextField = new Ext.form.TextField({
            fieldLabel: "URL",
            allowBlank: false,
            blankText: this.blankText,
            editable: false,
            anchor: '100%',
            msgTarget: "under",
//          validator: this.urlValidator.createDelegate(this),
            hidden: false
        });

        this.restUrlTextField = new Ext.form.TextField({
            fieldLabel: "Rest Url",
            allowBlank: true,
            blankText: this.blankText,
            editable: false,
            anchor: '100%',
            msgTarget: "under",
//          validator: this.urlValidator.createDelegate(this),
            hidden: false
        });

        this.titleTextField = new Ext.form.TextField({
            fieldLabel: "Наименование", // "Title",
            allowBlank: false,
            blankText: this.blankText,
            anchor: '100%',
            msgTarget: "under",
            hidden: false
        });
		
		this.rssTitleTextField = new Ext.form.TextField({
            fieldLabel: "Наименование", // "Title",
            allowBlank: false,
            blankText: this.blankText,
            anchor: '100%',
            msgTarget: "under",
            hidden: false
        });
		
		this.arcgisTitleTextField = new Ext.form.TextField({
            fieldLabel: "Наименование", // "Title",
            allowBlank: false,
            blankText: this.blankText,
            anchor: '100%',
            msgTarget: "under",
            hidden: false
        });

	   this.radioGroup = new Ext.form.RadioGroup({
			fieldLabel: "Сервис",
			width : 350,
			defaults: {
				labelStyle: 'padding-left:4px;'
			},
			collapsible: true,
			xtype: 'radiogroup',
			cls: 'x-check-group-alt',
//			columnWidth: .75,
			items: [
				{name: 'service', boxLabel: 'WMS'   , inputValue: 1, checked: true},
				{name: 'service', boxLabel: 'ArcGIS', inputValue: 2},
				{name: 'service', boxLabel: 'GeoRSS'   , inputValue: 3}
			]
		});
        this.radioGroup.on({
            change: function(radiogroup, radio) {
                this.lockFields(radio.inputValue);
            }, scope: this
        });

        
		
		this.form = new Ext.TabPanel({
			id: 'NewSourceWinTabPanel',
			border: false,
            bodyStyle: "padding: 5px",
            labelWidth: 90,
			activeTab: 0,
            height : 220,
            width : 620,
            autoWidth: true,
            autoHeight: false,
			items: [
				{
					id : 'WMSTab',
					title : 'WMS',
					xtype: 'form',
					items: [
						{
							xtype: 'fieldset',
							items: [
								this.serversSelector
							]
						},
						{
							xtype: 'fieldset',
							items: [
								this.titleTextField,
								this.urlTextField,
								this.restUrlTextField,
							]
						}
					]
				},
				{
					id : 'RSSTab',
					title : 'GeoRSS',
					xtype: 'form',
					items: [
						{
							xtype: 'fieldset',
							items: [
								this.rssServersSelector
							]
						},
						{
							xtype: 'fieldset',
							items: [
								this.rssTitleTextField,
								this.rssUrlTextField,
								this.iconSelector								
							]
						}
					]
				},
				{
					id : 'ArcGISTab',
					title : 'ArcGIS',
					xtype: 'form',
					items: [
						{
							xtype: 'fieldset',
							items: [
								this.arcgisServersSelector
							]
						},
						{
							xtype: 'fieldset',
							items: [
								this.arcgisTitleTextField,
								this.arcgisUrlTextField,						
							]
						}              				
					]
				}
			]
		});

        this.bbar = [
            new Ext.Button({
                text: this.cancelText,
                handler: function() {
                    this.hide();
                },
                scope: this
            }),
            new Ext.Toolbar.Fill(),
            new Ext.Button({
                text: "Добавить сервис",
                iconCls: "add",
                handler: function(){

                    //TODO realise arcgis and rss source adding and remove this!
                    //if( this.getServiceIDX() != 0 ) return;

                    // Clear validation before trying again.
                    this.error = null;

                    this.urlTextField.validationEvent=false
                    this.restUrlTextField.validationEvent=false
                    this.titleTextField.validationEvent=false

                    var isValid = this.urlTextField.validate()
                    isValid = this.restUrlTextField.validate() && isValid
                    isValid = this.titleTextField.validate() && isValid
                    //isValid = this.iconSelector.validate() && isValid
                    
                        if (this.getServiceIDX() == 'WMS') {
							var isValid = this.urlTextField.validate() && this.restUrlTextField.validate() && this.titleTextField.validate();
							if (isValid)
								this.fireEvent("server-added", this.urlTextField.getValue(), this.restUrlTextField.getValue(), this.titleTextField.getValue(), this.iconSelector.getValue(), '1.3.0');
						} else if (this.getServiceIDX() == 'GeoRSS') {
							var isValid = this.rssUrlTextField.validate() && this.iconSelector.validate() && this.rssTitleTextField.validate();
							if (isValid)
								this.fireEvent("server-added", this.rssUrlTextField.getValue(), this.rssTitleTextField.getValue(), this.iconSelector.getValue(), '1.3.0');
						} else if (this.getServiceIDX() == 'ArcGIS') {
							var isValid = this.arcgisUrlTextField.validate() && this.arcgisTitleTextField.validate();
							if (isValid)
								this.fireEvent("server-added", this.arcgisUrlTextField.getValue(), this.arcgisTitleTextField.getValue(), undefined,'1.3.0');	
						}
					
                },
                scope: this
            })
        ];

        this.items = this.form;

        gxp.NewSourceWindow.superclass.initComponent.call(this);

        this.form.on("render", function() {
            this.loadMask = new Ext.LoadMask(this.form.getEl(), {msg:this.contactingServerText});
        }, this);

        this.on("hide", function() {
            // Reset values so it looks right the next time it pops up.
            this.error = null;

            this.urlTextField.setValue("");
            this.restUrlTextField.setValue("");
            this.titleTextField.setValue("");
            this.iconSelector.setValue("");
            this.urlTextField.clearInvalid()
            this.restUrlTextField.clearInvalid()
            this.titleTextField.clearInvalid()
            this.iconSelector.clearInvalid()
            this.loadMask.hide();
        }, this);

        this.on("server-added", function(url)
		{
//			console.log ('server-added : url = ' + url + ', ' + this.getServiceIDX());
			if (this.getServiceIDX() == "WMS")
			{
				this.setLoading();
				var success = function(record) {
					this.hide();
				};

				var failure = function() {
					this.setError(this.sourceLoadFailureMessage);
				};
				// this.explorer.addSource(url, null, success, failure, this);
				this.addSource(url, success, failure, this);
			} else {
//				if (this.getServiceIDX() == 1)
//				{
//					this.setLoading();
//					var success = function(record) {
//						this.hide();
//					};
//					console.log ('server-added : ArcGIS - url = ' + url + ', name = ' + this.titleTextField.getValue());
//				}
				this.hide();
			}
        }, this);

    },
  getServiceIDX: function() { return Ext.getCmp('NewSourceWinTabPanel').getActiveTab().title },
  lockFields: function(idx)
  {    
  },

    /** private: property[urlRegExp]
     *  `RegExp`
     *
     *  We want to allow protocol or scheme relative URL  
     *  (e.g. //example.com/).  We also want to allow username and 
     *  password in the URL (e.g. http://user:pass@example.com/).
     *  We also want to support virtual host names without a top
     *  level domain (e.g. http://localhost:9080/).  It also makes sense
     *  to limit scheme to http and https.
     *  The Ext "url" vtype does not support any of this.
     *  This doesn't have to be completely strict.  It is meant to help
     *  the user avoid typos.
     */
    urlRegExp: /^(http(s)?:)?\/\/([\w%]+:[\w%]+@)?([^@\/:]+)(:\d+)?\//i,
    
    /** private: method[urlValidator]
     *  :arg url: `String`
     *  :returns: `Boolean` The url looks valid.
     *  
     *  This method checks to see that a user entered URL looks valid.  It also
     *  does form validation based on the `error` property set when a response
     *  is parsed.
     */
    urlValidator: function(url) {
        var valid;
        if (!this.urlRegExp.test(url)) {
            if(url.charAt(0)==='/'){valid = !this.error || this.error;}else
                valid = this.invalidURLText;
            
        } else {
            valid = !this.error || this.error;
        }
        // clear previous error message
        this.error = null;
        return valid;
    },

    /** private: method[setLoading]
     * Visually signify to the user that we're trying to load the service they 
     * requested, for example, by activating a loadmask.
     */
    setLoading: function() {
        this.loadMask.show();
    },

    /** private: method[setError] 
     * :param: error the message to display
     *
     * Display an error message to the user indicating a failure occurred while
     * trying to load the service.
     */
    setError: function(error) {
        this.loadMask.hide();
        this.error = error;
        this.urlTextField.validate();
    },

    /** api: config[addSource]
     * A callback function to be called when the user submits the form in the 
     * NewSourceWindow.
     *
     * TODO this can probably be extracted to an event handler
     */
    addSource: function(url, success, failure, scope) { }
});
