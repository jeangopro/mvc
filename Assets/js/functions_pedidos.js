let tablePedidos;
let rowTable;

// Table
tablePedidos = $("#tablePedidos").DataTable({
  aProcessing: true,
  aServerside: true,
  language: {
    url:
      base_url +
      "/Assets/json/datatable_spanish.json" ,
  },
  ajax: {
    url:
      base_url +
      "/Pedidos/getPedidos" ,
    dataSrc: "",
  },
  columns: [
    { data: "idpedido" },
    { data: "transaccion" },
    { data: "fecha" },
    { data: "monto" },
    { data: "tipopago" },
    { data: "status" },
    { data: "options" },
  ],
  createdRow: function (row, data, dataIndex) {
    if (data["status"] == "Completo") {
      $(row).addClass("text-success");
    }
    if (data["status"] == "Pendiente") {
      $(row).addClass("text-danger");
    }
    if (data["status"] == "Aprobado") {
      $(row).addClass("text-warning");
    }
    if (data["status"] == "Reembolsado") {
      $(row).addClass("text-info");
    }
  },
  columnDefs: [
    { className: "text-center", targets: [3] },
    { className: "text-right", targets: [4] },
    { className: "text-center", targets: [5] },
  ],
  dom: "lBfrtip",
  buttons: [
    {
      extend: "copyHtml5",
      text: "<i class='far fa-copy'></i> Copiar",
      titleAttr: "Copiar",
      className: "btn btn-secondary",
      exportOptions: {
        columns: [0, 1, 2, 3, 4, 5],
      },
    },
    {
      extend: "excelHtml5",
      text: "<i class='fas fa-file-excel'></i> Excel",
      titleAttr: "Esportar a Excel",
      className: "btn btn-success",
      exportOptions: {
        columns: [0, 1, 2, 3, 4, 5],
      },
    },
    {
      extend: "pdfHtml5",
      text: "<i class='fas fa-file-pdf'></i> PDF",
      titleAttr: "Esportar a PDF",
      className: "btn btn-danger",
      exportOptions: {
        columns: [0, 1, 2, 3, 4, 5],
      },
    },
    {
      extend: "csvHtml5",
      text: "<i class='fas fa-file-csv'></i> CSV",
      titleAttr: "Esportar a CSV",
      className: "btn btn-info",
      exportOptions: {
        columns: [0, 1, 2, 3, 4, 5],
      },
    },
  ],
  responsieve: "true",
  bDestroy: true,
  iDisplayLength: 10 ,
  order: [[0, "desc"]] ,
});

// Transaction
function fntTransaccion(idtransaccion) {
  let request = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");
  let ajaxUrl = base_url + "/pedidos/getTransaccion/" + idtransaccion;
  divLoading.style.display = "flex";
  request.open("GET", ajaxUrl, true);
  request.send();

  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      let objData = JSON.parse(request.responseText);
      if (objData.status) {
        document.querySelector("#divModal").innerHTML = objData.html;
        $("#modalReembolso").modal("show");
      } else {
        swal("Error", objData.msg, "error");
      }
      divLoading.style.display = "none";
      return false;
    }
  };
}

// Reembolsar
function fntReembolsar() {
  let idtransaccion = document.querySelector("#idtransaccion").value;
  let observacion = document.querySelector("#txtObservacion").value;
  if (idtransaccion == "" || observacion == "") {
    swal("", "Complete los atos para continuar.", "error");
    return false;
  }

  swal(
    {
      title: "Hacer Reembolso",
      text: "¿Realmente quiere realizar el reembolso?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, reembolsar",
      cancelButtonText: "No, cancelar",
      closeOnConfirm: true,
      closeOnCancel: true,
    },
    function (isConfirm) {
      if (isConfirm) {
        $("#modalReembolso").modal("hide");
        divLoading.style.display = "flex";
        let request = window.XMLHttpRequest
          ? new XMLHttpRequest()
          : new ActiveXObject("Microsoft.XMLHTTP");
        let ajaxUrl = base_url + "/pedidos/setReembolso/";
        let formData = new FormData();
        formData.append("idtransaccion", idtransaccion);
        formData.append("observacion", observacion);
        request.open("POST", ajaxUrl, true);
        request.send(formData);
        request.onreadystatechange = function () {
          if (request.readyState != 4) return;
          if (request.status == 200) {
            let objData = JSON.parse(request.responseText);
            if (objData.status) {
              window.location.reload();
            } else {
              swal("Error", objData.msg, "error");
            }
            divLoading.style.display = "none";
            return false;
          }
        };
      }
    }
  );
}

// Edit Form
function fntEditPedido(element, idpedido) {
  rowTable = element.parentNode.parentNode.parentNode;
  let request = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");
  let ajaxUrl = base_url + "/pedidos/getPedido/" + idpedido;
  divLoading.style.display = "flex";
  request.open("GET", ajaxUrl, true);
  request.send();
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      let objData = JSON.parse(request.responseText);
      if (objData.status) {
        document.querySelector("#divModal").innerHTML = objData.html;
        $("#modalFormPedido").modal("show");
        $("select").selectpicker();
        fntUpdatePedido();
      } else {
        swal("Error", objData.msg, "error");
      }
      divLoading.style.display = "none";
      return false;
    }
  };
}

// Update Form
function fntUpdatePedido() {
  let formUpdatePedido = document.querySelector("#formUpdatePedido");
  formUpdatePedido.onsubmit = function (e) {
    e.preventDefault();
    let transaccion;
    if (document.querySelector("#txtTransaccion")) {
      transaccion = document.querySelector("#txtTransaccion").value;
      if (transaccion == "") {
        swal("", "Complete los datos para continuar,", "error");
        return false;
      }
    }

    let request = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");
    let ajaxUrl = base_url + "/pedidos/setPedido/";
    divLoading.style.display = "flex";
    let formData = new FormData(formUpdatePedido);
    request.open("POST", ajaxUrl, true);
    request.send(formData);
    request.onreadystatechange = function () {
      if (request.readyState != 4) return;
      if (request.status == 200) {
        let objData = JSON.parse(request.responseText);
        if (objData.status) {
          swal("", objData.msg, "success");
          $("#modalFormPedido").modal("hide");
          if (document.querySelector("#txtTransaccion")) {
            rowTable.cells[1].textContent =
              document.querySelector("#txtTransaccion").value;
            rowTable.cells[4].textContent =
              document.querySelector(
                "#listTipopago"
              ).selectedOptions[0].innerText;
            rowTable.cells[5].textContent =
              document.querySelector("#listEstado").value;
          } else {
            rowTable.cells[5].textContent =
              document.querySelector("#listEstado").value;
          }
        } else {
          swal("Error", objData.msg, "error");
        }
        divLoading.style.display = "none";
        return false;
      }
    };
  };
}
