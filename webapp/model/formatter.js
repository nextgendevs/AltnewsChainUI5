sap.ui.define([], function () {
	"use strict";

	return {

		giveAccount : function(sText, sType){
			
			return sText ?  sType + " - " +  sText : "";
		}
	
	
	};

});