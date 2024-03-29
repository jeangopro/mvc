let rowTable = "";
let tableContactos;

// Table
tableContactos = $("#tableContactos").dataTable({
  aProcessing: true,
  aServerSide: true,
  language: {
    url:
      base_url +
      "/Assets/json/datatable_spanish.json" ,
  },
  ajax: {
    url: " " + base_url + "/contactos/getContactos",
    dataSrc: "",
  },
  columns: [
    { data: "idcontacto" },
    { data: "nombre" },
    { data: "email" },
    { data: "fecha" },
    { data: "options" },
  ],
  dom: "lBfrtip",
  buttons: [
    {
      extend: "copyHtml5",
      text: "<i class='far fa-copy'></i> Copiar",
      titleAttr: "Copiar",
      className: "btn btn-secondary",
    },
    {
      extend: "excelHtml5",
      text: "<i class='fas fa-file-excel'></i> Excel",
      titleAttr: "Esportar a Excel",
      className: "btn btn-success",
    },
    {
      extend: "pdfHtml5",
      text: "<i class='fas fa-file-pdf'></i> PDF",
      titleAttr: "Esportar a PDF",
      className: "btn btn-danger",
    },
    {
      extend: "csvHtml5",
      text: "<i class='fas fa-file-csv'></i> CSV",
      titleAttr: "Esportar a CSV",
      className: "btn btn-info",
    },
  ],
  resonsieve: "true",
  bDestroy: true,
  iDisplayLength: 10,
  order: [[0, "desc"]],
});

// Modal See
function fntViewInfo(idmensaje) {
  let request = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");
  let ajaxUrl = base_url + "/Contactos/getMensaje/" + idmensaje;
  request.open("GET", ajaxUrl, true);
  request.send();

  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      let objData = JSON.parse(request.responseText);

      if (objData.status) {
        document.querySelector("#celCodigo").innerHTML =
          objData.data.idcontacto;
        document.querySelector("#celNombre").innerHTML = objData.data.nombre;
        document.querySelector("#celEmail").innerHTML = objData.data.email;
        document.querySelector("#celFecha").innerHTML = objData.data.fecha;
        document.querySelector("#celMensaje").innerHTML = objData.data.mensaje;
        $("#modalViewMensaje").modal("show");
      } else {
        swal("Error", objData.msg, "error");
      }
    }
    return false;
  };
}

// Del Form
function fntDeleteSuscripcion(idsuscripcion) {
  swal(
    {
      title: "Eliminar Suscripción",
      text: "¿Realmente quiere eliminar la Suscrioción?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "No, cancelar",
      closeOnConfirm: false,
      closeOnCancel: true,
    },
    function (isConfirm) {
      if (isConfirm) {
        let request = window.XMLHttpRequest
          ? new XMLHttpRequest()
          : new ActiveXObject("Microsoft.XMLHTTP");
        let ajaxDeleteSuscripcion = base_url + "/Suscriptores/deleteSuscriptor";
        let strData = "idsuscripcion=" + idsuscripcion;
        request.open("POST", ajaxDeleteSuscripcion, true);
        request.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        request.send(strData);
        request.onreadystatechange = function () {
          if (request.readyState == 4 && request.status == 200) {
            let objData = JSON.parse(request.responseText);
            if (objData.status) {
              swal("Eliminar!", objData.msg, "success");
              $("#tableSuscriptores").DataTable().ajax.reload();
            } else {
              swal("Atención!", objData.msg, "error");
            }
          }
          return false;
        };
      }
    }
  );
}
