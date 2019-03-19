<?php

class Item {
  private $_db;

  public function __construct() {
    $this->_connectDB();
    $this->_createToken();
  }

  // 購入品リストの取得
  public function getAll() {
    $stmt = $this->_db->query('select * from items order by id asc');
    return $stmt->fetchAll(\PDO::FETCH_OBJ);
  }

  // 購入品リストへの追加
  public function post() {
    try {
      $this->_validateToken();
      $this->_validateItem();
      $this->_save();
      header('Location: http://' . $_SERVER['HTTP_HOST'] . '/index.php');
    } catch (\Exception $e) {
      $_SESSION['err'] = $e->getMessage();
    }
  }

  public function getError() {
    $err = null;

    if(isset($_SESSION['err'])) {
      $err = $_SESSION['err'];
      unset($_SESSION['err']);
    }

    return $err;
  }

  // 購入品リストの編集・削除
  public function update() {
    try {
      $this->_validateEditItem();
      $this->_validateToken();
      $this->_update();
      header('Location: http://' . $_SERVER['HTTP_HOST'] . '/index.php');
    } catch (\Exception $e) {
      $_SESSION['err'] = $e->getMessage();
    }
  }

  private function _connectDB() {
    try {
      $this->_db = new \PDO(DSN, DB_USERNAME, DB_PASSWORD);
      $this->_db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    } catch (\PDOException $e) {
      echo $e->getMessage();
      exit;
    }
  }

  private function _createToken() {
    if (!isset($_SESSION['token'])) {
      $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(16));
    }
  }

  private function _validateToken() {
    if (
      !isset($_SESSION['token']) ||
      !isset($_POST['token']) ||
      $_SESSION['token'] !== $_POST['token']
    ) {
      throw new \Exception('invalid token!');
    }
  }

  private function _validateItem() {
    if(!isset($_POST['add-name']) ||
    !strlen($_POST['add-name']) ||
    !isset($_POST['add-price']) ||
    !strlen($_POST['add-price'])
    ) {
      throw new \Exception('invalid input!');
    }
  }

  private function _save() {
    $sql = 'insert into items (name, price) values (:name, :price)';
    $stmt = $this->_db->prepare($sql);
    $stmt->bindValue(':name', $_POST['add-name'], \PDO::PARAM_STR);
    $stmt->bindValue(':price', $_POST['add-price'], \PDO::PARAM_INT);
    $stmt->execute();
  }

  private function _validateEditItem() {
    if(!isset($_POST['edit'])) {
      throw new \Exception('invalid input!');
    }
  }

  private function _update() {
    foreach($_POST['edit'] as $item) {
      // 削除
      if($item['editDelete'] == 'true') {
          $this->_delete($item);
          continue;
      }

      // 品名・価格の更新
      $sql = 'update items set name = :name, price = :price where id = :id';
      $stmt = $this->_db->prepare($sql);
      $stmt->bindValue(':name', $item['editName'], \PDO::PARAM_STR);
      $stmt->bindValue(':price', (int)$item['editPrice'], \PDO::PARAM_INT);
      $stmt->bindValue(':id', (int)$item['editId'], \PDO::PARAM_INT);
      $stmt->execute();
    }
  }

  private function _delete($item) {
    $sql = 'delete from items where id = :id';
    $stmt = $this->_db->prepare($sql);
    $stmt->bindValue(':id', (int)$item['editId'], \PDO::PARAM_INT);
    $stmt->execute();
  }
}