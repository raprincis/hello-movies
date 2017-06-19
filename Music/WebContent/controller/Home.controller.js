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
			
			this.oModelMusics = new JSONModel();
			this.oModelMusics.attachRequestCompleted(this._onDataCompleted());
			
			this.oModelMusics.loadData("https://itunes.apple.com/search?term=a");
		},
		
		
		/**
		 * Fetch Data 
		 */
		_onDataCompleted : function(){
			
			this.getView().setModel(this.oModelMusics, "musics");
			
		}
	});
});