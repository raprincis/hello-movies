sap.ui.define(["sap/ui/model/json/JSONModel"],
	function(JSONModel){
	"use strict"
	
	var oMyModel = JSONModel.extend("com.raprins.ui5.offline.model.JSONModel", {
		
		constructor : function(oData, bObserve){
			//Superclass constructor
			JSONModel.prototype.constructor.apply(this, arguments);
		},
		
		
		metadata : {
			
		}
		
	});
	
	
	return oMyModel;
	
})