'use strict';

let items = []; // 購入品リスト
let recordItems = []; // 購入履歴
let total = 0; // 現在の合計金額
let recordNo = 0; // 登録番号

// 円グラフデータ
const chartItems = [
  ['Item', 'Sum'],
]

const itemList = document.querySelector('.item-list ul'); // 購入品リスト
const itemListForm = document.getElementById('item-list-from'); // 購入品リストフォーム
const totalPrice = document.getElementById('total-price'); // 合計金額
const buyingHistoryTable = document.querySelector('.buying-history table'); // 購入履歴
const recordBtn = document.getElementById('record'); // 登録ボタン
const openBtn = document.getElementById('open'); // 集計グラフボタン

const editingModal = document.getElementById('modal-edit'); // 編集用モーダル
const editingMenuBtn = document.getElementById('edit'); // 編集画面を表示するボタン
const selectEditing = document.getElementById('menu-edit'); // 編集選択ボタン
const selectCreating = document.getElementById('menu-add'); // 追加選択ボタン
const editingMask = document.getElementById('mask-edit');
const createBtn = document.getElementById('add-go'); // 追加実行ボタン
const editBtn = document.getElementById('edit-go'); // 編集実行ボタン
const editingItems = document.querySelector('.edit-items');
const creatingItem = document.querySelector('.create-item');
const editingUl = document.querySelector('.edit-items > ul');
const canselBtn = document.getElementById('cansel');
const editListForm = document.getElementById('edit-from');  // 編集リストフォーム

const mask = document.getElementById('mask');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close');
const itemSumTable = document.querySelector('#modal table');
const noDataText = document.querySelector('.buying-history p');

// 日付を表示
document.querySelector('time').textContent = getFormattedCurrentDate().toTop;

const storage = localStorage;
// 保存しているデータを読み込み
readData();

function readData() {
  if (phpItems.length > 0) {
    items = phpItems;
  }

  if (phpPurchaseHistory.length > 0) {
    recordItems = phpPurchaseHistory;

    noDataText.classList.add('hidden');
    buyingHistoryTable.classList.remove('hidden');

    // 履歴と合計金額を作成
    recordItems.forEach(item => {
      createBuyingHistory(item.name, item.price, item.num, item.id);
      updateTotalPrice(item.price, item.num);
    });
  }
}

// 購入品リストの生成判定
isCreateItems();

function isCreateItems() {
  const massage = document.getElementById('item-list-info');
  if (items.length < 1) {
    massage.classList.remove('hidden');
    recordBtn.classList.add('hidden');
  }
  else {
    massage.classList.add('hidden');
    recordBtn.classList.remove('hidden');
    
    // 購入品リストを生成
    createItems();
  }
}

function createItems() {
  items.forEach((item, index) => {
    const li = document.createElement('li');

    const spanName = document.createElement('span');
    spanName.classList.add('item-name');
    spanName.textContent = item.name; // 購入品名を設定
    // spanName.dataset.price = item.price; // data属性に価格を設定
    // spanName.dataset.id = item.id;

    const plusBtn = document.createElement('button');
    plusBtn.classList.add('item-num-btn');
    plusBtn.type = 'button';
    plusBtn.textContent = '+';

    const minusBtn = document.createElement('button');
    minusBtn.classList.add('item-num-btn');
    minusBtn.type = 'button';
    minusBtn.textContent = '-';

    const numSpan = document.createElement('span');
    numSpan.classList.add('item-num');
    numSpan.textContent = 0;

    li.appendChild(spanName);
    li.appendChild(minusBtn);
    li.appendChild(numSpan);
    li.appendChild(plusBtn);
    itemList.appendChild(li);

    // サーバー送信用
    const inputItemName = document.createElement('input');
    inputItemName.type = 'hidden';
    inputItemName.name = `item[${index}][purchaseName]`;
    inputItemName.value = item.name;

    const inputItemPrice = document.createElement('input');
    inputItemPrice.type = 'hidden';
    inputItemPrice.name = `item[${index}][purchasePrice]`;
    inputItemPrice.value = item.price;

    const inputItemNum = document.createElement('input');
    inputItemNum.type = 'hidden';
    inputItemNum.name = `item[${index}][purchaseNum]`;
    inputItemNum.value = numSpan.textContent;

    itemListForm.appendChild(inputItemName);
    itemListForm.appendChild(inputItemPrice);
    itemListForm.appendChild(inputItemNum);

    // +ボタンクリック
    plusBtn.addEventListener('click', () => {
      spanName.classList.add('selected-list');
      const nowNum = parseInt(numSpan.textContent, 10);
      numSpan.textContent = nowNum + 1;
      inputItemNum.value = numSpan.textContent;
    });

    // -ボタンクリック
    minusBtn.addEventListener('click', () => {
      const nowNum = parseInt(numSpan.textContent, 10);
      if (nowNum > 0) {
        numSpan.textContent = nowNum - 1;
        inputItemNum.value = numSpan.textContent;

        if (numSpan.textContent === '0') {
          spanName.classList.remove('selected-list');
        }
      }
    });
  });
}

// 現在の日付を取得
function getFormattedCurrentDate() {
  const newDate = new Date();
  const currentYear = newDate.getFullYear();
  const currentMonth = newDate.getMonth() + 1;
  const currentDate = newDate.getDate();

  const day = ['日', '月', '火', '水', '木', '金', '土'];
  const currentDayIndex = newDate.getDay();
  const currentDay = day[currentDayIndex];

  const result = {
    toTop: `${currentYear} / ${currentMonth} / ${currentDate} (${currentDay})`,
    toBuyingHistory: `${currentMonth} / ${currentDate}`,
  };

  return result;
}

// 購入品の登録
recordBtn.addEventListener('click', () => {
  itemListForm.submit();
});

// 購入履歴の作成
function createBuyingHistory(name, price, num, no) {
  // 購入履歴テーブルの先頭に新規行を追加
  const newRow = buyingHistoryTable.insertRow(1);
  // 登録したオブジェクトと共通の一意の値を持たせる
  newRow.dataset.no = no;

  const addData = [getFormattedCurrentDate().toBuyingHistory, name, num, price];

  addData.forEach((data, index) => {
    // 行に新規セルを追加
    const newCell = newRow.insertCell(index);

    // 新規セルに購入履歴データを設定
    if (index === 3) { // 金額
      // 先頭に¥をつけるため、金額のカラムにはクラスを付与する
      newCell.classList.add('buying-price-td');
      newCell.textContent = data * num;
    } else {
      newCell.textContent = data;
    }
  });

  // 削除のボタンを作成
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete');
  deleteBtn.textContent = '削除';

  const btnCell = newRow.insertCell(4);
  btnCell.appendChild(deleteBtn);

  // 履歴の削除
  deleteBtn.addEventListener('click', () => {
    if (!confirm('削除しますか？')) {
      // キャンセルなら処理を終了
      return;
    }

    // サーバーへ送信
    const deleteHistoryForm = document.getElementById('history-delete-form');
    deleteHistoryForm.children[0].value = newRow.dataset.no;
    deleteHistoryForm.submit();
  });
}

// 合計金額の更新
function updateTotalPrice(price, num) {
  total += parseInt(price, 10) * num;
  // 表示金額を更新
  totalPrice.textContent = total;
}

// 円グラフ描画
function drawChart() {
  const target = document.getElementById('target');

  const option = {
    width: 300,
    height: 200,
    pieSliceText: 'label'
  };

  const chart = new google.visualization.PieChart(target);
  const data = new google.visualization.arrayToDataTable(chartItems);

  chart.draw(data, option);
}

// 集計グラフの表示
openBtn.addEventListener('click', () => {
  if (recordItems.length < 1) {
    alert('購入品の登録がありません。');
    return;
  }

  mask.classList.remove('hidden');
  modal.classList.remove('hidden');

  // 登録リストから集計データを作成
  const groups = [];
  recordItems.forEach(item => {
    const findItem = groups.find(group => group.name === item.name);
    // 集計用groups配列にすでに追加されていたら個数を加算
    if (findItem) {
      findItem.num = parseInt(findItem.num, 10) + parseInt(item.num, 10);
    } else {
      // 未登録だったら追加
      groups.push({
        name: item.name,
        price: item.price,
        num: item.num
      });
    }
  });

  groups.forEach(group => {
    // 内訳を作成
    const newRow = itemSumTable.insertRow(-1);
    const sumPrice = parseInt(group.num * group.price); // 合計金額

    const sumDate = [group.name, `× ${group.num}`, sumPrice];
    sumDate.forEach((data, index) => {
      const newCell = newRow.insertCell(index);
      newCell.textContent = data;

      if (index === 2) {
        // 金額には¥をつける
        newCell.classList.add('buying-price-td');
      }
    });

    chartItems.push([group.name, sumPrice]);
  });

  // 円グラフ描画
  google.charts.load('current', {
    packages: ['corechart']
  });
  google.charts.setOnLoadCallback(drawChart);
});

// 閉じるボタンクリックでモーダルを閉じる
closeBtn.addEventListener('click', () => {
  modalClose();
});

// マスククリックでモーダルを閉じる
mask.addEventListener('click', () => {
  modalClose();
});

function modalClose() {
  mask.classList.add('hidden');
  modal.classList.add('hidden');

  // 配列から列名以外を削除
  chartItems.splice(1, chartItems.length - 1);

  // 内訳をリセット
  while (itemSumTable.lastChild) {
    itemSumTable.removeChild(itemSumTable.lastChild);
  }
}

// 見出し横の編集ボタンをクリック
editingMenuBtn.addEventListener('click', () => {
  editingMask.classList.remove('hidden');
  editingModal.classList.remove('hidden');
});


// 編集メニュークリック
selectEditing.addEventListener('click', () => {
  if (selectCreating.classList.contains('current-edit')) {
    // 追加画面からの遷移
    // 画面を非表示に
    selectCreating.classList.remove('current-edit');
    creatingItem.classList.add('hidden');
  }

  // 編集画面をリセット
  while (editingUl.lastChild) {
    editingUl.lastChild.remove();
  }

  selectEditing.classList.add('current-edit');
  editingItems.classList.remove('hidden');

  // 編集フォームを作成
  createEditList();
});

// 追加メニュークリック
selectCreating.addEventListener('click', () => {
  if (selectEditing.classList.contains('current-edit')) {
    // 編集画面からの遷移
    // 画面を非表示に
    selectEditing.classList.remove('current-edit');
    editingItems.classList.add('hidden');
  }

  selectCreating.classList.add('current-edit');
  creatingItem.classList.remove('hidden');

});

// 追加実行ボタンクリック
createBtn.addEventListener('click', () => {
  const name = document.getElementById('new-name');
  const price = document.getElementById('new-price');
  if (name.value === '' || price.value === '') {
    // 未入力なら処理しない
    alert('データを入力してください..');
    return;
  }

  // フォーム送信
  const createForm = document.getElementById('add-form');
  createForm.submit();
});

// 編集実行ボタンクリック
editBtn.addEventListener('click', () => {
  if (!confirm('購入品リストを編集しますか？')) {
    return;
  }
  
  // サーバー送信用
  for (let i = 0; i < editingUl.children.length; i++) {
    const inputItemName = document.createElement('input');
    inputItemName.type = 'hidden';
    inputItemName.name = `edit[${i}][editName]`;
    inputItemName.value = editingUl.children[i].children[0].value;

    const inputItemPrice = document.createElement('input');
    inputItemPrice.type = 'hidden';
    inputItemPrice.name = `edit[${i}][editPrice]`;
    inputItemPrice.value = editingUl.children[i].children[2].value;

    const inputItemDelete = document.createElement('input');
    inputItemDelete.type = 'hidden';
    inputItemDelete.name = `edit[${i}][editDelete]`;
    inputItemDelete.value = editingUl.children[i].children[4].checked;

    const inputItemId = document.createElement('input');
    inputItemId.type = 'hidden';
    inputItemId.name = `edit[${i}][editId]`;
    inputItemId.value = editingUl.children[i].children[0].dataset.id;

    editListForm.appendChild(inputItemName);
    editListForm.appendChild(inputItemPrice);
    editListForm.appendChild(inputItemDelete);
    editListForm.appendChild(inputItemId);
  }

  editListForm.submit();

  // const newItems = [];
  // for (let i = 0; i < editingUl.children.length; i++) {

  //   // 削除項目はリストから外しので飛ばす
  //   if (editingUl.children[i].children[4].checked) {
  //     continue;
  //   }

  //   // 編集された品名と価格を取得
  //   const editedName = editingUl.children[i].children[0].value;
  //   const editedPrice = editingUl.children[i].children[2].value;

  //   // 登録リストに編集を反映
  //   recordItems.forEach(item => {
  //     // 登録されているか確認
  //     if (item.name !== items[i].name) {
  //       return;
  //     }

  //     item.name = editedName;
  //     item.price = editedPrice;
  //   });

  //   newItems.push({
  //     name: editedName,
  //     price: editedPrice
  //   });
  // }

  // // 今の購入品リストに上書き
  // items = newItems;

  // alert('購入品リストの編集が完了しました!');
  // // 画面をリロードして編集を反映
  // window.location.reload();
});

// キャンセルボタンクリック 
canselBtn.addEventListener('click', () => {
  editModalClose();
});

// マスククリック
editingMask.addEventListener('click', () => {
  editModalClose();
});

// 編集モーダルを閉じる
function editModalClose() {
  if (!confirm('編集をやめますか？')) {
    return;
  }

  selectCreating.classList.remove('current-edit');
  creatingItem.classList.add('hidden');

  selectEditing.classList.remove('current-edit');
  editingItems.classList.add('hidden');

  editingMask.classList.add('hidden');
  editingModal.classList.add('hidden');
}

// 編集用のリストを作成
function createEditList() {
  items.forEach(item => {
    const li = document.createElement('li');

    const name = document.createElement('input');
    name.type = 'text';
    name.value = item.name;
    name.dataset.id = item.id;
    name.addEventListener('input', () => {
      // 編集があった項目に色をつける
      if (name.value !== item.name) {
        name.classList.add('edit-check')
      } else {
        name.classList.remove('edit-check')
      }
    });

    const price = document.createElement('input');
    price.classList.add('edit-item-price');
    price.type = 'number';
    price.value = item.price;
    price.addEventListener('input', () => {
      if (price.value !== String(item.price)) {
        price.classList.add('edit-check')
      } else {
        price.classList.remove('edit-check')
      }
    });

    const priceSpan = document.createElement('span');
    priceSpan.classList.add('edit-item-price');
    priceSpan.textContent = '¥ ';

    const deleteCheck = document.createElement('input');
    deleteCheck.classList.add('delete-check');
    deleteCheck.type = 'checkbox';

    const deleteSpan = document.createElement('span');
    deleteSpan.classList.add('delete-check');
    deleteSpan.textContent = '削除 ';

    li.appendChild(name);
    li.appendChild(priceSpan);
    li.appendChild(price);
    li.appendChild(deleteSpan);
    li.appendChild(deleteCheck);
    editingUl.appendChild(li);
  });
}
