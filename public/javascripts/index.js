'use strict'

let contractAddress = $('#contractAddress');
let deployedContractAddressInput = $('#deployedContractAddressInput');
let loadDeployedContractButton = $('#loadDeployedContractButton');
let deployNewContractButton = $('#deployNewContractButton');

let killContractButton = $('#killContractButton')

let whoami = $('#whoami');
let whoamiButton = $('#whoamiButton');
let copyButton = $('#copyButton');

let update = $('#update');

let logger = $('#logger');

let deposit = $('#deposit');
let depositButton = $('#depositButton');

let withdraw = $('#withdraw');
let withdrawButton = $('#withdrawButton');

let transferEtherTo = $('#transferEtherTo');
let transferEtherValue = $('#transferEtherValue');
let transferEtherButton = $('#transferEtherButton');

//鑄 NCCU Coin
let mintCoinValue = $('#mintCoinValue');
let mintButton = $('#mintButton');
//購買 NCCU Coin
let buyCoinValue = $('#buyCoinValue');
let buyButton = $('#buyButton');
//轉帳 NCCU Coin
let transferCoinTo = $('#transferCoinTo');
let transferCoinValue = $('#transferCoinValue');
let transferCoinButton = $('#transferCoinButton');
//檢查 Owner
let ownerText = $('#ownerText');
let ownerButton = $('#ownerButton');
//轉移 Owner
let transferOwner = $('#transferOwner');
let transferOwnerButton = $('#transferOwnerButton');
//轉帳 ETH(進階功能)
let transferEtherToAdvanced = $('#transferEtherToAdvanced');
let transferEtherValuelAdvanced = $('#transferEtherValueAdvanced');
let transferEtherAdvancedButton = $('#transferEtherAdvancedButton');

let bankAddress = "";
let nowAccount = "";

function log(...inputs) {
	for (let input of inputs) {
		if (typeof input === 'object') {
			input = JSON.stringify(input, null, 2)
		}
		logger.html(input + '\n' + logger.html())
	}
}

// 載入使用者至 select tag
$.get('/accounts', function (accounts) {
	for (let account of accounts) {
		whoami.append(`<option value="${account}">${account}</option>`)
	}
	nowAccount = whoami.val();

	update.trigger('click')

	log(accounts, '以太帳戶')
})

// 當按下載入既有合約位址時
loadDeployedContractButton.on('click', function () {
	loadBank(deployedContractAddressInput.val())
})

// 當按下部署合約時
deployNewContractButton.on('click', function () {
	newBank()
})

// 當按下登入按鍵時
whoamiButton.on('click', async function () {

	nowAccount = whoami.val();

	update.trigger('click')

})

// 當按下複製按鍵時
copyButton.on('click', function () {
	let textarea = $('<textarea />')
	textarea.val(whoami.val()).css({
		width: '0px',
		height: '0px',
		border: 'none',
		visibility: 'none'
	}).prependTo('body')

	textarea.focus().select()

	try {
		if (document.execCommand('copy')) {
			textarea.remove()
			return true
		}
	} catch (e) {
		console.log(e)
	}
	textarea.remove()
	return false
})

// 當按下更新按鍵時
update.on('click', function () {
	if (bankAddress != "") {
		$.get('/allBalance', {
			address: bankAddress,
			account: nowAccount
		}, function (result) {
			log({
				address: nowAccount,
				ethBalance: result.ethBalance,
				bankBalance: result.bankBalance,
				coinBalance: result.coinBalance
			})
			log('更新帳戶資料')

			$('#ethBalance').text('以太帳戶餘額 (wei): ' + result.ethBalance)
			$('#bankBalance').text('銀行ETH餘額 (wei): ' + result.bankBalance)
			$('#coinBalance').text('NCCU Coin餘額: ' + result.coinBalance);
		})
	}
	else {
		$.get('/balance', {
			account: nowAccount
		}, function (result) {
			$('#ethBalance').text('以太帳戶餘額 (wei): ' + result.ethBalance)
			$('#bankBalance').text('銀行ETH餘額 (wei): ')
		})
	}
})

// 當按下刪除合約按鈕時
killContractButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面 
	waitTransactionStatus();
	// 刪除合約
	$.post('/kill', {
		address: bankAddress,
		account: nowAccount
	}, function (result) {
		if (result.transactionHash !== undefined) {
			log(bankAddress, '成功刪除合約');

			bankAddress = "";
			contractAddress.text('合約位址:' + bankAddress)
			deployedContractAddressInput.val(bankAddress)

			// 觸發更新帳戶資料
			update.trigger('click');

			// 更新介面 
			doneTransactionStatus();
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus();

		}
	})
})

// 當按下存款按鍵時
depositButton.on('click', async function () {

	if (bankAddress == "") {
		return
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return
	}

	// 更新介面 
	waitTransactionStatus();
	// 存款
	$.post('/deposit', {
		address: bankAddress,
		account: nowAccount,
		value: deposit.val()
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.DepositEvent.returnValues, '存款成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})

})

// 當按下提款按鍵時
withdrawButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 提款
	$.post('/withdraw', {
		address: bankAddress,
		account: nowAccount,
		value: parseInt(withdraw.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.WithdrawEvent.returnValues, '提款成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})

// 當按下轉帳按鍵時
transferEtherButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 轉帳
	$.post('/transfer', {
		address: bankAddress,
		account: nowAccount,
		to: transferEtherTo.val(),
		value: parseInt(transferEtherValue.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.TransferEvent.returnValues, '轉帳成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})

//鑄 NCCU Coin
mintButton.on('click', async function () {
	if (bankAddress == '') {
		return;
	}
	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}
	// 更新介面
	waitTransactionStatus();
	// 轉帳
	$.post(
		'/mintCoin', {
			address: bankAddress,
			account: nowAccount,
			value: parseInt(mintCoinValue.val(), 10)
		},
		function (result) {
			if (result.events !== undefined) {
				log(result.events.MintEvent.returnValues, '鑄 NCCU Coin 成功');

				// 觸發更新帳戶資料
				update.trigger('click');

				// 更新介面
				doneTransactionStatus();
			} else {
				log(result);
				// 更新介面
				doneTransactionStatus();
			}
		}
	);
});

//購買 NCCU Coin
buyButton.on('click', async function () {
	if (bankAddress == '') {
		return;
	}
	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}
	// 更新介面
	waitTransactionStatus();

	$.post(
		'/buyCoin', {
			address: bankAddress,
			account: nowAccount,
			value: parseInt(buyCoinValue.val(), 10)
		},
		function (result) {
			if (result.events !== undefined) {
				log(result.events.BuyCoinEvent.returnValues, '購買 NCCU Coin成功');

				// 觸發更新帳戶資料
				update.trigger('click');

				// 更新介面
				doneTransactionStatus();
			} else {
				log(result);
				// 更新介面
				doneTransactionStatus();
			}
		}
	);
});

//轉帳 NCCU Coin
transferCoinButton.on('click', async function () {
	if (bankAddress == '') {
		return;
	}
	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}
	// 更新介面
	waitTransactionStatus();
	// 轉帳
	$.post(
		'/transferCoin', {
			address: bankAddress,
			account: nowAccount,
			to: transferCoinTo.val(),
			value: parseInt(transferCoinValue.val(), 10)
		},
		function (result) {
			if (result.events !== undefined) {
				log(result.events.TransferCoinEvent.returnValues, '轉帳 NCCU Coin成功');

				// 觸發更新帳戶資料
				update.trigger('click');

				// 更新介面
				doneTransactionStatus();
			} else {
				log(result);
				// 更新介面
				doneTransactionStatus();
			}
		}
	);
});

//檢查 Owner
ownerButton.on('click', function () {
	if (bankAddress == '') {
		return;
	}

	// // 解鎖
	// let unlock = await unlockAccount();
	// if (!unlock) {
	// 	return
	// }

	// // 更新介面 
	// waitTransactionStatus();

	$.get(
		'/owner', {
			address: bankAddress,
			account: nowAccount
		},
		function (result) {
			$('#ownerText').text('Owner帳戶:' + result);
			console.log(result);
		}
	);
});

//轉移 Owner
transferOwnerButton.on('click', async function () {
	if (bankAddress == '') {
		return;
	}
	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}
	// 更新介面
	waitTransactionStatus();

	$.post(
		'/transferOwner', {
			address: bankAddress,
			account: nowAccount,
			newowner: transferOwner.val()
		},
		function (result) {
			if (result.events !== undefined) {
				log(result.events.TransferOwnerEvent.returnValues, '轉移Owner成功');
				// 觸發更新帳戶資料
				update.trigger('click');
				// 更新介面
				doneTransactionStatus();
			} else {
				log(result);
				// 更新介面
				doneTransactionStatus();
			}
		}
	);
});

//轉帳 ETH(進階功能)
transferEtherAdvancedButton.on('click', async function () {
	if (bankAddress == '') {
		return;
	}
	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}
	// 更新介面
	waitTransactionStatus();
	// 轉帳
	$.post(
		'/transferAdvanced', {
			address: bankAddress,
			account: nowAccount,
			to: transferEtherToAdvanced.val(),
			value: parseInt(transferEtherValueAdvanced.val(), 10)
		},
		function (result) {
			if (result.events !== undefined) {
				log(
					result.events.TransferAdvancedEvent.returnValues,
					'轉帳 ETH(進階功能)成功'
				);

				// 觸發更新帳戶資料
				update.trigger('click');

				// 更新介面
				doneTransactionStatus();
			} else {
				log(result);
				// 更新介面
				doneTransactionStatus();
			}
		}
	);
});

// 載入bank合約
function loadBank(address) {
	if (!(address === undefined || address === null || address === '')) {
		$.get('/contract', {
			address: address
		}, function (result) {
			if (result.bank != undefined) {
				bankAddress = address;

				contractAddress.text('合約位址:' + address)
				log(result.bank, '載入合約')

				update.trigger('click')
			}
			else {
				log(address, '載入失敗')
			}
		})
	}
}

// 新增bank合約
async function newBank() {

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()

	$.post('/deploy', {
		account: nowAccount
	}, function (result) {
		if (result.contractAddress) {
			log(result, '部署合約')

			// 更新合約介面
			bankAddress = result.contractAddress
			contractAddress.text('合約位址:' + result.contractAddress)
			deployedContractAddressInput.val(result.contractAddress)

			update.trigger('click');

			// 更新介面
			doneTransactionStatus();
		}
	})
}

function waitTransactionStatus() {
	$('#accountStatus').html('帳戶狀態 <b style="color: blue">(等待交易驗證中...)</b>')
}

function doneTransactionStatus() {
	$('#accountStatus').text('帳戶狀態')
}


async function unlockAccount() {
	let password = prompt("請輸入你的密碼", "");
	if (password == null) {
		return false;
	}
	else {
		return $.post('/unlock', {
			account: nowAccount,
			password: password
		})
			.then(function (result) {
				if (result == 'true') {
					return true;
				}
				else {
					alert("密碼錯誤")
					return false;
				}
			})
	}
}