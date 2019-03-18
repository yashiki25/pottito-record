<?php

class PurchaseHistory {
  private $_db;
  private $_purchaseItems = [];

  public function __construct() {
    $this->_connectDB();
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

  public function getAll() {
    $stmt = $this->_db->query("select * from purchaseHistory order by id asc");
    return $stmt->fetchAll(\PDO::FETCH_OBJ);
  }

  public function post($purchaseItem) {
    try {
      $this->_validateItem($purchaseItem);
      $this->_extractionItem();
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

  private function _validateItem($item) {
    if(!isset($item)) {
      throw new \Exception('invalid input!');
    }
  }

  private function _extractionItem() {
    // 個数が登録されているアイテムだけを抽出
    foreach($_POST['item'] as $item) {
      if($item['purchaseNum'] != "0") {
        array_push($this->_purchaseItems, $item);
      }
    }
  }

  private function _save() {
    foreach($this->_purchaseItems as $item) {
      $sql = "insert into purchaseHistory (name, price, num) values (:name, :price, :num)";
      $stmt = $this->_db->prepare($sql);
      $stmt->bindValue(':name', $item['purchaseName'], \PDO::PARAM_STR);
      $stmt->bindValue(':price', (int)$item['purchasePrice'], \PDO::PARAM_INT);
      $stmt->bindValue(':num', (int)$item['purchaseNum'], \PDO::PARAM_INT);
      $stmt->execute();
    }
  }

  public function delete($deleteItem) {
    try{
      $this->_validateItem($deleteItem);
      $this->_delete();
      header('Location: http://' . $_SERVER['HTTP_HOST'] . '/index.php');
    } catch(\Exception $e) {
      $_SESSION['err'] = $e->getMessage();
    }
  }

  private function _delete() {
    $sql = "delete from purchaseHistory where id = :id";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindValue(':id', (int)$_POST['delete'], \PDO::PARAM_INT);
    $stmt->execute();
  }
}