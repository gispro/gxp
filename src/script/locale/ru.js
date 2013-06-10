GeoExt.Lang.add("ru", {

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Слой"
    },

    "gxp.plugins.LayerSource.prototype.errorMessages": {
        404: 'Ресурс не найден',
        403: 'В доступе к ресурсу отказано',
        302: 'Ресурс был перемещен',
        500: 'Сервер недоступен'
    },

    "gxp.plugins.LayerSource.prototype": {
      errorMessageTitle: 'Во время добавления ресурса возникли ошибки.'
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Добавить слои",
        addActionTip: "Добавить слои",
        addServerText: "Добавить сервис",
        addButtonText: "Добавить слои",
        untitledText: "Безымянный",
        addLayerSourceErrorText: "Ошибка получения WMS ({msg}).\nПожалуйста проверьте ссылку и попробуйте еще раз.",
        availableLayersText: "Доступные слои", 
        expanderTemplateText: "<p><b>Описание:</b> {abstract}</p>",
        panelTitleText: "Заголовок",
        layerSelectionText: "Просматривать слои с:",
        doneText: "Готово",
        uploadText: "Загрузить данные",
		ascText: "Сортировать по возрастанию",
		descText: "Сортировать по убыванию",
		colText: "Колонки"
    },
	
	"gxp.plugins.RubricatorTree.prototype": {
		title: "Рубрики",
		metadata: "Метаданные",
		geoserviceMetadata: "Метаданные геосервиса",
		resourceMetadata: "Метаданные ресурса",
		nodeid: "Номер узла",
		resourceid: "Ресурс",
		workspace: "Рабочая область",
		nodename: "Имя узла",
		layername: "Имя слоя",
		parentnode: "Родительский узел",
		serverpath: "Адрес сервера",
		servicepath: "Адрес сервиса",
		servicetype: "Тип сервиса",
		stylename: "Имя стиля",
		defaultValue: "Значение не определено",
		errorTitle: "Ошибка",
		proxyException: "Невозможно добавить слой. Проверьте конфигурацию ресурса и настройки прокси-сервера",	
		noRecordsFound: "Выбранный слой недоступен",
		resourceLoadMask: "Подключение ресурса..."
	},
	
	"gxp.plugins.AnimationManager.prototype": {
        addActionMenuText: "Добавить слои",
        addActionTip: "Добавить слои",
        addServerText: "Добавить сервис",
        addButtonText: "Добавить слои",
        untitledText: "Безымянный",
        addLayerSourceErrorText: "Ошибка получения WMS ({msg}).\nПожалуйста проверьте ссылку и попробуйте еще раз.",
        availableLayersText: "Доступные слои",
        expanderTemplateText: "<p><b>Описание:</b> {abstract}</p>",
        panelTitleText: "Заголовок",
        layerSelectionText: "Просматривать слои с:",
        doneText: "Готово",
		cancelText: "Отмена",
        uploadText: "Загрузить данные",
		windowTitle: "Настройка анимации",		
		includeBtnText: "Включить",
		excludeBtnText: "Исключить",
		moveUpBtnText: "Вверх",
		moveDownBtnText: "Вниз",
		chosenLayersText: "Выбранные слои",
		actionText: "Действия",
		panelLabelText: "Подпись",
		animationNameText: "Наименование:",
		nameRequiredErrorText: "Пожалуйста, введите наименование",
		layersRequiredErrorText: "Выберите хотя бы один слой",
		errorTitleText: "Ошибка",
		xaxisRequiredErrorText: "Введите подписи для всех выбранных слоев",
		ascText: "Сортировать по возрастанию",
		descText: "Сортировать по убыванию",
		colText: "Колонки",
		saveSucceedText: "Анимация успешно сохранена",
		saveFailedText: "Произошла ошибка при сохранении анимации",
		saveText: "Сохранение",
		doubledRecordText: "Запись с такими полями уже существует",
		errorText: "Ошибка",
		aimationInvalidErrorText: "Невозможно открыть анимацию. Возможно, она состоит не из WMS-слоев или была повреждена"
    },
	
	"gxp.plugins.AnimationGrid.prototype": {
		windowTitle: "Менеджер анимации",
		addAnimationText: "Добавить",
		animationTitleText: "Название",
		ownerTitleText: "Владелец",
		actionText: "Действия",
		editBtnText: "Редактировать",
		deleteBtnText: "Удалить",
		ascText: "Сортировать по возрастанию",
		descText: "Сортировать по убыванию",
		colText: "Колонки",
		doneText: "Готово",
		askForDeleteHeaderText: "Удаление анимации",
		askForDeleteText: "Вы действительно хотите удалить выбранную анимацию?",
		yesText: "Да",
		noText: "Нет"
	},
    
	"gxp.plugins.ChartManager.prototype": {
		windowTitle: "Менеджер графиков",
		addChartText: "Добавить",
		chartTitleText: "Название",
		ownerTitleText: "Владелец",
		actionText: "Действия",
		editBtnText: "Редактировать",
		deleteBtnText: "Удалить",
		ascText: "Сортировать по возрастанию",
		descText: "Сортировать по убыванию",
		colText: "Колонки",
		doneText: "Готово",
		askForDeleteHeaderText: "Удаление описания графика",
		askForDeleteText: "Вы действительно хотите удалить выбранное описание графика?",
		yesText: "Да",
		noText: "Нет",
		deleteErrorHeader: "Предупреждение",
		deleteErrorText: "Невозможно удалить график, используемый по умолчанию",
		defaultUseText: "Использовать по умолчанию",
		serviceURLText: "URL сервиса"
	},
    
	"gxp.plugins.ChartEditor.prototype": {
        addActionMenuText: "Добавить слои",
        addActionTip: "Добавить слои",
        addServerText: "Добавить сервис",
        addButtonText: "Добавить слои",
        untitledText: "Безымянный",
        addLayerSourceErrorText: "Ошибка получения WMS ({msg}).\nПожалуйста проверьте ссылку и попробуйте еще раз.",
        availableLayersText: "Доступные слои",
        expanderTemplateText: "<p><b>Описание:</b> {abstract}</p>",
        panelTitleText: "Заголовок",
        selectSourceText: "Сервис",
        doneText: "Готово",
		cancelText: "Отмена",
		layerSelectionText: "Просматривать слои с: ",
		errorText: "Ошибка",	
		wrongAxisRequest: "Не удалось получить метаданные",
        uploadText: "Загрузить данные",
		queryLayerText: "Использовать",
		includeBtnText: "Включить",
		excludeBtnText: "Исключить",
		moveUpBtnText: "Вверх",		
		moveDownBtnText: "Вниз",
		performFieldsText: "Получить описание полей",
		chosenLayersText: "Выбранные слои",
		actionText: "Действия",
		panelLabelText: "Подпись",
		chartNameText: "Наименование",
		nameRequiredErrorText: "Пожалуйста, введите наименование",
		layersRequiredErrorText: "Выберите хотя бы один слой",
		errorTitleText: "Ошибка",
		xaxisRequiredErrorText: "Введите подписи для всех выбранных слоев",
		fieldsRequiredErrorText: "Выберите оси для создаваемого графика",
		ascText: "Сортировать по возрастанию",
		descText: "Сортировать по убыванию",
		colText: "Колонки",
		saveSucceedText: "Данные успешно сохранены",
		saveFailedText: "Произошла ошибка при сохранении",
		saveText: "Сохранение",
		doubledRecordText: "Запись с такими полями уже существует",
		errorText: "Ошибка",
		aimationInvalidErrorText: "Невозможно открыть график. Возможно, отсутствует картографический сервис или график был поврежден",
		windowTitle: "Настройка графика",
		XText: "Ось X: ",
		YText: "Ось Y: ",
		isDefaultText: "Использовать по умолчанию"		
    },
	
    "gxp.plugins.BingSource.prototype": {
        title: "Bing Layers",
        roadTitle: "Bing Roads",
        aerialTitle: "Bing Aerial",
        labeledAerialTitle: "Bing Aerial With Labels"
    },

    "gxp.plugins.FeatureEditor.prototype": {
        createFeatureActionTip: "Создать новый объект",
        editFeatureActionTip: "Редактировать объект"
    },
    
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Отобразить на карте",
        firstPageTip: "Первая страница",
        previousPageTip: "Предыдущая страница",
        zoomPageExtentTip: "Показать границы слоя",
        nextPageTip: "Следующая страница",
        lastPageTip: "Последняя страница",
        totalMsg: "Всего: {0} записей",
        zoomToFeaturesTip: "Показать всю геометрию выборки",
		statisticsText: "Статистика",
		ascText: "Сортировать по возрастанию",
		descText: "Сортировать по убыванию",
		colText: "Колонки",
		createGetFeatureInfoFieldsPanelText: 'Отображение полей в окне информации',
        getFeatureInfoPanelFieldNameHeader: 'Код',
        getFeatureInfoPanelFieldTranslateHeader: 'Название',
        getFeatureInfoPanelFieldShowHeader: 'Отображать',
        getFeatureInfoPanelFieldText: "Участвовать в запросах",
        stylesText: "Стили",
        singleTileText: 'Загружать по частям',
        getFeatureInfoPanelFieldStatisticWindowTitle: 'Статистика',
        getFeatureInfoPanelFieldStatisticHeader: 'Статистика',
        wpsLiterals: {
          Count: 'Количество объектов',
          Average: 'Среднее арифметическое',
          Max: 'Максимум',
          Median: 'Медиана',
          Min: 'Минимум',
          StandardDeviation: 'Отклонение',
          Sum: 'Сумма'
        },
        statisticNotAvailableText: 'Статистика не доступна.'
    },

    "gxp.plugins.GoogleEarth.prototype": {
        apiKeyPrompt: "Пожалуйста укажите Google API key для ",
        menuText: "Google Earth",
        tooltip: "Переключиться на Google Earth"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google Layers",
        roadmapAbstract: "Show street map",
        satelliteAbstract: "Show satellite imagery",
        hybridAbstract: "Show imagery with street names",
        terrainAbstract: "Show street map with terrain"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Свойства слоя",
        toolTip: "Свойства слоя"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Слои",
        overlayNodeText: "Слои",
        baseNodeText: "Картоосновы"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Показать легенду",
        tooltip: "Показать легенду"
    },

    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Длина",
        areaMenuText: "Площадь",
        lengthTooltip: "Измерение длины",
        areaTooltip: "Измерение площади",
        measureTooltip: "Измерения"
    },

    "gxp.plugins.GISMeasure.prototype": {
       lengthMenuText: "Длина",
       areaMenuText: "Площадь",
       lengthTooltip: "Измерение длины",
       areaTooltip: "Измерение площади",
       measureTooltip: "Измерения"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Панорамировать карту",
        tooltip: "Панорамировать карту"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Предыдущая видимая область",
        nextMenuText: "Следующая видимая область",
        previousTooltip: "Предыдущая видимая область",
        nextTooltip: "Следующая видимая область"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap Layers",
        mapnikAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        menuText: "Печать карты",
        tooltip: "Печать карты",
        previewText: "Предварительный просмотр",
        notAllNotPrintableText: "Не все слои могут быть напечатаны",
        nonePrintableText: "Не все слои вашей карты могут быть напечатаны"
    },
	
	"gxp.plugins.Logger.prototype": {
        menuText: "Журнал",
        tooltip: "Показать журнал"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest Layers",
        osmAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest Imagery"
    },

    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Выборка",
        queryMenuText: "Запросить слой",
        queryActionTip: "Запросить выбранный слой",
        queryByLocationText: "Геозапрос",
        currentTextText: "Текущая видимая область",
        queryByAttributesText: "Запрос по атрибуту",
        queryMsg: "Запрос",
        cancelButtonText: "Отмена",
        noFeaturesTitle: "Нет совпадений",
        noFeaturesMessage: "Ваш запрос ничего не вернул.",
        geometryText: "Тип геометрии",
        drawPointText: "Точки",
        drawLineText: "Линии",
        drawPolygonText: "Полигоны",
        cleanGeomText: "Очистить геометрию",
        stopQuery: "Отменить запрос",
        downloadText: 'Скачать'
    },

    "gxp.plugins.UploadPlugin.prototype": {
		uploadText: "Идет загрузка данных",
		addActionTip: "Загрузить данные"
    },
	
	"gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Удалить слой",
        removeActionTip: "Удалить слой",
		errorHeader: "Слой не выбран",
		errorText: "Пожалуйста, выберите слой"
    },
    
    "gxp.plugins.Styler.prototype": {
        menuText: "Редактировать стиль",
        tooltip: "Редактировать стиль"

    },

    "gxp.plugins.GridWmsFeatureInfo.prototype": {
        infoActionTip: "Информация",
        popupTitle: "Информация",
		ascText: "Сортировать по возрастанию",
		descText: "Сортировать по убыванию",
		colText: "Колонки",
		groupByText: "Группировать по этому полю",
		showGroupsText: "Показывать в группах"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Приблизить",
        zoomOutMenuText: "Отдалить",
        zoomInTooltip: "Приблизить",
        zoomOutTooltip: "Отдалить"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Показать всю карту",
        tooltip: "Показать всю карту"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Показать видимые границы слоя",
        tooltip: "Показать видимые границы слоя"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Показать видимые границы слоя",
        tooltip: "Показать видимые границы слоя"
    },
    
    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Информация",
        popupTitle: "Информация"
    },
	
	 "gxp.plugins.ZoomToSelectedFeatures.prototype": {
        menuText: "Показать выбранный объект",
        tooltip: "Показать выбранный объект"
    },

    "gxp.FeatureEditPopup.prototype": {
        closeMsgTitle: "Сохранить изменения?",
        closeMsg: "Объект имеет несохраненные изменения. Вы хотите сохранить изменения?",
        deleteMsgTitle: "Удалить изменения?",
        deleteMsg: "Вы действительно хотите удалить объект?",
        editButtonText: "Редактировать",
        editButtonTooltip: "Сделать объект редактируемым",
        deleteButtonText: "Удалить",
        deleteButtonTooltip: "Удалить объект",
        cancelButtonText: "Отмена",
        cancelButtonTooltip: "Остановить редактирование, отменить изменения",
        saveButtonText: "Сохранить",
        saveButtonTooltip: "Сохранить изменения"
    },
    
    "gxp.FillSymbolizer.prototype": {
        fillText: "Заливка",
        colorText: "Цвет",
        opacityText: "Прозрачность"
    },
    
    "gxp.FilterBuilder.prototype": {
        builderTypeNames: ["любые", "все", "ни одно", "не все"],
        preComboText: "Совпадают",
        postComboText: "из следующих условий:",
        addConditionText: "добавить условие",
        addGroupText: "добавить группу",
        removeConditionText: "удалить условие"
    },
    
    "gxp.grid.CapabilitiesGrid.prototype": {
        nameHeaderText : "Название",
        titleHeaderText : "Заголовок",
        queryableHeaderText : "Queryable",
        layerSelectionLabel: "Просматривать слои с:",
        layerAdditionLabel: "или добавить новый сервер.",
        expanderTemplateText: "<p><b>Описание:</b> {abstract}</p>"
    },
    
    "gxp.PointSymbolizer.prototype": {
        graphicCircleText: "круг",
        graphicSquareText: "квадрат",
        graphicTriangleText: "треугольник",
        graphicStarText: "звезда",
        graphicCrossText: "крест",
        graphicXText: "x",
        graphicExternalText: "внешний",
        urlText: "URL",
        opacityText: "прозрачность",
        symbolText: "Символ",
        sizeText: "Размер",
        rotationText: "Поворот"
    },

    "gxp.QueryPanel.prototype": {
        queryByLocationText: "Query by location",
        currentTextText: "Current extent",
        queryByAttributesText: "Query by attributes",
        layerText: "Layer"
    },
    
    "gxp.RulePanel.prototype": {
        scaleSliderTemplate: "{scaleType} Scale 1:{scale}",
        labelFeaturesText: "Использовать надписи",
        labelsText: "Надписи",
        basicText: "Общее",
        advancedText: "Фильтры",
        limitByScaleText: "По масштабу",
        limitByConditionText: "По условию",
        symbolText: "Стиль",
        nameText: "Название"
    },
    
    "gxp.ScaleLimitPanel.prototype": {
        scaleSliderTemplate: "{scaleType} Масштаб 1:{scale}",
        minScaleLimitText: "Максимальный",
        maxScaleLimitText: "Минимальный"
    },
    
    "gxp.StrokeSymbolizer.prototype": {
        solidStrokeName: "сплошная",
        dashStrokeName: "пунктирная",
        dotStrokeName: "точечная",
        titleText: "Обводка",
        styleText: "Стиль",
        colorText: "Цвет",
        widthText: "Толщина",
        opacityText: "Прозрачность"
    },
    
    "gxp.StylePropertiesDialog.prototype": {   
        titleText: "Основной",
        nameFieldText: "Название",
        titleFieldText: "Заголовок",
        abstractFieldText: "Описание"
    },
    
    "gxp.TextSymbolizer.prototype": {
        labelValuesText: "Атрибут",
        haloText: "Гало",
        sizeText: "Размер"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "О слое",
        titleText: "Заголовок",
        nameText: "Название",
        descriptionText: "Описание",
        displayText: "Отображение",
        opacityText: "Прозрачность",
        formatText: "Формат",
        transparentText: "Без фона",
        cacheText: "Кэш",
        cacheFieldText: "Использовать кэш",
        getFeatureInfoPanelText: "Поля",
        createGetFeatureInfoFieldsPanelText: 'Отображение полей в окне информации',
        getFeatureInfoPanelFieldNameHeader: 'Код',
        getFeatureInfoPanelFieldTranslateHeader: 'Название',
        getFeatureInfoPanelFieldShowHeader: 'Отображать',
        getFeatureInfoPanelFieldText: "Участвовать в запросах",
        stylesText: "Стили",
        singleTileText: 'Загружать по частям',
        getFeatureInfoPanelFieldStatisticWindowTitle: 'Статистика',
        getFeatureInfoPanelFieldStatisticHeader: 'Статистика',
        wpsLiterals: {
          Count: 'Количество объектов',
          Average: 'Среднее арифметическое',
          Max: 'Максимум',
          Median: 'Медиана',
          Min: 'Минимум',
          StandardDeviation: 'Отклонение',
          Sum: 'Сумма'
        },
        statisticNotAvailableText: 'Статистика не доступна.'
    },

    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Ваша карта готова для публикации! Просто скопируйте HTML код чтобы встроить карту на ваш сайт:",
        heightLabel: 'Высота',
        widthLabel: 'Ширина',
        mapSizeLabel: 'Размер карты',
        miniSizeLabel: 'Мини',
        smallSizeLabel: 'Маленький',
        premiumSizeLabel: 'Большой',
        largeSizeLabel: 'Средний'
    },
    
    "gxp.WMSStylesDialog.prototype": {
         addStyleText: "Добавить",
         addStyleTip: "Добавить новый стиль",
         chooseStyleText: "Выбрать стиль",
         deleteStyleText: "Удалить",
         deleteStyleTip: "Удалить выбранный стиль",
         editStyleText: "Редактировать",
         editStyleTip: "Редактировать выбранный стиль",
         duplicateStyleText: "Дублировать",
         duplicateStyleTip: "Дублировать стиль",
         addRuleText: "Добавить",
         addRuleTip: "Добавить правило",
         newRuleText: "Новое правило",
         deleteRuleText: "Удалить",
         deleteRuleTip: "Удалить правило",
         editRuleText: "Редактировать",
         editRuleTip: "Редактировать правило",
         duplicateRuleText: "Дублировать",
         duplicateRuleTip: "Дублировать правило",
         cancelText: "Отмена",
         saveText: "Сохранить",
         styleWindowTitle: "Пользовательский стиль: {0}",
         ruleWindowTitle: "Правило стиля: {0}",
         stylesFieldsetTitle: "Стили",
         rulesFieldsetTitle: "Правила",
         defaultStyle: 'По умолчанию'
    },

    "gxp.LayerUploadPanel.prototype": {
        titleLabel: "Заголовок",
        titleEmptyText: "Заголовок слоя",
        abstractLabel: "Описание",
        abstractEmptyText: "Описание слоя",
        fileLabel: "Данные",
        fieldEmptyText: "Обзор",
        uploadText: "Загрузить",
        waitMsgText: "Идет загрузка данных",
        invalidFileExtensionText: "Расширение файла должно быть одним из: ",
        optionsText: "Опции",
        workspaceLabel: "Рабочее окружение",
        workspaceEmptyText: "Рабочее окружение по умолчанию",
        dataStoreLabel: "Хранилище",
        dataStoreEmptyText: "Хранилище по умолчанию",
		error: "Ошибка",
		uploadError: "Произошла ошибка при загрузке данных",
		waitHeaderText: "Пожалуйста, подождите..."
    },
    
    "gxp.NewSourceWindow.prototype": {
        title: "Добавить новый сервис",
        cancelText: "Отмена",
        addServerText: "Добавить сервис",
        invalidURLText: "Введите правильный путь к WMS (пример http://example.com/geoserver/wms)",
        contactingServerText: "Соединение с сервером",
        blankText: "Поле не может быть пустым."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Уровень"
    },

    "Styler.ColorManager.prototype": {
        colorPickerText: 'Выбор цвета'
    },

    "Ext.ux.ColorPicker.prototype": {
        colorText: 'Цвет',
        websafeText: 'Сохраненный',
        inverseText: 'Инвентировать'
    },

    "gxp.form.ColorField.prototype": {
        cssColors: {
          'голубой': "#00FFFF",
          'черный': "#000000",
          'синий': "#0000FF",
          fuchsia: "#FF00FF",
          'серый': "#808080",
          'зеленый': "#008000",
          lime: "#00FF00",
          maroon: "#800000",
          navy: "#000080",
          olive: "#808000",
          'фиолетовый': "#800080",
          'красный': "#FF0000",
          silver: "#C0C0C0",
          teal: "#008080",
          'беленький': "#FFFFFF",
          'желтый': "#FFFF00"
        }
    },

    "gxp.form.ComparisonComboBox.prototype": {
      allowedTypes: [
          [OpenLayers.Filter.Comparison.EQUAL_TO, "="],
          [OpenLayers.Filter.Comparison.NOT_EQUAL_TO, "<>"],
          [OpenLayers.Filter.Comparison.LESS_THAN, "<"],
          [OpenLayers.Filter.Comparison.GREATER_THAN, ">"],
          [OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO, "<="],
          [OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO, ">="],
          [OpenLayers.Filter.Comparison.LIKE, "содержит"],
          [OpenLayers.Filter.Comparison.BETWEEN, "между"]
      ]
    }

});
