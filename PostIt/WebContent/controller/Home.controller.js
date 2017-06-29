sap.ui.define([
	"com/raprins/custom/controls/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/List",
	"sap/ui/thirdparty/jqueryui/jquery-ui-core",
	"sap/ui/thirdparty/jqueryui/jquery-ui-widget",
	"sap/ui/thirdparty/jqueryui/jquery-ui-mouse",
	"sap/ui/thirdparty/jqueryui/jquery-ui-draggable",
	"sap/ui/thirdparty/jqueryui/jquery-ui-droppable",
	"sap/ui/thirdparty/jqueryui/jquery-ui-sortable",
	"com/raprins/custom/controls/lib/TouchPunch"
], function (BaseController, JSONModel, List, Core, Widget, Mouse, Draggable, Droppable, Sortable, TouchPunch) {
	"use strict";
	return BaseController.extend("com.raprins.custom.controls.controller.Home", {
		onInit: function () {
			var oController = this;
			var oCustomModel = this.getOwnerComponent().getModel("northwind");
			oCustomModel.attachRequestCompleted(function(){
				
				var oToDo = [];
				var oDone = [];
				var oProgress = [];
				var oCustomData = oCustomModel.getData().list;
				for (var i = 0; i < oCustomData.length; i++) {
					if(oCustomData[i].status === 'toDo'){
						oToDo.push(oCustomData[i])
					}else if(oCustomData[i].status === 'Done'){
						oDone.push(oCustomData[i])
					}else if(oCustomData[i].status === 'onProgress'){
						oProgress.push(oCustomData[i])
					}
				}
				
				var oModelToDo = new JSONModel();
				oModelToDo.setData(oToDo);
				oController.getView().setModel(oModelToDo,"toDo");
								
				var oModelDone = new JSONModel();
				oModelDone.setData(oDone);
				oController.getView().setModel(oModelDone,"done");
				
				var oModelProgress = new JSONModel();
				oModelProgress.setData(oProgress);
				oController.getView().setModel(oModelProgress,"progress");
			
			}); 
			
			
			var sClassConnected = "connectedList";
			
			this._setSortable("idToDo", "toDo",sClassConnected);
			this._setSortable("idProgress", "progress", sClassConnected);
			this._setSortable("idDone", "done", sClassConnected);
			
			
		},
		
		
		_setSortable : function(sCustomId, sBindingName, sConnectedSortable){
			
			var oController = this;
			var oList, sListId, sUlListId, sConnectWith;
			
			oList 			= oController.getView().byId(sCustomId);
			sListId 		= oList.getId();
			sUlListId   	= "#" + sListId + "-listUl";
			sConnectWith 	= "." + sConnectedSortable;
			
			
			
			oList.onAfterRendering = function(){
				if(sap.m.List.prototype.onAfterRendering){
					sap.m.List.prototype.onAfterRendering.apply(this);
				}
								
				//JQuery Code
				$(sUlListId).addClass(sConnectedSortable);
				$(sUlListId).sortable({
					connectWith	: sConnectWith,
					opacity: 0.5,
					update : function(event, ui) {
						//console.log(ui);
						//console.log(event.type);
						var listElementId = ui.item.context.id;
						var draggedElement = sap.ui.getCore().byId(listElementId);
						
						
						
						
						
					}.bind(this), //Associate,
					receive : function(event, ui) {
						//console.log(ui);
						//console.log(event.type);
						var listElementId = ui.item.context.id;
						var draggedElement = sap.ui.getCore().byId(listElementId);
						
						var sTargetBinding = this.getBindingInfo('items').model;
						
						oCon
						
						
						
					}.bind(this) //Associate
				}).disableSelection();
			}
			
			
		}
		
		
		
	});
});
