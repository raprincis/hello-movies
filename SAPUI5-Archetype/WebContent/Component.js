/* global _:true */ //Define Lodash underscore globally 
sap.ui.define([
   "sap/ui/core/UIComponent",
   "com/raprins/archetype/libraries/lodash"
], function (UIComponent, _) {
   "use strict";
   return UIComponent.extend("com.raprins.archetype.Component", {
	   
	    metadata : {
           manifest: "json"
	   },
	   
	   init: function () {
		   
           UIComponent.prototype.init.apply(this, arguments);
           this.getRouter().initialize();
       }
   });
});