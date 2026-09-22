sap.ui.define([
"sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "project3/model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"

], (Controller, MessageToast, Filter, FilterOperator, formatter, Fragment, MessageBox) => {
    "use strict";
    return Controller.extend("project3.controller.View1", {

        formatter: formatter,

        // // onInit() {
        // //     console.log("on init called");
        // // },

        // // onBeforeRendering(){
        // //     console.log("on before called");
        // // },

        // // onAfterRendering(){
        // //     console.log("on after called");
        // // },

        // // onExit(){
        // //     console.log("on exit called");
        // // },
        // // onAddButtonPress (){
        // //     MessageToast.show("button Pressed");
        // // },
        // // onSelectingRows(){
        // //     console.log("Table Row selected")
        // // }

        // to add data on next screen
        onItemPress: function (oEvent) {
            //to fetch the listitem parameter
            const oItem = oEvent.getParameter("listItem");

            // to get the location of the row which has been cliked 
            const oContext = oItem.getBindingContext();

            //to get complete object (Data) of that row
            const oObject = oContext.getObject();

            this.getOwnerComponent().getModel("jsonM").setData(oObject); // to get data from model 
            // fetch the model from gloabl to view1    // set the data to view 

            const productID = oContext.getProperty("ID");

            this.getOwnerComponent().getRouter().navTo("RouteView2",
                {
                    ProductID: productID
                });

            // Mandatory parameters - /{xyz}
            // Optional parameters - /:xyx:
        },


        onSearchByProduct: function (oEvent) {
            // fetch the user input
            const sQuery = oEvent.getParameter("query");

            // fetch the Table as a ui element to show results in same table format with headings 
            const oTable = this.byId("idProductsTable");

            // fetch the Binding (data)
            const oBinding = oTable.getBinding("items");

            // fetch the Filter using FilterOperator 
            const oFilter = new Filter("Name", FilterOperator.Contains, sQuery);

            // pass the filter in the binding
            oBinding.filter([oFilter]);
        },

        onSearchByID : function (oEvent) {
            // fetch the user input
            const sQuery = oEvent.getParameter("query");

            // fetch the Table as a ui element to show results in same table format with headings 
            const oTable = this.byId("idProductsTable");

            // fetch the Binding (data)
            const oBinding = oTable.getBinding("items");

            // fetch the Filter using FilterOperator 
            const oFilter = new Filter("ID", FilterOperator.EQ, sQuery);

            // pass the filter in the binding
            oBinding.filter([oFilter]);
        },


        onFilterTable: function () {
            console.log("Filter");
            const sName = this.byId("Name").getValue();
            const sID = this.byId("ID").getValue();
           

            const oTable = this.byId("idProductsTable");
            const oBinding = oTable.getBinding("items");

            const oFilter1 = new Filter("Name", FilterOperator.Contains, sName);
            const oFilter2 = new Filter("ID", FilterOperator.EQ, sID);


            let aFilters = [];
            if (sName) {
                aFilters.push(oFilter1);
            }

            if (sID) {
                aFilters.push(oFilter2);
            }

            if (sUnitsInStock) {
                aFilters.push(oFilter3);
            }

            oBinding.filter(aFilters);
        },

       


        onAddProduct: function () {
            // lets name our fragment as pAddDialog

            // this block is for to check whther the dialog is exist if it is not then create if alrady exist then it will open
            // this block of code is for load the Fragment in memory once it is created it will save in memory 


            // if the fragment doesn't exist 
            if (!this.pAddDialog) {
                this.pAddDialog = Fragment.load({              // load this fragment and return promise
                    id: this.getView().getId(),                // id of fragment (id)fo these inputs want to add in dialog Ex.  Assume you Product Name hahs ID as 'Name' then it will act as 'addProductDialogName' for unique ID for all dialogs(fragments) to avoid multiple ID collisons
                    name: "project3.view.AddProduct",          // path where fragment loaded 
                    controller: this                           // eto provide which controller will be used as events handlers fro the fragments                   
                }).then(function (oDialog) {                   // this return when the fragments loading is finished 
                    this.getView().addDependent(oDialog);      // 1)you can inherit used model 2)it willg et distroyed once the view is distroyed 
                    return oDialog;                            // it will reject/resolve promise 
                }.bind(this))                                  // to use the 'this' keyword which points to the controller 
            }

            // No below code block is to open fragment(Dialog) means when use click on button it will open 
            // So it is already loaded in memory so it will not try to load again again it will just open directly without any depedenies
            this.pAddDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onCreateProduct: function () {

            // first fetch the mandatory fields(required true fields)

            const globalID = this.getView().getId();
            const sID = Fragment.byId(globalID, "inputID").getValue();
            const sName = Fragment.byId(globalID, "inputName").getValue();
            const sReleaseDate = Fragment.byId(globalID, "inputReleaseDate").getDateValue();
            const sPrice = Fragment.byId(globalID, "inputPrice").getValue();
            

            // basic validation
           
           if (!sName || !sID || !sReleaseDate || !sPrice) {
                MessageBox.error("ID, Name, Release Date & Price are required");
                return;
            }

            const oNewProduct = {
                __metadata : {type: "ODataDemo.Product"},

                ID: parseInt(sID, 10),
                Name : sName,
                Price: parseFloat(sPrice),
                ReleaseDate: sReleaseDate,
                Rating : 3,
                Description : "ABC"
                
            }

            const oDataModel = this.getView().getModel();               // fetch the model for data 
            oDataModel.create("/Products", oNewProduct, {              // .create/.read/.remove/.update methods on which entity and dialog
                success: function () {
                    MessageToast.show("Product Created");
                },
                error: function (oError) {
                    MessageToast.show("Product Creation Failed. The error is : " + error);
                }
            });

        }







    });
});