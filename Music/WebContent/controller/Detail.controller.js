sap.ui.define([
	"com/raprins/music/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (Controller,JSONModel) {
	"use strict";
	
	return Controller.extend("com.raprins.music.controller.Detail", {
		
		onInit : function(){
			
			this.getView().setModel(this.getMusicModel());
			this.getRouter().attachRouteMatched(this._onRouteMatched,this);
		},
		
		_onRouteMatched : function(oEvent){
			var oArguments = oEvent.getParameter("arguments");
			var iIndex = parseInt(oArguments.idMusic);
			
			var oDetailPage = this.getView().byId("idDetailPage");
			oDetailPage.bindElement("/results/" + iIndex );
			
		}
		
	});
})