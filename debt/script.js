document.addEventListener('DOMContentLoaded', function () {
  var picker = new Pikaday({
    field: document.getElementById('startDate'),
    format: 'YYYY-MM-DD'
  });
});

var debts = [];

function addDebt() {
  var amount = parseFloat(document.getElementById("amount").value);
  var months = parseInt(document.getElementById("months").value);
  var startDate = document.getElementById("startDate").value;

  if (isNaN(amount) || isNaN(months) || !startDate) {
    alert("请输入有效的债务金额、分期月数和开始日期！");
    return;
  }

  debts.push({ amount: amount, months: months, startDate: new Date(startDate) });

  updateDebtList();
  calculateTotalPerMonth();
}

function deleteDebt(index) {
  debts.splice(index, 1);
  updateDebtList();
  calculateTotalPerMonth();
}

function updateDebtList() {
  var debtList = document.getElementById("debtList");
  debtList.innerHTML = "";

  debts.forEach(function (debt, index) {
    var item = document.createElement("div");
    item.classList.add("debt-item");

    var details = "债务 " + (index + 1) + ": ￥" + debt.amount + " / "
      + debt.months + " 个月，开始日期：" + debt.startDate.toISOString().split('T')[0];
    var deleteButton = "<button onclick='deleteDebt(" + index + ")'>删除</button>";

    item.innerHTML = details + deleteButton;
    debtList.appendChild(item);
  });
}

function calculateDebtForSpecificMonth(year, month) {
  var totalDebt = 0;
  var specificDate = new Date(year, month - 1);

  debts.forEach(function (debt) {
    var debtDate = new Date(debt.startDate);
    var monthDiff = (specificDate.getFullYear() - debtDate.getFullYear()) * 12 + (specificDate.getMonth() - debtDate.getMonth());

    if (monthDiff >= 0 && monthDiff < debt.months) {
      totalDebt += (debt.amount / debt.months);
    }
  });

  alert("在 " + year + "年" + month + "月，您需要偿还的债务总额为：￥" + totalDebt.toFixed(2));
}

function exportToJsonFile() {
  var dataStr = JSON.stringify(debts.map(function (debt) {
    return {
      amount: debt.amount,
      months: debt.months,
      startDate: debt.startDate.toISOString().split('T')[0]
    };
  }));

  var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  var exportFileDefaultName = 'debts.json';
  var linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function importFromJsonFile() {
  document.getElementById('fileInput').click();
}

function handleFileUpload(event) {
  var file = event.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var contents = e.target.result;
      try {
        var importedDebts = JSON.parse(contents);

        debts = importedDebts.map(function (debt) {
          debt.startDate = new Date(debt.startDate);
          return debt;
        });

        updateDebtList();
        calculateTotalPerMonth();
      } catch (e) {
        alert('导入文件时发生错误：' + e.message);
      }
    };
    reader.readAsText(file);
  }
}

function updateDebtList() {
  var debtList = document.getElementById("debtList");
  debtList.innerHTML = ""; // 清空债务列表

  if (debts.length > 0) {
    // 如果债务列表不为空，则显示标题
    var title = document.createElement("h3");
    title.textContent = "债务列表:";
    debtList.appendChild(title);
  }

  debts.forEach(function (debt, index) {
    var item = document.createElement("div");
    item.classList.add("debt-item");

    var details = "债务 " + (index + 1) + ": ￥" + debt.amount + " / "
      + debt.months + " 个月，开始日期：" + debt.startDate.toISOString().split('T')[0];
    var deleteButton = "<button onclick='deleteDebt(" + index + ")'>删除</button>";

    item.innerHTML = details + deleteButton;
    debtList.appendChild(item);
  });
}
