sap.ui.define([
	"com/raprins/music/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (Controller,JSONModel) {
	"use strict";
	
	return Controller.extend("com.raprins.music.controller.Home", {
		/**
		 * Initialisation du Controller
		 */
		onInit: function () {
			
			//Get Default Config
			var oDefaultConfigData = this.getDefaultConfig().getData();
			
			//Declare Once : event handler
			this.getMusicModel().attachRequestCompleted(this._onDataCompleted());

			//Raise default search on initialisation			
			var oSearchField = this.getView().byId("idSearchField");
			oSearchField.setValue(oDefaultConfigData.searchTerm);
			oSearchField.fireSearch();
		},
		
		/**
		 * Navigation vers Detail
		 */
		navToMusicDetail : function(oEvent){
			
			//Remonter à l'envoyeur : ListItem
			var oEventSource = oEvent.getSource();
			var sPath = oEventSource.getBindingContext("musics").sPath;
			
			//Forme : '/results/{indexOf}'
			var indexMusic = sPath.substr(sPath.lastIndexOf("/") + 1);
			this.getRouter().navTo("detail", { idMusic : indexMusic } );
		},
		
		/**
		 * SearchMusic : Handle search field
		 */
		onSearchMusic : function(oEvent){
			
			var oSearchField = oEvent.getSource();
			this.getMusicModel().loadData(this._getPreparedRequest(oSearchField.getValue()));
		},
		
		/**
		 * 
		 */
		_onDataCompleted : function(){
			this.getView().setModel(this.getMusicModel(), "musics");
		},
		
		/**
		 * Préparer la requête
		 */
		_getPreparedRequest : function(sSearchTerm){
			if (sSearchTerm){
				return "https://itunes.apple.com/search?term=" + sSearchTerm +"&media=music&entity=song";
			}
		}
	});
});