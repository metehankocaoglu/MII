// Tarih  fonksiyonlarının çalışması için Date.js scriptinin çağırılmış olması gerekir.

function convertDateToMII(date){
  var year = parseFloat(date.substr(0,4))
  var month = parseFloat(date.substr(5,2))-1
  var day = parseFloat(date.substr(8,2))
	return new Date(year,month,day).format("dd.MM.yyyy");
}
function convertDateToSAP(date){
	var year 	= parseFloat(date.substr(6,4));
	var month	= parseFloat(date.substr(3,2)) - 1;
	var day		= parseFloat(date.substr(0,2));
	return new Date(year,month,day).format("yyyy-MM-dd");
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
function getUrlVars() {
    var vars = {};
    vars["ID"] = "";
    var parts = window.top.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
