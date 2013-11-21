// JavaScript Document

/*
        Gerekli framework jQuery 1.x
        Bu fonksiyonun çalışması için gerekli olan fonksiyonlar şunlardır;
        createSQLURL  && QueryXML --> bu yapı için oluşturuldu 
        
    Amaç Tek bir transaction,query le MII db siyle alış-verişi sağlayabilmek
  
    Öncede coşkunöz MII test sisteminde TEST projesinin altında ,TEST/PERSONEL_GETIR transaction ı ve içerisinde çağırılan
  TEST/Personel query si oluşturuldu,
    Örnek fonksiyon kullanımları;
    
*****************************    
    SELECT için;
    callDynamicSQL(
              "TEST/PERSONEL_GETIR",    // transaction
              {"TUR":"SELECT","Mode":"FixedQuery","QueryTemplate":"TEST/Personel"}, 
              {}, 
              {"TEZGAH":"metehan"}, // where koşulu burda belirleniyor
              "TEZGAH_DURUM",       // işlem yapacağınız tablo ismi
              "output")
******************************
    UPDATE için;
    callDynamicSQL(
              "TEST/PERSONEL_GETIR",    // transaction
              {"TUR":"UPDATE","Mode":"Command","QueryTemplate":"TEST/Personel"}, 
              {"URETIM_YERI":"1200","STATU":"ONAY"},  //update etmek istediğiniz alanlar 
              {"TEZGAH":"metehan"}, // where koşulu burda belirleniyor
              "TEZGAH_DURUM",       // işlem yapacağınız tablo ismi
              "output")
******************************
    DELETE için;
    callDynamicSQL(
              "TEST/PERSONEL_GETIR",    // transaction
              {"TUR":"DELETE","Mode":"Command","QueryTemplate":"TEST/Personel"}, 
              {},  
              {"TEZGAH":"metehan"}, // where koşulu burda belirleniyor
              "TEZGAH_DURUM",       // işlem yapacağınız tablo ismi
              "output")
******************************
    INSERT için;
    callDynamicSQL(
              "TEST/PERSONEL_GETIR",    // transaction
              {"TUR":"INSERT","Mode":"Command","QueryTemplate":"TEST/Personel"}, 
              {"URETIM_YERI":"1200","TEZGAH":"metehan","STATU":"SOKME"},  //hangi alanları eklemek istiyorsanız
              {}, 
              "TEZGAH_DURUM",       // işlem yapacağınız tablo ismi
              "output")
******************************
*/




var callDynamicSQL = function(transaction,input,query,condition,table,output){
	var url = createSQLURL(transaction,input,query,condition,table,output);
	var return_xml;
	$.get(url,function(data){ return_xml = data; },"xml");
	return return_xml;
}

var createSQLURL = function(transaction,input,query,condition,table,output){
	var origin = "http://"+window.location.host;
	var url = origin + "/XMII/Runner?Transaction=" + transaction;
	for(var a in input){ 
		if(a!="TUR"){
			url = url + "&" + a +"="+ encodeURIComponent(input[a]) ;
		} 
	}
	if( typeof output  != undefined ){
		url = url + "&OutputParameter=" + output ;
	}
	url = url +QueryXML(input,query,condition,table) 
	return url;
}
function QueryXML(input,query,condition,table) {
	var querystr=""
	if(input["Mode"]=="FixedQuery"){
		querystr="&Query="+encodeURIComponent("SELECT * FROM ")+table
		for(a in condition){
			if(querystr.split("WHERE")[1] == undefined){
				querystr = querystr + encodeURIComponent(" WHERE ") + a +"='"+ condition[a] +encodeURIComponent("'");
			}else{
				querystr = querystr + encodeURIComponent(" AND ") + a +"='"+ condition[a] +encodeURIComponent("'");
			}
		}
	}else if(input["Mode"]=="Command" && input["TUR"]=="INSERT"){
		querystr="&Query="+encodeURIComponent("INSERT INTO ")+table  +"("
		for(a in query){
			querystr = querystr  + a + "," ;
		}
		var length = querystr.length
		querystr = querystr.substr(0,length-1) + ")VALUES(" ;
		for(a in query){
			querystr = querystr + "'"+query[a] +"'," ;
		}
		length = querystr.length
		querystr =  querystr.substr(0,length-1) + encodeURIComponent(")");
	}else if(input["Mode"]=="Command" && input["TUR"]=="UPDATE"){
		querystr="&Query="+encodeURIComponent("UPDATE ")+table  +encodeURIComponent(" SET ")
		for(a in query){
			querystr = querystr + a +"='"+ query[a] +encodeURIComponent("'")+",";
		}	
		length = querystr.length;
		querystr =  querystr.substr(0,length-1) ;
		querystr +=  encodeURIComponent(" WHERE ") 
		for(a in condition){
			querystr = querystr + a +"='"+ condition[a] +encodeURIComponent("'")+encodeURIComponent(" AND ");
		}		
		length = querystr.length;
		querystr =  querystr.substr(0,length-6) ;
	}else if(input["Mode"]=="Command" && input["TUR"]=="DELETE"){
		querystr="&Query="+encodeURIComponent("DELETE FROM ")+table  
		querystr +=  encodeURIComponent(" WHERE ") 
		for(a in condition){
			querystr = querystr + a +"='"+ condition[a] +encodeURIComponent("'")+encodeURIComponent(" AND ");
		}		
		length = querystr.length;
		querystr =  querystr.substr(0,length-6) ;
	}
	return querystr ;
}
