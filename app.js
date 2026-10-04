const BASE_URL = "https://api.frankfurter.dev/v2";

const dropdowns = document.querySelectorAll(".dropdown select");
const button = document.querySelector("button");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

const fromCurrency = dropdowns[0];
const toCurrency = dropdowns[1];

const fromImage = document.querySelector(".from img");
const toImage = document.querySelector(".to img");


// Load all currencies
async function loadCurrencies() {

    try {
        let response = await fetch(`${BASE_URL}/currencies`);

        let currencies = await response.json();

        currencies.forEach(currency => {

            let option1 = document.createElement("option");
            option1.value = currency.iso_code;
            option1.innerText = currency.iso_code;

            let option2 = document.createElement("option");
            option2.value = currency.iso_code;
            option2.innerText = currency.iso_code;

            fromCurrency.appendChild(option1);
            toCurrency.appendChild(option2);
        });

        fromCurrency.value = "USD";
        toCurrency.value = "INR";

        updateFlag(fromCurrency, fromImage);
        updateFlag(toCurrency, toImage);

    } catch (error) {
        console.log(error);
    }
}


// Update flag only
function updateFlag(select, image) {

    let currencyCode = select.value;

    let countryCode = countryList[currencyCode];

    if (countryCode) {
        image.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
}


// Convert currency ONLY when button is clicked
async function updateExchangeRate() {

    let amount = amountInput.value;

    if (amount === "" || amount < 1) {
        amount = 1;
        amountInput.value = "1";
    }

    if (fromCurrency.value === toCurrency.value) {

        msg.innerText =
            `1 ${fromCurrency.value} = 1 ${toCurrency.value}`;

        return;
    }

    const URL =
        `${BASE_URL}/rate/${fromCurrency.value}/${toCurrency.value}`;

    try {

        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Exchange rate not found");
        }

        let data = await response.json();

        let rate = data.rate;

        let finalAmount = amount * rate;

        msg.innerText =
            `${amount} ${fromCurrency.value} = ${finalAmount.toFixed(2)} ${toCurrency.value}`;

    } catch (error) {

        console.log(error);

        msg.innerText = "Unable to get exchange rate";
    }
}


// BUTTON CLICK → API CALL
button.addEventListener("click", (event) => {

    event.preventDefault();

    updateExchangeRate();

});


// DROPDOWN CHANGE → ONLY FLAG CHANGE
fromCurrency.addEventListener("change", () => {

    updateFlag(fromCurrency, fromImage);

});

toCurrency.addEventListener("change", () => {

    updateFlag(toCurrency, toImage);

});


// Load currencies when page starts
loadCurrencies();