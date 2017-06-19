sap.ui.define([
	"com/raprins/music/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (Controller,JSONModel) {
	"use strict";
	
	return Controller.extend("com.raprins.music.controller.Home", {
		/**
		 * Init
		 */
		onInit: function () {
			
			var oDefaultConfigData = this.getDefaultConfig().getData();
			this.oModelMusics = new JSONModel();
			this.oModelMusics.attachRequestCompleted(this._onDataCompleted());
			this.oModelMusics.loadData(this._getPreparedRequest(oDefaultConfigData.searchTerm));
		},
		
		
		/**
		 * Fetch Data 
		 */
		_onDataCompleted : function(){
			this.getView().setModel(this.oModelMusics, "musics");
		},
		
		
		_getPreparedRequest : function(sSearchTerm){
			
			if (sSearchTerm){
				return "https://itunes.apple.com/search?term=" + sSearchTerm +"&media=music&entity=song";
			}
		}
	});
});