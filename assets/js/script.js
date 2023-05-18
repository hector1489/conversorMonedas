const urlApi = `https://mindicador.cl/api`
const filterCurrencies = ['dolar', 'euro', 'uf'];
const divResult = document.querySelector('#result');
const selectWithCurrencies = document.querySelector('#currency')
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const grafico = document.getElementById('myChart');
let showgraph = '';


// obtener las monedas de la API
const getCurrencies = async () => {
    try {
        const reqCurrencies = await fetch(urlApi);
        const resData = await reqCurrencies.json();

// codigo de monedas
        const currencyList = filterCurrencies.map((currency) => {
            return {
                code: resData[currency].codigo,
                value: resData[currency].valor,
            }
        });
// mostrar las monedas
        currencyList.forEach((currency) => {
            const option = document.createElement('option');
            option.value = currency.value;
            option.text = capitalize(currency.code);
            selectWithCurrencies.appendChild(option);
        });
    } catch (error) {
        console.log(error);
        alert('Error al Obtener las Monedas')
    }
};


// calcular el resultado
const calcResult = (amount, currency) => {
    divResult.innerHTML = `$ ${(amount / currency).toFixed(2)} .-`;
};

//grafico
const drawChart = async (currency) => {
    try {
        const reqChart = await fetch(`${urlApi}/${currency}`);
        const dataChart = await reqChart.json();

        const serieToChart = dataChart.serie.slice(0, 10);
        console.log(serieToChart);

 // crear grafico
        const data = {
            labels: serieToChart.map((item) => item.fecha.substring(0, 10)),
            datasets: [{
                label: currency,
                data: serieToChart.map((item) => item.valor),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };
        const config = {
            type: 'line',
            data: data,
        };

        showgraph += `<canvas id="chart"></canvas>`
        grafico.innerHTML = showgraph;
        showgraph = '';
        new Chart(document.getElementById('chart'),config);


    } catch (error) {
        alert('Error al Obtener Gráfico')
        console.log(error);
    }

}
//escuchar
document.querySelector('#btnConvert').addEventListener('click', () => {
    const amountPesos = document.querySelector('#pesos').value;
    if (amountPesos === '') {
        alert('Debe ingresar un numero en Pesos-CLP');
        return;
    }
    const currencySelected = selectWithCurrencies.value;
    const codeCurrencySelected =
        selectWithCurrencies.options[selectWithCurrencies.selectedIndex
        ].text.toLowerCase();

    calcResult(amountPesos, currencySelected);
    drawChart(codeCurrencySelected);
});


getCurrencies();