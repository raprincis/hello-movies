sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";
	
	//Load Once
	var oModel = new sap.ui.model.json.JSONModel();
	
	return Controller.extend("com.raprins.music.controller.BaseController", {
		/**
		 * getRouter 
		 */
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		
		/**
		 * Retour de navigation
		 */
		onNavigationBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("home", {}, true);
			}
		},
		
		
		getDefaultConfig : function() {
			
			return this.getOwnerComponent().getModel("defaultConfig");
			
		},
		
		
		getMusicModel : function(){
			return oModel;
		}
	});
});