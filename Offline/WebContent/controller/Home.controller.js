sap.ui.define([
	"com/raprins/ui5/offline/controller/BaseController",
	"sap/m/Dialog",
	"sap/m/MessageToast"
], function (BaseController, Dialog, MessageToast) {
	"use strict";
	return BaseController.extend("com.raprins.ui5.offline.controller.Home", {
		onInit: function () {
			this.getModel().loadData("/sap/bc/rest/personnes?sap-client=100");
			this.oPersonModel = new sap.ui.model.json.JSONModel();
			this.getModel().attachDataChanged(this._onDataChanged.bind(this));//attachErrorRaised
			this.getModel().attachErrorRaised(this._onErrorRaised.bind(this));//
			this.getView().setModel(this.getModel(),"personnes");
			
		},
		
		onAddPersonne : function(oEvent){
			this.oPersonModel.setData({});
			var oPersonFormDialog = this._getPersonForm();
			oPersonFormDialog.setModel(this.oPersonModel,"personForm");
			oPersonFormDialog.open();
		
		},
		
		_onErrorRaised : function(oEvent){
			
			MessageToast.show("Erreur de Je ne sais pas quoi");
			
			
		},
		
		_onDataChanged : function(oEvent){
			
			this._getPersonForm().setModel(null,"personForm");
			this._getPersonForm().close();
			
		},
		
		_getPersonForm : function(){
			
			if(!this._oPersonForm){
				this._oPersonForm = sap.ui.xmlfragment("com.raprins.ui5.offline.view.PersonForm", this);
				this.getView().addDependent(this._oPersonForm);
			}
			
			return this._oPersonForm;
		},
		
		onSavePersonne : function(oEvent){
			var oModel = oEvent.getSource().getModel("personForm");
			this.getModel().addData(oModel.getData());
			
		},
		
		onClosePersonForm : function(){
			this._getPersonForm().close();
		}
		
	
	
	});
});
