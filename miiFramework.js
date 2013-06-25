// JavaScript Document
/*
	Gerekli framework jQuery 1.x
	Bu fonksiyonun çalışması için gerekli olan fonksiyonlar şunlardır;
	callRunnerURL 
	
	Kullanım şekli;

	var a = callDynamicRFC(<rfc_name>, <inputObject>)
	
	<rfc_name>		: EIS tarafta çağırılacak fonksiyonun adı
	<inputObject>	: RFC Fonksiyonunun input değeri Ör. {werks: 1250, lgort: 4501};
	
	var a = new callDynamicRFC("ZKBCF_TRSF_KY_DP_RFC",{iv_uy: "1250"});

	a.getRequest()	-> Sonuç üretilirken fonksiyona gönderilen parametreyi text biçiminde gösterir.
	a.getInput()	-> Sonuç üretilirken fonksiyona gönderilen parametreyi nesne biçiminde gösterir.
	a.xml			-> Fonksiyonun sonucunun XML verisi olarak almak için kullanılır.




*/
var dynTranURL = "KucukBas/HayvanStatuDegistir/dynamicFunctionCall";
var callDynamicRFC = function(fn,inp){
	var url				= dynTranURL;
	this.functionName	= fn;
	var request			= "";
	
	var startTag = function( a ){
		return "<" + a.toUpperCase() + ">";
	}
	var endTag = function( a ){
		return  "</" + a.toUpperCase() + ">";
	}
	this.setInput = function(a){
		input = a;
	}
	this.getInput = function(){
		return input;
	}
	var inputWizard = function(inp){
		var funcName = fn;
		
		var funcXML		= startTag(funcName);
		var funcInput		= startTag("input");
		var funcInputEnd	= endTag("input");
		var funcXMLEnd 	= endTag(funcName);
		var inputValXML		= "";
		for( var a in inp ){
			inputValXML = inputValXML + startTag(a) + inp[a] + endTag(a);
		}
		
		var xml = funcXML + funcInput + inputValXML + funcInputEnd + funcXMLEnd
		return xml;
	}
	var run = function(){
		var input = {	functionName : fn,
						request : inputWizard(inp) }
		var xml = callRunnerURL(url,input,"output");
		return xml;
		
	}
	this.getRequest = function(){
		return request;
	}

	request = inputWizard(inp);
	this.xml = run();
	
}