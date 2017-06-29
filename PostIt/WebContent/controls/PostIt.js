sap.ui.define([
   "sap/m/ListBase"
], function (ListBase) {
	"use strict";
	return ListBase.extend("com.raprins.custom.controls.controls.PostIt", {
		metadata : {
			properties : {
				title : {
					type : "string"
				},
				description : {
					type : "string"
				}
			}
		},
		
		init : function(){
			
		},
				
		renderer: {
			render : function(oRm, oControl){
				oRm.writeControlData(oControl);
			}
		}
	});
});