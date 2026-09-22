sap.ui.define([
    "sap/ui/core/format/NumberFormat"
], (NumberFormat) => {
  "use strict";

  return {

    formatUnitPrice : function(price){

        if (!price)
            return "";

        const oNumberFormat = NumberFormat.getFloatInstance(
            {
                minFractionDigits :2,
                maxFractionDigits : 2
            }
        )
        return "$" + oNumberFormat.format(price);
    }
    
  }
      
});