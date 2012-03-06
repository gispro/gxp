/* 
 * Tools file
 */


function indexOfInArr(arr, item, attrName){
	if( arr ){
		if(attrName){
			for(var i=0, il=arr.length; i<il; i++)
				if( (arr[i])[attrName]===item)
					return i;
		}else{
			for(var i=0, il=arr.length; i<il; i++)
				if( arr[i]===item)
					return i;
		}
	}
	return -1;
}

// поиск элемента в двумерном массиве
function indexOfInNxN(arr, findInd, value){
	for(var i in arr){
		if( (arr[i])[findInd]===value)
			return i;
	}
	return -1;
}

function arraySortByStringField(arr, fieldName1, fieldName2){
	arr.sort(function(f1, f2){
		var f1name = f1[fieldName1],
			f2name = f2[fieldName1];
		if(fieldName2){
			f1name = f1name[fieldName2],
			f2name = f2name[fieldName2];
		}

		return f1name > f2name
					  ? 1
					  : f1name < f2name
							? -1
							: 0;
	});
}

function getArrNames(obj){
	var names = new Array();
	for(var n in obj)
		names.push(n);
	return names;
}

function cloneObject(oNode, allFields){
	var oState, obj, i, il;
	if( !(oNode && oNode instanceof Object))
		return oNode;
	if( oNode instanceof Array){
		oState = new Array();
		for(i = 0, il = oNode.length; i<il; i++ ){
			obj = oNode[i];
			oState.push(obj instanceof Object
								? cloneObject(obj, allFields)
								: obj);
		}
	}
	else {
		oState = {};
		for (var n in oNode) {
			if( allFields || n.charAt(0) !== '_'){
				obj = oNode[n];

				oState[n]= obj instanceof Object
								? cloneObject(obj, allFields)
								: obj;
			}
		}
	}
	return oState;
}

function getWindowInnerSize() {
  var w = 0, h = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
	//Non-IE
	w = window.innerWidth;
	h = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
	//IE 6+ in 'standards compliant mode'
	w = document.documentElement.clientWidth;
	h = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
	//IE 4 compatible
	w = document.body.clientWidth;
	h = document.body.clientHeight;
  }
  return {width:w, height: h};
}

function firstChar2UpperCase(str){
	if( str && str.length>0){
		return str.charAt(0).toUpperCase()+str.substr(1);
	}
	return str;
}

function firstChar2LowerCase(str){
	if( str && str.length>0){
		return str.charAt(0).toLowerCase()+str.substr(1);
	}
	return str;
}

function trim(str){
	return str
			? str.replace(/^[\s]+|[\s]+$/g,'')
			: str;
}

function getObjectIndex(container, item){
	for(var i = 0, il = container.items.length;i < il; i++)
		if( container.getComponent(i)===item)
			return i;
	return -1;
}

function parseURLParams(url){
	var params=new Array();
	var str = url.replace(/^[^\?]*[\?]/,""), s, n, v;
	var arr = str.match(/[^=]*[=]+[^&]+/g);
	if( arr )
		for( var i = 0, il=arr.length; i<il; i++)
		{
			str=arr[i].replace(/[&]+/g, "").replace(/={2,}/g, "=");

			n=str.match(/^[^=]*(?=[=]+)/);
			n=n?n[0]:i;

			v=str.match(/[=][^=]*$/);
			v=v?v[0].substr(1):str;

			try{
				params[(n.length==0?i:n)]=decodeURIComponent(v);
			}
			catch(exc){
				doTrace.addMess("Ошибка декодирования параметра URL'a "+(n.length==0?i:n)+ ": "+exc);
			}
		}

	return params;
}

function debugObject(mess){
	this.mess=mess;
	//alert(mess);
}

function RoundArray(size){
	this.size=size;
	this.startInd=0;
	if( size <= 0 )
		throw 'Illegal RoundArray size'+size;
	this.arr=new Array();
}
RoundArray.prototype.push=function(obj){
	if( this.arr.length < this.size)
		this.arr.push(obj);
	else{
		this.arr[this.startInd%this.size]=obj;
		this.startInd++;
	}
}

RoundArray.prototype.getAt=function(ind){
	if( ind < 0 || ind >= this.arr.length)
		throw 'Array index Out Of Bounds: '+ind;
	ind += this.startInd;
	ind = ind%this.size;
	return this.arr[ind];
}

RoundArray.prototype.indexOf=function(obj){
	for(var i = 0, il= this.arr.length; i<il; i++ )
		if( this.arr[i] === obj)
			return (this.startInd+i)%this.size;
	return -1;
}

RoundArray.prototype.hasObj=function(obj){
	for(var i = 0, il= this.arr.length; i<il; i++ )
		if( this.arr[i] === obj)
			return true;
	return false;
}

RoundArray.prototype.clear=function(){
	this.arr = new Array();
	this.startInd=0;
}


// -------------------------------------- UNIQUE KEY STORE ----------------------------
var _UNIC_KEY=0;
var _UNIC_DATA= new Array();
var _UNIC_ID=0;
function getUnicID(){
	return _UNIC_ID++;
}
function getFreeUniqueKey()
{
	var i = _UNIC_KEY++;
	_UNIC_DATA[i]=null;
	return i;
}
function validUniqueKey(key){
	return key >=0 && key < _UNIC_DATA.length;
}
function registerUniqueObject(value){
	var key = getFreeUniqueKey();
	putByUniqueKey(key, value);
	return key;
}
function putByUniqueKey(key, value){
	if( validUniqueKey(key)){
		_UNIC_DATA[key]=value;
		return true;
	}
	else
		return false;
}
function getByUniqueKey(key){
	return validUniqueKey(key)
			? _UNIC_DATA[key]
		: null;
}

function clearByUniqueKey(key){
	if( validUniqueKey(key)){
		_UNIC_DATA[key]=null;
		return true;
	}
	else
		return false;
}

function getObjectFieldsInfo(obj){
	var s = '';
	if(!obj)
		return 'Empty Object';
	for(var n in obj.attributes){
		s+=''+n+': '+obj.attributes[n]+'\n';
	}
	return s;
}

function  fireEvent(element,event){
    if (document.createEventObject){
        // dispatch for IE
        var evt = document.createEventObject();
        return element.fireEvent('on'+event,evt)
    }
    else{
        // dispatch for firefox + others
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true ); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
}

function sendRequest(url, params){
var request;
if (window.XMLHttpRequest) {
        try {
            request = new XMLHttpRequest();
        } catch (e){}
    } else if (window.ActiveXObject) {
        try {
            request = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e){}
        try {
            request = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e){}
    }

    if (request) {
        request.onreadystatechange = function()
		{
		  try {
			// "complete"
			if (request.readyState == 4) {
				//"OK"
				if (request.status == 200)
				{
					var t = request.responseText;
					var p = 0;
				} else {
					var er = request.statusText + ": " + request.status;
					var p1=0;
				}
			}
		  }
		  catch( e ) {
			alert('Caught Exception: ' + e.description);
		  }
		}

		var reqbody;
		if( params ){
			for(var n in params ){
				if( reqbody )	reqbody += "&"+n+"="+params[n];
				else			reqbody = n+"="+params[n];
			}
		}
        request.open("GET", url, true);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded" );
        request.send(reqbody);
    }else{
    	if(e){
    		alert(e);
    	}
    }
}
/* Cинхронный вызов json описания ESRI сервиса,
 * контроль за последовательностью вызовов на разработчике
 */
var ESRIRequestInfo;
/*{url:
 * okCallback:
 * errCallback:
 * }
 */
function ESRICallbackContainer(json, ex){
	if( ESRIRequestInfo ){
		if( ex ){
			if( ESRIRequestInfo.errCallback )
				ESRIRequestInfo.errCallback.apply(window, [ex, json]);
			if(doTrace)
				doTrace.addMess('getESRIRefJSON error:'+ exc);
		}
		else {
			try {
				ESRIRequestInfo.okCallback.apply(window, [json]);
			}
			catch(exc){
				if( ESRIRequestInfo.errCallback )
					ESRIRequestInfo.errCallback.apply(window, ['Ошибка обработки ответа: '+exc, json]);
			if(doTrace)
				doTrace.addMess('getESRIRefJSON error, Ошибка обработки ответа:' + exc);
			}
		}
		ESRIRequestInfo = undefined;
	}
}
function ESRICallbackTimeout(key){
	if(ESRIRequestInfo && ESRIRequestInfo.key === key)
		ESRICallbackContainer(undefined, 'Время ожидания истекло');
}

function getESRIRefJSON(url, cb, err_cb){
	if( ESRIRequestInfo)
		window.setTimeout(function(){getESRIRefJSON(url, cb, err_cb);}, 2000);
	else{
		var key = getUnicID();
		ESRIRequestInfo={url:url, okCallback: cb, errCallback: err_cb, key:key};
		
		try {
			var aObj = new JSONscriptRequest(url, {f:"pjson",callback:"ESRICallbackContainer"});
			// Build the script tag
			aObj.buildScriptTag();
			// Execute (add) the script tag
			//	staticCallWithTimeout(serviceLegendTimeout, 20000, [obj.key]);
			aObj.addScriptTag();
		}
		catch( exc ){
			ESRICallbackContainer(undefined, 'Ошибка отправки запроса:' + exc);
		}
		window.setTimeout(function(){ESRICallbackTimeout(key);}, 20000);
	}
}

function JSONscriptRequest(fullUrl, params) {
  // REST request path
  this.fullUrl = fullUrl;
  // Keep IE from caching requests
  this.noCacheIE = 'noCacheIE=' + (new Date()).getTime();
  // Get the DOM location to put the script tag
  this.headLoc = document.getElementsByTagName("head").item(0);
  // Generate a unique script tag id
  this.scriptId = 'YJscriptId' + JSONscriptRequest.scriptCounter++;
  this.params=params;
}

// Static script ID counter
JSONscriptRequest.scriptCounter = 1;

// buildScriptTag method
JSONscriptRequest.prototype.buildScriptTag = function () {
  // Create the script tag
	this.scriptObj = document.createElement("script");

  // Add script object attributes
	this.scriptObj.setAttribute("type", "text/javascript");
	var sParams;
	if( this.params ){
		for(var n in this.params ){
			if( sParams )	sParams += "&"+n+"="+this.params[n];
			else			sParams = n+"="+this.params[n];
		}
		sParams +="&"+this.noCacheIE;
	}
	else
		sParams =this.noCacheIE;

	this.scriptObj.setAttribute("src", this.fullUrl+"?"+sParams);
	this.scriptObj.setAttribute("id", this.scriptId);
}

// removeScriptTag method
JSONscriptRequest.prototype.removeScriptTag = function () {
  // Destroy the script tag
  this.headLoc.removeChild(this.scriptObj);
}

// addScriptTag method
JSONscriptRequest.prototype.addScriptTag = function () {
  // Create the script tag
  this.headLoc.appendChild(this.scriptObj);
}

function staticCallWithTimeout(func, delay, args){
	return callWithTimeout(window, func, delay, args);
}
function callWithTimeout(owner, func, delay, args){
	owner = owner ? owner : window;
	var funccallback = createDirectStaticCall(owner, func, args);
	var t = window.setTimeout(funccallback, delay);
	return t;
}
function createDirectStaticCall(obj, method, args){
	return function() {
		return method.apply(obj || window, args);
	};
}
function createStaticCall(obj, method, args){
	return function() {
		var callArgs = Array.prototype.slice.call(arguments, 0);
		if(args) callArgs = callArgs.concat(args);
		return method.apply(obj || window, callArgs);
	};
}


function objectString(obj, name, offset, offset_step){
	var s = offset+name+':';
	if( obj === undefined)
		s +='\n'+offset+offset_step+'undefined';
	else if( obj === null)
		s +='\n'+offset+offset_step+'null';
	else
		for(var n in obj){
			if(!obj[n] || !Ext.isFunction(obj[n]))
				s+='\n'+offset+offset_step+n+':'+offset_step+obj[n];
		}
	return s;
}

// Общая функция копирования - копирует текст переменной maintext в clipboard, рабоает для IE и Firefox
function toSystemClipboard(text)
{
 text = String(text)
 if (window.clipboardData){
   try{ window.clipboardData.setData("Text", text);
	    return true;
    }
   catch(err) { return false  }
 }
 else if (window.netscape)
  {
   try{ netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		var gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].
		getService(Components.interfaces.nsIClipboardHelper);
		gClipboardHelper.copyString(text);
		return true;
    }
   catch(err) { return false  }
  }
 return false;
}
