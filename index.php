<?php
require_once(__DIR__ . '/config.php');
require_once(__DIR__ . '/functions.php');
require_once(__DIR__ . '/Item.php');
require_once(__DIR__ . '/purchaseItem.php');

// 購入品リストを取得
try{
  $itemList = new \Item();
  $items = $itemList->getAll();

  $purchaseHistory = new \PurchaseHistory();
  $purchaseItems = $purchaseHistory->getAll();
} catch (Exception $e) {
  echo $e->getMessage();
}

// 購入品リストの追加
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add-name'])) {
  $itemList->post();
  $err = $itemList->getError();
}

// 購入履歴の登録
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['item'])) {
  $purchaseHistory->post($_POST['item']);
  $err = $purchaseHistory->getError();
}

// 購入履歴の削除
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete'])) {
  $purchaseHistory->delete($_POST['delete']);
  $err = $purchaseHistory->getError();
}

// 購入品リストの編集
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['edit'])) {
  $itemList->update();
  $err = $itemList->getError();
}

?>
<!DOCTYPE html>
<html lang="ja">

  <head>
    <meta charset="utf-8">
    <meta name="description" content="ぽちっと簡単登録！n日坊主になるための家計簿もどき">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>ぽちっと家計簿</title>
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
      integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
  </head>

  <body>
    <header>
      <h1>ぽちっとかけいぼ</h1>
      <p>気軽にぽちっと家計簿つけよう</p>
      <time></time>
    </header>
    <section class="total">
      <div>
        今月の合計
        <span id="total-price">0</span>
      </div>
    </section>
    
    <section class="graph">
      <div id="open">
        <i class="fas fa-chart-pie"></i> レポートを見る
      </div>
    
      <div id="mask" class="hidden"></div>
    
      <div id="modal" class="hidden">
        <h3>内訳</h3>
        <table></table>
        <h3>支出グラフ</h3>
        <div id="target"></div>
        <div id="close">
          <i class="fas fa-window-close"> 閉じる</i>
        </div>
      </div>
    </section>
    
    <section class="item-list">
      <h2><i class="fas fa-pen-nib"></i> 購入品をぽちっと登録</h2>
      <button id="edit">編集</button>

      <!-- 購入リストが登録されている場合に表示 -->
      <p id="item-list-info">「編集」から購入品リストを作成してください。</p>

      <form id="item-list-from" action="" method="POST">
        <ul>
        </ul>
        <input type="hidden" name="token" value="<?= h($_SESSION['token']); ?>">
      </form>

      <button id="record" type="button">登録する</button>
    
      <section class="edit-list">
        <div id="mask-edit" class="hidden"></div>
    
        <div id="modal-edit" class="hidden">
          <h3>購入品リストを編集</h3>
          <ul class="edit-menu">
            <li id="menu-add">追加</li>
            <li id="menu-edit">編集</li>
          </ul>
    
          <section class="create-item hidden">
            <form action="" method="post" id="add-form">
              <label>品名 <input type="text" id="new-name" name="add-name"></label>
              <label>価格 <input type="number" id="new-price" name="add-price"> 円</label>
              <input type="hidden" name="token" value="<?= h($_SESSION['token']); ?>">
            </form>
            <button id="add-go">追加する</button>
          </section>
    
          <section class="edit-items hidden">
            <p>※ 購入履歴への反映は行われません。</p>
            <form id="edit-from" action="" method="POST">
              <input type="hidden" name="token" value="<?= h($_SESSION['token']); ?>">
            </form>
            <ul>
            </ul>
            <button id="edit-go" type="button">編集する</button>
          </section>
          <div id="cansel">
            <i class="fas fa-window-close"> キャンセル</i>
          </div>
        </div>
      </section>
    
    </section>
    
    <section class="buying-history">
      <h2><i class="fas fa-shopping-cart"></i> 購入履歴</h2>
      <p>購入品の登録がありません。</p>
      <table class="hidden">
        <tbody>
          <tr>
            <th class="buying-date">購入日</th>
            <th class="buying-name">品名</th>
            <th class="buying-num">数</th>
            <th class="buying-price">金額</th>
            <th class="buying-delete"></th>
          </tr>
        </tbody>
      </table>
      <form action="" method="post" id="history-delete-form">
        <input type="hidden" name="delete">
        <input type="hidden" name="token" value="<?= h($_SESSION['token']); ?>">
      </form>
    </section>

    <!-- 購入品リストをjsonに変換してmain.jsで扱う -->
    <script>
      const phpItems = <?php echo(json_encode($items)); ?>;
      const phpPurchaseHistory = <?php echo(json_encode($purchaseItems)); ?>;
    </script>

    <?php if(isset($err)) : ?>
    <script>alert('ERROR!');</script>
    <?php endif; ?>

    <footer>
      &copy; ぽちっとかけいぼ
    </footer>
    <script src="https://www.gstatic.com/charts/loader.js"></script>
    <script src="js/main.js"></script>
  </body>

</html>