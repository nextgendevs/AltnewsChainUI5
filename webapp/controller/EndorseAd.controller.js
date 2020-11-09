sap.ui.define([
			"com/chain/AltNews/controller/BaseController"
		], function (Controller) {
			"use strict";

			return Controller.extend("com.chain.AltNews.controller.EndorseAd", {

				/**
				 * Called when a controller is instantiated and its View controls (if available) are already created.
				 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
				 * @memberOf com.chain.AltNews.view.EndorseAd
				 */
				onInit: function () {

					this.oModel = new sap.ui.model.json.JSONModel();

					this.setModel(this.oModel, "Advt");

					this.getRouter().getRoute("EndorseAd").attachPatternMatched(this._onObjectMatched, this);

				},

				_onObjectMatched: function () {
					this.loadAllAds();
				},

				loadAllAds: function () {
					var that = this;
					var settings = {
						url: "/AltNews/getAllAds",
						type: "GET",
						data: {
							user: this.getModel("appView").getProperty("/User/_id") ||
								"5f99a664709e3515aa7befb0",
							hash: true
						},
						success: function (data) {

							data = data.map(function (ele) {
								//	IPFS_Txt
								ele.hash = that.getResourceBundle().getText("IPFS_Txt") + ele.hash;

								return ele;

							});
							this.oModel.setProperty("/aAds", data);

						}.bind(this),
						error: function (err) {

						}.bind(this)

					};
					$.ajax(settings);

				},

				onEndorse: function () {

					const asset = new StellarSdk.Asset(
						'XLM'
					);
					var destinationId =  this.oModel.getProperty("/data/dest")
					
					const amount = this.oModel.getProperty("/data/amount") || '10';
					const claimants = [
						new StellarSdk.Claimant(
							'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
							StellarSdk.Claimant.predicateBeforeAbsoluteTime("4102444800000")
						)
					];

					const op = StellarSdk.Operation.createClaimableBalance({
						asset,
						amount,
						claimants
					});
					var	transaction;
					window.StellarServer
						.loadAccount(destinationId)
						// If the account is not found, surface a nicer error message for logging.
						.catch(function (error) {
							if (error instanceof StellarSdk.NotFoundError) {
								throw new Error("The destination account does not exist!");
							} else return error;
						})
						// If there was no error, load up-to-date information on your account.
						.then(function () {
							return 	window.StellarServer.loadAccount(window.sourceKeys.publicKey());
						})
						.then(function (sourceAccount) {
								// Start building the transaction.
							transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
									fee: StellarSdk.BASE_FEE,
									networkPassphrase: StellarSdk.Networks.TESTNET,
								}).addOperation(op)
								.setTimeout(180).build();
								
								  transaction.sign(sourceKeys);
								  
							
						  // And finally, send it off to Stellar!
						 return window.StellarServer.submitTransaction(transaction);

							}).then(function(result){
								
								//	console.log(transaction.ClaimableBalanceID(0));
								console.log(result)
							})
							
							
							
				}

							/**
							 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
							 * (NOT before the first rendering! onInit() is used for that one!).
							 * @memberOf com.chain.AltNews.view.EndorseAd
							 */
							//	onBeforeRendering: function() {
							//
							//	},

							/**
							 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
							 * This hook is the same one that SAPUI5 controls get after being rendered.
							 * @memberOf com.chain.AltNews.view.EndorseAd
							 */
							//	onAfterRendering: function() {
							//
							//	},

							/**
							 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
							 * @memberOf com.chain.AltNews.view.EndorseAd
							 */
							//	onExit: function() {
							//
							//	}

						});

			});