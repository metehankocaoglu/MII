function getUrlVars() {
    var vars = {};
    vars["ID"] = "";
    var parts = window.top.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function createXMLDocument(string){
	var browserName = navigator.appName;
	var doc;
	if (browserName == 'Microsoft Internet Explorer'){
		doc = new ActiveXObject('Microsoft.XMLDOM');
		doc.async = 'false'
		doc.loadXML(string);
	} else {
		doc = (new DOMParser()).parseFromString(string, 'text/xml');
	}
	return doc;
}

function validateXML(xmlString) {
        try {
            if (document.implementation.createDocument) {
                var parser = new DOMParser();
                myDocument = parser.parseFromString(xmlString, "text/xml");
            } else if (window.ActiveXObject) {
                myDocument = new ActiveXObject("Microsoft.XMLDOM")
                myDocument.async = "false";
                myDocument.loadXML(xmlString);
            }
        } catch(e) {
	return false
        }
	if (myDocument.xml == ""){
		prompt("Hatalı XML" , xmlString);
		return false
	}else{
		return true
	}
    }
var createIlluminatorSQL = function(queryTemplate,input){
	var origin = "http://"+window.location.host;
	var url = origin + "/XMII/Illuminator?QueryTemplate=" + queryTemplate;

	for(a in input){ 
		url = url + "&" + a +"="+ encodeURIComponent(input[a]) ;
	 }
	
	url = url + "&Content-Type=text%2Fxml";

	return url;
}
 function createRunnerURL(transaction,input,output){
	var origin = "http://"+window.location.host;
	var url = origin + "/XMII/Runner?Transaction=" + transaction;
	for(a in input){ 
		if (input != "" && input[a] !=undefined){
			var b = input[a]
			var c = b.search(">");
			if ( c >= 0){
				if (validateXML(input[a]) == false){
					return "";
				}
			}
		}
		url = url + "&" + a +"="+ encodeURIComponent(input[a]);
	 }

	if( typeof output  != undefined ){
		url = url + "&OutputParameter=" + output ;
	}
	return url;
}
var callRunnerURL = function(transaction,input,output){
	var url = createRunnerURL(transaction,input,output);
	var return_xml;
	$.get(url,function(data){ return_xml = data; },"xml");
	return return_xml;
}
var callSQL = function(queryTemplate,input){
	var url = createIlluminatorSQL(queryTemplate,input);
	var return_xml;
	$.get(url,function(data){ return_xml = data; },"xml");
	return return_xml;
}
var callSQLFromURL = function(queryTemplate,src){
	var url = createIlluminatorURL(queryTemplate,src);
	var return_xml;
	$.get(url,function(data){ return_xml = data; },"xml");
	return return_xml;
}
var isError = function(xmlObj){
	if( $("error",xmlObj).text() == "" || $("error",xmlObj).text() == "---" ){
		return false;
	}else{
		return true;
	}
}
var getError = function(xmlObj){
	if( $("error",xmlObj).text() == "" || $("error",xmlObj).text() == "---" ){
		return "";
	}else{
		return $("error",xmlObj).text()
	}
}
function CallPostURL(transaction,input,output,bool_async,method){
	bool_async	= bool_async ? bool_async : false;
//	method		= method ? method : "GET";
	method		= method ? method : "POST";
	var return_xml;
	for(a in input){ 
		if (input != "" && input[a] !=undefined){
			var b = input[a]
			var c = b.search(">");
			if ( c >= 0){
				if (validateXML(input[a]) == false){
					return "";
				}
			}
		}
	 }
	if( input ){
		input["outputParameter"] = output;
	}
	
//	var origin	=	host;
	var origin = "http://"+window.location.host;
	var url		= origin + "/XMII/Runner?Transaction=" + transaction;
	
	
	$.ajax({
		async	: bool_async,
		type	: method.toUpperCase(),
	  	url		: url,
		data	: input,
	  	dataType: "xml"
	}).done(function(msg){
		return_xml = msg;
	});
	return return_xml;
}

function ConversionAlphaInput(data,size){
	if(data != "" && typeof data != "undefined"){
		return PadDigits(data,size);
	}else{
		return "";
	}
}
function PadDigits(n, totalDigits) 
{ 
	n = n.toString(); 
	var pd = ''; 
	if (totalDigits > n.length) 
	{ 
		for (i=0; i < (totalDigits-n.length); i++) 
		{ 
			pd += '0'; 
		} 
	} 
	return pd + n.toString(); 
} 
function JavaTarih2SapSaat(tarih){
		var hours="00";
		var minutes="00";
		var seconds="00";
		hours = tarih.getHours()+""
		minutes = tarih.getMinutes()+""
//		seconds = tarih.getSeconds()
		sapsaat = ConversionAlphaInput(hours,2)+""+ConversionAlphaInput(minutes,2)+""+ConversionAlphaInput(seconds,2)
		return sapsaat
}
function JavaTarih2SapTarih(tarih){
		var year ="0000"
		var month = "00"
		var day = "00"
		year = tarih.getFullYear()
		month = tarih.getMonth()+1
		day = tarih.getDate()
		saptarih = ConversionAlphaInput(year,4)+""+ConversionAlphaInput(month,2)+""+ConversionAlphaInput(day,2)
		return saptarih
}

function xmlToString(xmlData) { 

    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}
function convertDateToSAP(date){
	var year 	= parseFloat(date.substr(6,4));
	var month	= parseFloat(date.substr(3,2)) - 1;
	var day		= parseFloat(date.substr(0,2));
	return new Date(year,month,day).format("yyyy-MM-dd");
}
var TableList = function(tableElem,tablePlacement,xml,emptyList){
	emptyList = emptyList == null?true:emptyList;
	if( emptyList ){
		$(tableElem).dataTable().fnClearTable();
	}
	$("item",xml).each(function(a,b){
		var rowArray = new Array();
		for( a in tablePlacement ){
			if( a.substr(0,4) != "html" && a.substr(0,4) != "code" && a.substr(0,16) != "code_html_append"){
				rowArray.push($(a,b).text() );
			}else if(a.substr(0,16) == "code_html_append"){
				rowArray.push( eval( replaceString(tablePlacement[a],b) )[0].outerHTML );
			}else if(a.substr(0,4) == "html"){
				rowArray.push( findFunctionFromStringAndEvalueate( replaceString(tablePlacement[a],b) ) );
			}else if( a.substr(0,4) == "code"){
				rowArray.push( eval( replaceString(tablePlacement[a],b) ) );
			}
		}
		$(tableElem).dataTable().fnAddData(rowArray);
	});
}
function TableList(tableElem,tablePlacement,xml,loopLine,emptyList){
	//	loopLine alabileceği değerler: item ya da Row olmalı
	emptyList = emptyList == null?true:emptyList;
	var groupObj = new Object();
	if( emptyList ){
		$("tbody tr",tableElem).remove();
	}
	$(loopLine,xml).each(function(a,b){
		if( a % 2 ){
			var className = "even";
		}else{
			var className = "odd";
		}
		var rowArray = $("<tr>").addClass(className);
		for(var c in tablePlacement ){
			if( c.substr(0,4) != "html" && c.substr(0,4) != "code" && c.substr(0,16) != "code_html_append" && c.substr(0,5) != "group"){
				rowArray.append($("<td>").html($(c,b).text()));
			}else if(c.substr(0,16) == "code_html_append"){
				rowArray.append($("<td>").html($( eval( replaceString(tablePlacement[c],b) )[0].outerHTML) ) ) ;
			}else if(c.substr(0,4) == "html"){
				rowArray.append($("<td>").html( findFunctionFromStringAndEvalueate(replaceString(tablePlacement[c],b) ) ) );
			}else if( c.substr(0,4) == "code"){
				rowArray.append($("<td>").html( eval( replaceString(tablePlacement[c],b) ) ) );
			}else if( c.substr(0,5) == "group"){
				groupObj[replaceString(tablePlacement[c],b)] = "";
			}
		}
		$(tableElem).append(rowArray);
	});
	if( groupObj ){
		for( var a in groupObj){
			$("input[type=checkbox]." + a + ":not(:first())").remove();
		}
	}
}
function findFunctionFromStringAndEvalueate(text){
	var retText = "";
	retText = text;
	var resAry = text.split("#");
	for( var a in resAry ){
		
		var functionName = resAry[a].substr(0,resAry[a].indexOf("("));
		
		if( typeof window[functionName] == "function" ){
			resAry[a] = eval(resAry[a]);
		}
	}
	for( var b in resAry){
		if( b == 0 ){
			retText = "";
		}
		retText = retText + resAry[b];
	}
	return retText;
}
var isBrowser =  {
	IE : function(){
		return navigator.userAgent.search("MSIE")>0?true:false;
	},
	Chrome : function(){
		return navigator.userAgent.search("Chrome")>0?true:false;
	}
}

function selectNone(TableObj){
	$("tbody tr td input[type=checkbox]",$(TableObj)).attr("checked",false);
}
function selectAll(TableObj){
	$("tbody tr td input[type=checkbox]",$(TableObj)).attr("checked",true);
}
function removeSelection(TableObj){
	$("tbody tr td input[type=checkbox]:checked",$(TableObj)).parent().parent().remove();
}
function removeAll(TableObj){
	$("tbody tr",$(TableObj)).remove();
}
function inverseSelection(TableObj){
	$("tbody tr td input[type=checkbox]",$(TableObj)).click()
}
function conversionMaterialInput(matnr){
	if(matnr != "" && typeof matnr != "undefined"){
		return PadDigits(matnr,18);
	}else{
		return "";


	}
}
function conversionMaterialOutput(matnr){
	if(matnr != "" && typeof matnr != "undefined"){
		return isNaN(parseFloat(matnr.toString()))?matnr.toString():parseFloat(matnr.toString()).toString();
	}else{
		return "";
	}
}
function conversionQuantityInput(miktar){
	if(typeof miktar != "undefined"){
		if (miktar != "" ){
			miktar = miktar.toString().replace(/[.]+/gi,"");
			miktar = miktar.toString().replace(/[,]+/gi,".");
			return roundNumber(parseFloat(miktar),3);
		}else{

			return 0;
		}
	}
}
function conversionQuantityOutput(miktar){
	miktar = roundNumber(parseFloat(miktar),3);
	if(typeof miktar != "undefined"){
		miktar = miktar.toString().replace(/[,]*/gi,"");
		miktar = miktar.toString().replace(/[.]+/gi,",");
		var str_miktar	= "";
		var period_plc	= miktar.search(",");
		var left_dec	= miktar.substring(0,period_plc);
		left_dec		= left_dec==""?miktar.toString():left_dec;
		var sign = left_dec.substring(0,1) == "-"?"-":"";
		left_dec = left_dec.substring(0,1) == "-"?left_dec.substring(1):left_dec;
		if( period_plc != -1 ){
			var right_dec	= miktar.substring(period_plc,miktar.length);
		}else{
			var right_dec	= "";
		}
		var left_ary	= left_dec.split("");
		for( var i = 0; i < left_ary.length; i++ ){
			if( ((i+1) % 3) == 1 && i > 0 ){
				str_miktar = left_ary[left_ary.length - (1 + i)] + "." + str_miktar;
			}else{
				str_miktar = left_ary[left_ary.length - (1 + i)] + str_miktar;
			}
			
		}
		miktar = str_miktar+right_dec;
		return sign+miktar;
	} return "0";
}
function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}
function convertDateToMII(date){
  var year = parseFloat(date.substr(0,4))
var month = parseFloat(date.substr(5,2))-1
var day = parseFloat(date.substr(8,2))
	return new Date(year,month,day).format("dd.MM.yyyy");
}

function check_digit(e,obj,intsize,deczize)
{

    var keycode;

    if (window.event) keycode = window.event.keyCode;
    else if (e) keycode = e.which;
    else return true; 
  var fieldval= (obj.value);
var dots = fieldval.split(".").length;

if(keycode == 46)
    {
if(dots > 1){

return false;
}else{

return true;
}
    }
    if(keycode == 8 || keycode == 9 || keycode == 46 || keycode == 13 ) // back space, tab, delete, enter 
    {
        return true;
    }          
    if((keycode>=32 && keycode <=45) || keycode==47   || (keycode>=58 && keycode<=400))
    {
         return false;
    }


//alert(jQuery(fieldval:contains('.').length));




 if(fieldval == "0" && keycode == 48 )
   return false;
   //alert(fieldval.indexOf(".") + ' - '+ fieldval.length);
 if(fieldval.indexOf(".") != -1)
  { 
  if(keycode == 46)
   return false;
   var splitfield = fieldval.split(".");


   //alert('Spilt -> '+ splitfield[1].length);
   if(splitfield[1].length >= deczize && keycode != 8 && keycode != 0 )
   return false;
  }
  else if(fieldval.length >= intsize && keycode != 46)
  {
    return false;
  } 
  else return true;   
}

function numberFormatter ( num, places, ksep, dsep ) {
	var rounder = function( n, places ) {
		n2 = parseFloat(n);
		if( isNaN(n2) ) return n;
		places = parseInt(places);
		if( isNaN(places) ) places = 0;
		var factor= Math.pow(10,places);
		return Math.floor(n*factor+((n*factor*10)%10>=5?1:0))/factor;
	};
	var num = rounder( num, places );
	if ( isNaN( num ) ) return num;
	if ( 'undefined' == typeof places ) places = 0;
	if ( 'undefined' == typeof ksep ) ksep = ',';
	if ( 'undefined' == typeof dsep ) dsep = '.';
	num = num.toString();
	if ( places > 0 ) {
		var dot = num.indexOf( '.' );
		var rlength = num.substr( dot ).length - 1;
		if ( -1 == dot ) {
			num = num + '.';
			for ( var i = 0; i < places; i++ ) {
				num = num + '0';
			}
		}
		else if ( places > rlength ) {
			var diff = places - rlength;
			for ( var i = 0; i < diff; i++ ) {
				num = num + '0';
			}
		}
	}

	var l = '', m = '', r = '';
	num.replace( /^([0-9]*)?(\.)?([0-9]*)?$/, function( $0, $1, $2, $3 ) {
		var llen = $1.length;
		if ( llen > 3 ) {
			for ( var i = llen - 1; i >= 0; i-- ) {
				var x = i - llen + 1;
				if ( x != 0 && x % 3 == 0 ) l = ksep + l;
				l = $1[i] + l;
			}
		}
		else {
			l = $1;
		}
		if ( $2 == '.' && ! isNaN( $3 ) ) {
			m = dsep;
			r = $3;
		}
	});
	return l + m + r;
}
