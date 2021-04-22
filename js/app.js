// Mi código JavaScript:
var salesApp = new Vue({
  el: "#sales",
  data: {
    yearList: [],
    brands: [],
    cars: [],
    models: [],

    carList: [],
    cotizacion: "",

    yearSelected: "",
    brandSelected: "",
    modelSelected: "",
    statusSelected: "",
    currencySelector: "usd",
  },
  filters: {
    capitalize: function(value){
      return value.toUpperCase();
    },
    numberize: function(value){
      return parseInt(value).toLocaleString("es-UY");
    }
  }
});

var Today = new Date();

$.ajax({
  url: "https://ha.edu.uy/api/rates",
  success: function (monedas) {
    salesApp.cotizacion = monedas.uyu;
  },
});

$.ajax({
  url: "https://ha.edu.uy/api/cars",
  success: function (cars) {
    salesApp.carList = cars;
  },
});

$.ajax({
  url: "https://ha.edu.uy/api/brands",
  success: function (brand) {
    salesApp.brands = brand;
  },
});

for (let index = 1980; index <= Today.getFullYear(); index++) {
  salesApp.yearList.unshift(index);
}

$("#brand-selector").on("change", function () {
  $.ajax({
    url: "https://ha.edu.uy/api/models?brand=" + salesApp.brandSelected,
    success: function (marca) {
      salesApp.models = marca;
    },
  });
});


$("#filter-button").on("click", function () {
  if (
    salesApp.yearSelected !== "" ||
    salesApp.brandSelected !== "" ||
    salesApp.modelSelected !== "" ||
    salesApp.statusSelected !== ""
  ) {
    $.ajax({
      url:
        "https://ha.edu.uy/api/cars?year=" +
        salesApp.yearSelected +
        "&brand=" +
        salesApp.brandSelected +
        "&model=" +
        salesApp.modelSelected +
        "&status=" +
        salesApp.statusSelected,
      success: function (cars) {
        if (cars.length === 0) {
         /*  alert("No hay autos para mostrar"); */
          $(".alert").alert("close");
          mostrarAlert("No hay vehiculos para mostrar con los filtros especificados");
        } else {
          $(".alert").alert("close");
          salesApp.carList = cars;
/*           salesApp.yearSelected = "";
          salesApp.brandSelected = "";
          salesApp.modelSelected = "";
          salesApp.statusSelected = "";
          salesApp.models = ""; */
        }
      },
    });
  } else if (
    salesApp.yearSelected === "" &&
    salesApp.brandSelected === "" &&
    salesApp.modelSelected === "" &&
    salesApp.statusSelected === ""
  ) {
    $.ajax({
      url: "https://ha.edu.uy/api/cars",
      success: function (cars) {
        
        salesApp.carList = cars;
        salesApp.models = "";
      },
    });
  }
});

$("#brand-selector").change(function(){
  if (salesApp.brandSelected === "") {
    salesApp.models = "";    
  }
});

/* 
$("#filter-clear").on("click", function () {
  $.ajax({
    url: "https://ha.edu.uy/api/cars",
    success: function (cars) {
      salesApp.carList = cars;
    },
  });
}); */

$("#toggle-price").on("click", function () {
  if (salesApp.currencySelector === "usd") {
    salesApp.currencySelector = "uyu";
    mostrarAlert("Mostrando precios en: UYU");
  } else if (salesApp.currencySelector === "uyu") {
    salesApp.currencySelector = "usd";
    mostrarAlert("Mostrando precios en: USD");
  }
});

function mostrarAlert(texto) {
  $(".alert").alert("close");
          
  var alertaHTML = `<div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
  ${texto}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`
  
  $("#car-details").before(alertaHTML);
};