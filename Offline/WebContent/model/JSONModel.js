
jQuery.sap.require("jquery.sap.storage");
sap.ui.define(["sap/ui/model/json/JSONModel",
               "./NetworkManager"],
	function(JSONModel, NetworkManager, Storage){
	"use strict"
	
	var oCustomEvent = {
			dataChanged : {
				name : "dataChanged",
				status : {
					added 	: "added",
					updated : "updated",
					deleted : "deleted",
				}
			}	
		};
	
	var oMyModel = JSONModel.extend("com.raprins.ui5.offline.model.JSONModel", {
		
		constructor : function(oData, bObserve){
						
			//Superclass constructor
			JSONModel.prototype.constructor.apply(this, arguments);
			this._initCustomEvent(oCustomEvent.dataChanged.name);			
			this.oNetworkManager = new NetworkManager();
			this.oLocalStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			
			
			//Handle my Event
			this.attachDataChanged(this._onDataChanged);
			this.oNetworkManager.attachConnectionChanged(this._onConnectionChanged.bind(this));
			
		},
		
		metadata : {
			publicMethods : ["addData","attachDataChanged","detachDataChanged"]
		},
				
		_initCustomEvent : function(sEventName){
			if(! this.mEventRegistry[sEventName]){
				this.mEventRegistry[sEventName] = [];
			}
		},
		
		
		_onDataChanged : function(){
			this.refresh();
		},
		
		_onConnectionChanged : function(oEvent){
			//Get Data and Populate Local DB
			var sStatus = oEvent.getParameter("status");
			if( sStatus === 'offLine'){
				this.oLocalStorage.put("oPersonnes", this.getData());
			}else{
				
			}			
		}
		
		
	});
	
	oMyModel.prototype.addData = function(oData){
		this.getData().push(oData);
		this.fireEvent(oCustomEvent.dataChanged.name, { status : oCustomEvent.dataChanged.status.added });
	};
	
	oMyModel.prototype.attachDataChanged = function(oData, fnFunction, oListener){
		this.attachEvent(oCustomEvent.dataChanged.name, oData, fnFunction, oListener)
		return this;
	};
	
	oMyModel.prototype.detachDataChanged = function(oData, fnFunction, oListener){
		this.attachEvent(oCustomEvent.dataChanged.name, oData, fnFunction, oListener)
		return this;
	};
	
	
	return oMyModel;
	
})