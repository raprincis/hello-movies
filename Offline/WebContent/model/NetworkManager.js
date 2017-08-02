sap.ui.define(["sap/ui/base/EventProvider"],
	function(EventProvider){
	"use strict"
	
	var oCustomEvent = {
		connectionChanged : "connectionChanged"	
	};
	
	var oNetworkManager = EventProvider.extend("com.raprins.ui5.offline.model.NetworkManager", {
		
		constructor : function(oData, bObserve){
			//Superclass constructor
			EventProvider.prototype.constructor.apply(this, arguments);
			this._initCustomEvent(oCustomEvent.connectionChanged);
		
			window.addEventListener("online", function(){
				this.fireEvent(oCustomEvent.connectionChanged, { status : 'onLine'});
			}.bind(this));
			
			window.addEventListener("offline", function(){
				this.fireEvent(oCustomEvent.connectionChanged, { status : 'offLine'});
			}.bind(this));
		
		},
		
		metadata : {
			publicMethods : ["attachConnectionChanged","detachConnectionChanged","isOnLine"]
		},
				
		_initCustomEvent : function(sEventName){
			if(! this.mEventRegistry[sEventName]){
				this.mEventRegistry[sEventName] = [];
			}
		}
		
	});
	
	oNetworkManager.prototype.attachConnectionChanged = function(oData, fnFunction, oListener){
		this.attachEvent(oCustomEvent.connectionChanged, oData, fnFunction, oListener)
		return this;
	};
	
	oNetworkManager.prototype.detachConnectionChanged = function(oData, fnFunction, oListener){
		this.attachEvent(oCustomEvent.connectionChanged, oData, fnFunction, oListener)
		return this;
	};
	
	oNetworkManager.prototype.isOnLine = function(){
		return navigator.onLine;
	};
	
	
	return oNetworkManager;
	
})