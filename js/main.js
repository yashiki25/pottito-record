'use strict';

const items = [{
  name: 'ウェットフード',
  price: 100
},
{
  name: 'ドライフード',
  price: 850
},
{
  name: 'おやつ',
  price: 200
},
{
  name: 'おもちゃ',
  price: 300
},
{
  name: '猫砂',
  price: 500
},
{
  name: 'つめとぎ',
  price: 400
},
{
  name: '診察代',
  price: 2500
},
]

// 円グラフデータ
const chartItems = [
  ['Item', 'Sum'],
]

let recordItems = []; // 購入品の登録リスト
let total = 0; // 現在の合計金額
let recordNo = 0; // 登録番号

const itemList = document.querySelector('.item-list ul'); // 購入品リスト
const totalPrice = document.getElementById('total-price'); // 合計金額
const buyingHistoryTable = document.querySelector('.buying-history table'); // 購入履歴
const recordBtn = document.getElementById('record'); // 登録ボタン
const openBtn = document.getElementById('open'); // 集計グラフボタン
const mask = document.getElementById('mask');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close');
const itemSumTable = document.querySelector('#modal table');
const noDataText = document.querySelector('.buying-history p');

// 日付を表示
document.querySelector('time').textContent = getFormattedCurrentDate().toTop;

// 購入品リストを生成
createItems();

function createItems() {
  items.forEach((item) => {
    const li = document.createElement('li');

    const spanName = document.createElement('span');
    spanName.classList.add('item-name');
    spanName.textContent = item.name; // 購入品名を設定
    spanName.dataset.name = item.price; // data属性に価格を設定

    const plusBtn = document.createElement('button');
    plusBtn.classList.add('item-num-btn');
    plusBtn.textContent = "+";

    const minusBtn = document.createElement('button');
    minusBtn.classList.add('item-num-btn');
    minusBtn.textContent = "-";

    const numSpan = document.createElement('span');
    numSpan.classList.add('item-num');
    numSpan.textContent = 0;

    li.appendChild(spanName);
    li.appendChild(minusBtn);
    li.appendChild(numSpan);
    li.appendChild(plusBtn);
    itemList.appendChild(li);

    // +ボタンクリック
    plusBtn.addEventListener('click', () => {
      spanName.classList.add('selected-list');
      const nowNum = parseInt(numSpan.textContent, 10);
      numSpan.textContent = nowNum + 1;
    });

    // -ボタンクリック
    minusBtn.addEventListener('click', () => {
      const nowNum = parseInt(numSpan.textContent, 10);
      if (nowNum > 0) {
        numSpan.textContent = nowNum - 1;

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
  if (buyingHistoryTable.classList.contains('hidden')) {
    noDataText.classList.add('hidden');
    buyingHistoryTable.classList.remove('hidden');
  }

  const itemsListChildren = itemList.children;

  for (let i = 0; i < itemsListChildren.length; i++) {
    if (itemsListChildren[i].children[0].classList.contains('selected-list')) {
      const itemName = itemsListChildren[i].children[0].textContent;
      const itemPrice = itemsListChildren[i].children[0].dataset.name;
      const itemNum = parseInt(itemsListChildren[i].children[2].textContent, 10);

      // 購入データを配列に保存
      recordItems.push({
        name: itemName,
        price: itemPrice,
        num: itemNum,
        no: String(recordNo)
      });

      // 購入履歴を作成
      createBuyingHistory(itemName, itemPrice, itemNum);

      // 合計金額に加算
      updateTotalPrice(itemPrice, itemNum);

      // 選択状態を解除
      itemsListChildren[i].children[0].classList.remove('selected-list');
      itemsListChildren[i].children[2].textContent = "0";
    }
  }
});

// 購入履歴の作成
function createBuyingHistory(name, price, num) {
  // 購入履歴テーブルの先頭に新規行を追加
  const newRow = buyingHistoryTable.insertRow(1);
  // 登録したオブジェクトと共通の一意の値を持たせる
  newRow.dataset.name = recordNo;
  recordNo++;

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

    const deleteIndexNo = recordItems.findIndex(e => e.no === newRow.dataset.name);
    // 合計金額から削除する品目の金額を差し引く
    const removePrice = recordItems[deleteIndexNo].price * -1;
    updateTotalPrice(removePrice, recordItems[deleteIndexNo].num);
    // 登録データを配列から削除
    recordItems.splice(deleteIndexNo, 1);

    // テーブルから履歴を削除
    const deleteRowIndex = newRow.rowIndex;
    buyingHistoryTable.deleteRow(deleteRowIndex);

    // ヘッダー行のみになったら非表示にする
    if (buyingHistoryTable.rows.length < 2) {
      noDataText.classList.remove('hidden');
      buyingHistoryTable.classList.add('hidden');
    }
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

  // 登録リストから個々の合計金額を取得
  items.forEach(item => {
    let sum = 0;
    let num = 0;
    recordItems.forEach(recordItem => {
      if (!(item.name === recordItem.name)) {
        return;
      }
      sum += parseInt(recordItem.price * recordItem.num, 10);
      num += parseInt(recordItem.num, 10);
    });

    if (sum < 1) {
      // 登録がなかったら次の処理へ
      return;
    }

    // 内訳を作成
    const newRow = itemSumTable.insertRow(-1);
    const sumDate = [item.name, `× ${num}`, sum];
    sumDate.forEach((data, index) => {
      const newCell = newRow.insertCell(index);
      newCell.textContent = data;

      if (index === 2) {
        // 金額には¥をつける
        newCell.classList.add('buying-price-td');
      }
    });

    // 円グラフのデータに追加
    chartItems.push([item.name, sum]);

    sum = 0;
    num = 0;
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
