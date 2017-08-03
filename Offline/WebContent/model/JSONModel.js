jQuery.sap.require("jquery.sap.storage");
sap.ui.define(["sap/ui/model/json/JSONModel",
               "./NetworkManager"],
	function(JSONModel, NetworkManager, Storage){
	"use strict"
	
	/**
	 * Custom events
	 */
	var oCustomEvent = {
			dataChanged : {
				name : "dataChanged",
				status : {
					added 	: "added",
					updated : "updated",
					deleted : "deleted",
					synchronise : 'sync'
				}
			},
			errorRaised : {
				name : 'errorRaised'
			}
		};
	
	/**
	 * Request parameters
	 */
	var oRequest = {
			url : '/sap/bc/rest/personnes?sap-client=100',
			token : {
				name : 'X-CSRF-Token',
				value : 'Fetch'
			}
	}
	
	
	
	
	var oMyModel = JSONModel.extend("com.raprins.ui5.offline.model.JSONModel", {
		
		constructor : function(oData, bObserve){
			// Superclass constructor
			JSONModel.prototype.constructor.apply(this, arguments);
			
			this._initCustomEvent(oCustomEvent.dataChanged.name);	
			this._initCustomEvent(oCustomEvent.errorRaised.name);	
			this.oNetworkManager = new NetworkManager();
			this.oLocalStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			this._token = null;
			
			// Handle my Event
			this.attachDataChanged(this._onDataChanged.bind(this));
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
		
		_onConnectionChanged : function(oEvent){
			// Get Data and Populate Local DB
			var sStatus = oEvent.getParameter("status");
			if( sStatus === 'offLine'){
				this.oLocalStorage.put('oPersonnes', this.getData());
			}else{
				
				var that = this;
				//Wait for 2 seconds : Time to take a coffee before doin something else
				setTimeout(function(){
					that._synchronise();
				}, 2000);
				
			}			
		}
		
		
	});
	
	
	
	
	oMyModel.prototype._onDataChanged = function(oEvent){
		var sOperation = oEvent.getParameter('status');
		// Refresh the Model
		this.refresh(); 
	
	};
	
	/**
	 * Retrieve Token on Back End
	 * 
	 * @return Promise
	 */
	oMyModel.prototype._getToken = function(){
		return new Promise(function(resolve,reject){
			$.ajax({
				url : '/sap/bc/rest/personnes?sap-client=100',
				type : 'GET',
				beforeSend : function(xhr){ 
					xhr.setRequestHeader('X-CSRF-Token','Fetch')
				},
				success : function(data, status, xhr){
					resolve(xhr.getResponseHeader('X-CSRF-Token'));
				},
				error : function(xhr, status, error){
					reject(error);
				}
			})
			
		});
	};
	
	/**
	 * Making a POST Call
	 */
	oMyModel.prototype._post = function(oData){
		var sToken = this._token;
		return new Promise(function(resolve,reject){
			$.ajax({
				url : '/sap/bc/rest/personnes?sap-client=100',
				type : 'POST',
				data : JSON.stringify(oData),
				beforeSend : function(xhr){ 
					xhr.setRequestHeader('X-CSRF-Token',sToken);
					xhr.setRequestHeader('Content-Type','application/json');
					xhr.setRequestHeader('Accept','application/json');
				},
				success : function(data, status, xhr){
					resolve(data);
				},
				error : function(xhr, status, error){
					reject(error);
				}
			})
		});
	};
	
	
	oMyModel.prototype._synchronise = function(){
		var aPromises = [];
		var that = this;
		
		return new Promise(function(resolve,reject){
			var oListPersonne = that.oLocalStorage.get('oPersonnes');
			var bAtLeastOne;
			
					that._getToken()
					.then(function(token){
						that._token = token;  
						
						$.each(oListPersonne, function(index, oData){
							
							if(!oData.id){
								aPromises.push(that._post(oData));
								if(!bAtLeastOne){
									bAtLeastOne = true;
								}
							}
						})
						
						if(bAtLeastOne){
							return Promise.all(aPromises);
						}else{
							return Promise.reject('No data to Synchronise');
						}
						
						
					}).then(function(data){
						
						that.attachEventOnce('requestCompleted',function(){
							that.fireEvent(oCustomEvent.dataChanged.name, { status : oCustomEvent.dataChanged.status.synchronise });
						})
						
						that.loadData("/sap/bc/rest/personnes?sap-client=100");
						
					}).catch(function(error){
						that.fireEvent(oCustomEvent.errorRaised.name, { type : 'synchronise', error : error })
					});
					
			
		});
				
		
		
		
	};
	
	/**
	 * Adding Data
	 * 
	 * @param {Object}
	 *            oData : Data to add
	 */
	oMyModel.prototype.addData = function(oData){
		
		var that = this;
		if(this.oNetworkManager.isOnLine()){
			
			
			that._getToken()
			.then(function(token){
				that._token = token;  
				return that._post(oData)
			}).then(function(data){
				
				 that.getData().push(data);
				 that.fireEvent(oCustomEvent.dataChanged.name, { status : oCustomEvent.dataChanged.status.added, data : data });
				
			}).catch(function(error){
				that.fireEvent(oCustomEvent.errorRaised.name, { type : 'add', error : error })
			});
			
		}else{
			
			that.getData().push(oData);
			this.oLocalStorage.put('oPersonnes', this.getData());
			that.fireEvent(oCustomEvent.dataChanged.name, { status : oCustomEvent.dataChanged.status.added, data : oData });
		}
		
	};
	
	oMyModel.prototype.attachDataChanged = function(oData, fnFunction, oListener){
		this.attachEvent(oCustomEvent.dataChanged.name, oData, fnFunction, oListener)
		return this;
	};
	
	oMyModel.prototype.detachDataChanged = function(oData, fnFunction, oListener){
		this.detachEvent(oCustomEvent.dataChanged.name, oData, fnFunction, oListener)
		return this;
	};
	
	oMyModel.prototype.attachErrorRaised = function(oData, fnFunction, oListener){
		this.attachEvent(oCustomEvent.errorRaised.name, oData, fnFunction, oListener)
		return this;
	};
	
	oMyModel.prototype.detachErrorRaised = function(oData, fnFunction, oListener){
		this.detachEvent(oCustomEvent.errorRaised.name, oData, fnFunction, oListener)
		return this;
	};
	
	return oMyModel;
	
})