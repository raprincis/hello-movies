sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"com/raprins/ui5/offline/model/JSONModel"
], function (Controller, History, JSONModel) {
	"use strict";
	return Controller.extend("com.raprins.ui5.offline.controller.BaseController", {
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		
		getModel : function(){
			
			if(!this.oModel){
				this.oModel = new JSONModel();
			}
			
			return this.oModel;
			
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
		}
	});
});