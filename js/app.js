// Si estás usando xrpl.js, asegúrate de tener la librería cargada
const xrpl = require('xrpl');

// Elementos del DOM
const sendXrpButton = document.getElementById('sendXrpButton');
const xrpToAddress = document.getElementById('xrp-toAddress');
const xrpAmount = document.getElementById('xrp-amount');
const xrpBalance = document.getElementById('xrp-balance');

// Función para obtener la cuenta conectada
async function getAccount() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Conexión con MetaMask (o cualquier wallet que implemente Web3)
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0]; // Usamos la primera cuenta
            return account;
        } catch (err) {
            console.error("User denied account access");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// Función para obtener el balance de XRP
async function getXrpBalance(address) {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233"); // Usamos la red de prueba (testnet)
    await client.connect();
    
    const accountInfo = await client.request({
        command: 'account_info',
        account: address,
        strict: true
    });
    
    const balanceDrops = accountInfo.result.account_data.Balance;
    const balanceXrp = xrpl.dropsToXrp(balanceDrops); // Convertimos los drops a XRP
    xrpBalance.innerText = `Balance: ${balanceXrp} XRP`;

    await client.disconnect();
}

// Función para enviar XRP
async function sendXrp(fromAddress, toAddress, amount) {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    const preparedTx = await client.autofill({
        TransactionType: "Payment",
        Account: fromAddress,
        Destination: toAddress,
        Amount: xrpl.xrpToDrops(amount), // Convertimos XRP a drops
        Fee: "12", // Comisiones estándar
        Flags: 2147483648, // Transacción normal
        Sequence: await client.getNextSequenceNumber(fromAddress)
    });

    const signedTx = client.sign(preparedTx, "YOUR_PRIVATE_KEY"); // Asegúrate de usar la clave privada correcta aquí
    const result = await client.submit(signedTx.tx_blob);

    if (result.resultCode === "tesSUCCESS") {
        alert("Transaction successful!");
    } else {
        alert("Transaction failed!");
    }

    await client.disconnect();
}

// Evento de clic en el botón "Send XRP"
sendXrpButton.addEventListener('click', async () => {
    const fromAddress = await getAccount(); // Obtener la cuenta conectada
    const toAddress = xrpToAddress.value;
    const amount = xrpAmount.value;

    if (toAddress && amount) {
        // Validar que la dirección de destino y la cantidad sean correctas
        if (xrpl.utils.isValidXAddress(toAddress)) {
            sendXrp(fromAddress, toAddress, amount);
        } else {
            alert("Invalid XRP address!");
        }
    } else {
        alert("Please enter both destination address and amount.");
    }
});
