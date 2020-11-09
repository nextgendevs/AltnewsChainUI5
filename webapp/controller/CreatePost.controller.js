sap.ui.define([
	"com/chain/AltNews/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.chain.AltNews.controller.CreatePost", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.chain.AltNews.view.CreatePost
		 */
		onInit: function () {
			this.oModel = new sap.ui.model.json.JSONModel();

			this.setModel(this.oModel, "Post");

			this.getRouter().getRoute("CreatePost").attachPatternMatched(this._onObjectMatched, this);

		},
		_onObjectMatched: function () {
			this.oModel.setProperty("/data", {
				post: "",
				title: "",
				short: "",
				user: this.getModel("appView").getProperty("/user/_id") || "GDOMUA44SHQ3IXYSYAKGP3IOR44PYBPCVLPNPW2BDQVYHJFTHVB4S2VX",
				status: "p",
				Ad: ""
			});

			this.loadClaimables();

		},

		onClaimables: function (oEvent) {

			//https://ipfs.fleek.co/ipfs/
			var sHash = oEvent.getSource().getSelectedItem().getBindingContext("Post").getProperty("Ad/hash"),
				sUrl = this.getResourceBundle().getText("IPFS_Txt") + sHash;

			var sImagetag = "<img width='500px' height='250px' src='" + sUrl + "' >";

			var sPost = this.oModel.getProperty("/data/post") + sImagetag;

			this.oModel.setProperty("/data/post", sPost);
			this.oModel.setProperty("/data/Ad", oEvent.getSource().getSelectedItem().getBindingContext("Post").getProperty("_id"));

		},
		loadClaimables: function () {

			var settings = {
				url: "/AltNews/getClaimableAds",
				type: "GET",
				data: {
					CryptoAddress: this.getModel("appView").getProperty("/User/cryptoaddress") ||
						"GDOMUA44SHQ3IXYSYAKGP3IOR44PYBPCVLPNPW2BDQVYHJFTHVB4S2VX",
					status: "c"
				},
				success: function (data) {

					this.oModel.setProperty("/aClaimables", data);

				}.bind(this),
				error: function (err) {

				}.bind(this)

			};
			$.ajax(settings);

		},
		onCancel: function () {
			this.getRouter().navTo("Dashboard");
		},
		makeForm: function (oPayload) {

			var oForm = new FormData();

			oForm.append("status", "p");
			oForm.append("post", oPayload.post);
			oForm.append("title", oPayload.title);
			oForm.append("user", oPayload.user);
			oForm.append("Ad", oPayload.Ad);
			oForm.append("short", oPayload.short);

			return oForm;

		},
		onPublish: function () {
				var oPayload = this.oModel.getProperty("/data");
			
				var data = this.makeForm(oPayload);

				var settings = {
					url: "/AltNews/post",
					type: "POST",
					processData: false,
				//	timeout: 0,
				//	mimeType: "multipart/form-data",
				//	contentType: "multipart/form-data",
					data: data,
					success: function (data1) {

						this.showToast("MSG_SUCCESS_POST");

					}.bind(this),
					error: function (err) {

					}.bind(this)

				};
				$.ajax(settings);

			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf com.chain.AltNews.view.CreatePost
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.chain.AltNews.view.CreatePost
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.chain.AltNews.view.CreatePost
		 */
		//	onExit: function() {
		//
		//	}

	});

});