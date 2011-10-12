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


        this.serversStore = new Ext.data.SimpleStore({
            fields: ['serverName', 'url'],
            data : [
                ["Прогноз метеорологических полей с высоким пространственным разрешением для Мирового океана, включая моря России, от 00 часов (ASCII файлы)", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_42/wms"],
                ["Прогноз параметров ветрового волнения в Мировом океане от 00 час", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_46/wms"],
                ["Глобальный анализ поля атмосферного давления на уровне моря от 00 час", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_60/wms"],
                ["Глобальный анализ поля атмосферного давления на уровне моря от 12 час", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_61/wms"],
                ["Краткосрочный прогноз полей скорости ветра и течений Баренцева моря от 00 час", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_62/wms"],
                ["Краткосрочный прогноз полей скорости ветра и течений Баренцева моря от 12 час", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_63/wms"],
                ["Краткосрочный прогноз метеорологических  полей для Черного моря от 00 час (сетка 10х10 км)", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_64/wms"],
                ["Краткосрочный прогноз метеорологических  полей для Каспийского моря от 00 час (сетка 10х10 км)", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_65/wms"],
                ["Краткосрочный прогноз метеорологических  полей для Азовского моря от 00 час (сетка 3х3 км)", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_66/wms"],
                ["Прогноз параметров ветрового волнения в Азовском море от 00 час", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_68/wms"],
                ["Прогноз параметров ветрового волнения в Черном море от 00 час", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_69/wms"],
                ["Прогноз параметров ветрового волнения в Каспийском море от 00 час", "http://gisbox.ru:8080/geoserver/ru_hydrometcentre_70/wms"]
                ,["Анализ и прогноз класса пожарной опасности по территории Росии от 04 час ВСВ","http://gisbox.ru:8080/geoserver/ru_hydrometcentre_114/wms"],
                ["Анализ и прогноз класса пожарной опасности по территории Росии от 06 час ВСВ","http://gisbox.ru:8080/geoserver/ru_hydrometcentre_115/wms"],
                ["Анализ и прогноз класса пожарной опасности по территории Росии от 12 час ВСВ","http://gisbox.ru:8080/geoserver/ru_hydrometcentre_116/wms"]
                ,["Местоположение судов","http://gisbox.ru:8080/geoserver/ru_morsvjazsputnik_act/wms"]
                ,["Пользовательские слои","/geoserver/wms"]
        
    
]
        });
        this.serversSelector = new Ext.form.ComboBox({
            emptyText: "Введите или выберите",
            displayField: 'serverName',
            valueField: 'url',
            editable: true,
            triggerAction: 'all',
            mode: 'local',
            store: this.serversStore,
            width: 500
        });
        this.serversSelector.on({
            //click: this.stopMouseEvents,
            //mousedown: this.stopMouseEvents,
            select: function(combo, record, index) {
                this.urlTextField.setValue(record.data.url);
                this.titleTextField.setValue(record.data.serverName);
            },
            scope: this
        });
        

        this.urlTextField = new Ext.form.TextField({
            fieldLabel: "URL",
            allowBlank: false,
            width: 240,
            msgTarget: "under",
            validator: this.urlValidator.createDelegate(this),
            hidden: true
        });

        this.titleTextField = new Ext.form.TextField({
            fieldLabel: "Title",
            allowBlank: false,
            width: 240,
            msgTarget: "under",
            hidden: true
        });

        this.form = new Ext.form.FormPanel({
            items: [
                this.titleTextField,
                this.urlTextField,
                this.serversSelector
            ],
            border: false,
            labelWidth: 30,
            bodyStyle: "padding: 5px",
            autoWidth: true,
            autoHeight: true
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
                text: "Добавить сервис",// this.addServerText,
                iconCls: "add",
                handler: function() {
                    // Clear validation before trying again.
                    this.error = null;
                    if (this.urlTextField.validate()) {
                        this.fireEvent("server-added", this.urlTextField.getValue(), this.titleTextField.getValue());
                    }else{
                        this.urlTextField.setValue(this.serversSelector.lastSelectionText);
                        if (this.urlTextField.validate()) {
                            this.fireEvent("server-added", this.urlTextField.getValue());
                        }
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
            this.urlTextField.validate(); // Remove error text.
            this.urlTextField.setValue("");
            this.loadMask.hide();
        }, this);

        this.on("server-added", function(url) {
            this.setLoading();
            var success = function(record) {
                this.hide();
            };

            var failure = function() {
                this.setError(this.sourceLoadFailureMessage);
            };

            // this.explorer.addSource(url, null, success, failure, this);
            this.addSource(url, success, failure, this);
        }, this);

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
    addSource: function(url, success, failure, scope) {
    }
});
