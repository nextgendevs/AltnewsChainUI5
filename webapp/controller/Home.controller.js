sap.ui.define([
	"com/chain/AltNews/controller/BaseController",
	"sap/ui/core/Fragment",
	"../model/formatter"
], function (BaseController, Fragment, formatter) {
	"use strict";

	return BaseController.extend("com.chain.AltNews.controller.Home", {

		formatter: formatter,

		onInit: function () {
			//Init Local Model
			this.initLocalModel();

			window.StellarServer = new StellarSdk.Server("https://horizon-testnet.stellar.org");
		
			this.loadPosts();
			
		
		
		},
		onPost: function(){
			debugger;
		},
		
		onAfterRendering: function(){
				this.getModel("appView").setProperty("/isLoggedIn", false);
		},
		
		loadPosts: function(){
			var settings = {
				url : "/AltNews/posts",
				type: "GET",
				success : function(data){
				
				this.HomeModel.setProperty("/posts",data);
		
				
				}.bind(this),
				error: function(err){
					console.log(err);
					this.showToast("MSG_LoginError")
				}.bind(this)
			
			}	
			$.ajax(settings);
			
			
		},
		
		onDashboard: function(){
			this.getRouter().navTo("Dashboard");                 
		},

		onRegister: function () {
			var username = 	this.HomeModel.getProperty("/temp/username");
			window.sourceKeys = StellarSdk.Keypair.random();
			var settings = {
				url : "/AltNews/registerUser",
				type: "POST",
				data : {
					cryptoaddress : sourceKeys.publicKey(),
					username : username
				},
				success : function(data){
				
				this.showToast("MSG_REG_SUCCESS");
				
				this.getModel("appView").setProperty("/User",data);
		
				this.getModel("appView").setProperty("/isLoggedIn", true);
				this.HomeModel.setProperty("/temp/cryproAdd",  	window.sourceKeys.publicKey() );
				this.HomeModel.setProperty("/temp/secret",  	window.sourceKeys.secret());
			//	this.onCloseLogin();
				
				}.bind(this),
				error: function(err){
					console.log(err);
					this.showToast("MSG_LoginError")
				}.bind(this)
			
			}	
			$.ajax(settings);
			
			
		
		},

		onAccountLogin: function () {
			var secret = 	this.HomeModel.getProperty("/temp/secret");
			//TODO: put busy
			if(secret)
			try{
			window.sourceKeys = StellarSdk.Keypair.fromSecret(secret);
			}catch(err){
				this.showToast("LOGIN_ERR_MSG")
				return;
			}
			else
			return;
			
			if(window.sourceKeys.canSign())
			{
			var settings = {
				url : "/AltNews/getUser",
				type: "GET",
				data : {
					cryptoadd : sourceKeys.publicKey()
				},
				success : function(data){
				this.showToast("MSG_SUCCESS_LOGIN")	
				this.getModel("appView").setProperty("/User",data);
				this.getModel("appView").setProperty("/isLoggedIn", true);
				this.onCloseLogin();
				
				}.bind(this),
				error: function(err){
					console.log(err);
					this.showToast("MSG_LoginError")
				}.bind(this)
			
			}	
			$.ajax(settings);
		//	this.getModel("appView").setProperty("cryptoAddress",sourceKeys.publicKey());
			
			
			}else
			{
					this.showToast("MSG_WRNG_PSSWRD")
			}
			
		},

		onLogin: function () {
			var oView = this.getView(),
				that = this;
			// create dialog lazily
			if (!that._oDlgLogin) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "com.chain.AltNews.view.subview.accountlogin",
					controller: that
				}).then(function (oDialog) {
					that._oDlgLogin = oDialog;
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				that._oDlgLogin.open();
			}
		},

		onCloseLogin: function () {
			this._oDlgLogin.close();
		},

		switchbLogin: function () {
			this.HomeModel.setProperty("/bShowLogin", !(this.HomeModel.getProperty("/bShowLogin")));
		},

		initLocalModel: function () {
			this.HomeModel = new sap.ui.model.json.JSONModel({
				bPageBusy: false,
				bShowLogin: true,
				temp: {cryproAdd : "", secret : "", username : ""},
				posts:[]
			});

			this.setModel(this.HomeModel, "Home");

		}
	});
});