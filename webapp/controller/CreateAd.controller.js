sap.ui.define([
	"com/chain/AltNews/controller/BaseController"
], function (Controller) {
	"use strict";

	return Controller.extend("com.chain.AltNews.controller.CreateAd", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.chain.AltNews.view.CreateAd
		 */
		onInit: function () {
			this.oModel = new sap.ui.model.json.JSONModel();

			this.setModel(this.oModel, "Advt");
			
			this.getRouter().getRoute("CreateAd").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function(){
	
			this.oModel.setProperty("/data", {
				title: "",
				description: "",
				user: this.getModel("appView").getProperty("/user/_id") || "GDOMUA44SHQ3IXYSYAKGP3IOR44PYBPCVLPNPW2BDQVYHJFTHVB4S2VX"
			});
			
			
		},
		makeForm: function (oPayload) {

			var oForm = new FormData();

			oForm.append("description", oPayload.description);
			oForm.append("title", oPayload.title);
			oForm.append("adImage", this.file);
			oForm.append("user", oPayload.user);

			return oForm;

		},
		
		onCreateAd: function(){
				var oPayload = this.oModel.getProperty("/data");
			
				var data = this.makeForm(oPayload);

				var settings = {
					url: "/AltNews/createAd",
					type: "POST",
					processData: false,
					"mimeType": "multipart/form-data",
					contentType: false,
			//		contentType: "multipart/form-data",
					data: data,
					success: function (data1) {

						this.showToast("MSG_SUCCESS_Ad");

					}.bind(this),
					error: function (err) {

					}.bind(this)

				};
				$.ajax(settings);
		},
		
		onUploadImage: function(oEvent){
			//debugger;
			if(oEvent.getParameter("files").length )
			{
				this.file = oEvent.getParameter("files")[0];
			}else
			{
				this.file = null;
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.chain.AltNews.view.CreateAd
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.chain.AltNews.view.CreateAd
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.chain.AltNews.view.CreateAd
		 */
		//	onExit: function() {
		//
		//	}

	});

});