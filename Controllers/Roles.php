<?php
  class Roles extends Controllers{

    public function __construct(){
      parent::__construct();
      session_start();
      if (empty($_SESSION['login'])) {
          header('Location: '.base_url().'/login');
      }
      getPermisos(MUSUARIOS);
    }

    public function roles(){
      if (empty($_SESSION['permisosMod']['r'])) {
        header("Location:".base_url().'/dashboard');
      }
      $data['page_id'] = 3;
      $data['page_tag'] = "Roles Usuario - ".NOMBRE_EMPRESA;
      $data['page_title'] = "ROLES USUARIO";
      $data['page_name'] = "Roles Usuario";
      $data['page_functions_js'] = "functions_roles.js";
			$data['menu'] = "roles";
      $this->views->getView($this,"roles",$data);
    }

    public function getRoles(){
      if($_SESSION['permisosMod']['r']){
        $btnView = '';
        $btnEdit = '';
        $btnDelete = '';
        $arrData = $this->model->selectRoles();
        for ($i=0; $i < count($arrData); $i++) {

          if ($arrData[$i]['status'] == 1) {
            $arrData[$i]['status'] = '<span class="badge badge-success">Activo</span>';
          }else{
            $arrData[$i]['status'] = '<span class="badge badge-danger">Inactivo</span>';
          }

          if ($_SESSION['permisosMod']['u']) {
            $btnView = '<button class="btn btn-secondary btn-sm" onClick="fntPermisos('.$arrData[$i]['idrol'].')" title="Permisos"><i class="fas fa-key"></i></button>';
            $btnEdit = '<button class="btn btn-success btn-sm" onClick="fntEditInfo(this,'.$arrData[$i]['idrol'].')" title="Permisos"><i class="fas fa-pencil-alt"></i></button>';
          }
          if ($_SESSION['permisosMod']['d']) {
            $btnDelete = '<button class="btn btn-danger btn-sm" onClick="fntDelInfo('.$arrData[$i]['idrol'].')" title="Permisos"><i class="fas fa-trash-alt"></i></button>';
          }

          $arrData[$i]['options'] = '<div class="text-center">'.$btnView.' '.$btnEdit.' '.$btnDelete.'</div>';
        }
        echo json_encode($arrData, JSON_UNESCAPED_UNICODE);
      }
      die();
    }

    public function getSelectRoles(){
      $htmlOptions = "";
      $arrData = $this->model->selectRoles();
      if (count($arrData) > 0) {
        for ($i=0; $i < count($arrData); $i++) {
          if ($arrData[$i]['status'] == 1) {
            $htmlOptions .= '<option value="'.$arrData[$i]['idrol'].'">'.$arrData[$i]['nombrerol'].'</option>';
          }
        }
      }
      echo $htmlOptions;
      die();
    }

    public function getRol(int $idrol){
      if($_SESSION['permisosMod']['r']){
        $intIdrol = intval($idrol);
        if ($intIdrol > 0) {
          $arrData = $this->model->selectRol($intIdrol);
          if (empty($arrData)) {
            $arrResponse = array('status' => false, 'msg' => 'Datos no encontrados.');
          }else{
            $arrResponse = array('status' => true, 'msg' => $arrData);
          }
          echo json_encode($arrResponse, JSON_UNESCAPED_UNICODE);
        }
      }
      die();
    }

    public function setRol(){
      if($_SESSION['permisosMod']['w']){
        $intIdrol = intval($_POST['idRol']);
        $strRol = strClean($_POST['txtNombre']);
        $strDescripcion = strClean($_POST['txtDescripcion']);
        $intStatus = intval($_POST['listStatus']);

        if ($intIdrol == 0) {
          // Crear
          $request_rol = $this->model->insertRol($strRol, $strDescripcion, $intStatus);
          $option = 1;
        }else{
          // Actualizar
          $request_rol = $this->model->updateRol($intIdrol, $strRol, $strDescripcion, $intStatus);
          $option = 2;
        }

        if ($request_rol > 0) {
          if ($option == 1) {
            $arrResponse = array('status' => true, 'msg' => 'Datos Guardados correctamente.');
          }else{
            $arrResponse = array('status' => true, 'msg' => 'Datos Actualizados correctamente.');
          }
        }else if ($request_rol == 'exist') {
          $arrResponse = array('status' => false, 'msg' => '¡Atención! El Rol ya existe.');
        }else{
          $arrResponse = array('status' => false, 'msg' => 'No es posible almacenar los datos.');
        }
        echo json_encode($arrResponse, JSON_UNESCAPED_UNICODE);
      }
      die();
    }

    public function deleteRol(){
      if ($_POST) {
        if($_SESSION['permisosMod']['d']){
          $intIdrol = intval($_POST['idrol']);
          $requestDelete = $this->model->deleteRol($intIdrol);
          if ($requestDelete == 'ok') {
            $arrResponse = array('status' => true, 'msg' => 'Se ha eliminado el Rol.');
          }else if ($requestDelete == 'exist') {
            $arrResponse = array('status' => false, 'msg' => 'No es posible eliminar un Rol asociado a usuarios.');
          }else{
            $arrResponse = array('status' => false, 'msg' => 'Error al eliminar el Rol.');
          }
          echo json_encode($arrResponse, JSON_UNESCAPED_UNICODE);
        }
      }
      die();
    }

  }
?>