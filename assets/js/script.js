const divResult = document.querySelector('#result');
const selectWithCurrencies = document.querySelector('#currency');
const grafico = document.getElementById('myChart');
const convertButton = document.querySelector('#btnConvert');
const pesos = document.querySelector('#pesos');

const urlBase = 'https://mindicador.cl/api';
const filterCurrencies = ['dolar', 'euro', 'uf'];

let showgraph = '';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getData = async (url) => {
    const response = await fetch(url);
    return await response.json();
};

const getCurrencies = async () => {
    try {
        const myData = await getData(urlBase);
        const currencyList = filterCurrencies.map((currency) => ({
            code: myData[currency].codigo,
            value: myData[currency].valor,
        }));

        currencyList.forEach((currency) => {
            const option = document.createElement('option');
            option.value = currency.value;
            option.text = capitalize(currency.code);
            selectWithCurrencies.appendChild(option);
        });
    } catch (error) {
        console.log(error);
        alert('Error al obtener las Monedas');
    }
};

const calcResult = (amount, currency) => {
    divResult.innerHTML = `$ ${(amount / currency).toFixed(2)} .-`;
};

const drawChart = async (currency) => {
    try {
        const myData = await getData(`${urlBase}/${currency}`);
        const serieToChart = myData.serie.slice(0, 10);

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

        showgraph = '<canvas id="chart"></canvas>';
        grafico.innerHTML = showgraph;
        showgraph = '';
        new Chart(document.getElementById('chart'), config);
    } catch (error) {
        alert('Error al obtener el Gráfico');
        console.log(error);
    }
};

convertButton.addEventListener('click', async () => {
    const amountPesos = pesos.value;
    if (amountPesos === '') return alert('Debe ingresar un número en Pesos-CLP');

    const currencySelected = selectWithCurrencies.value;
    const codeCurrencySelected =
        selectWithCurrencies.options[selectWithCurrencies.selectedIndex].text.toLowerCase();

    calcResult(amountPesos, currencySelected);
    await drawChart(codeCurrencySelected);
});

getCurrencies();


/*
ordenar
optimice el if
cambio de lugar fetch para llamrlo una vez
agrupar variables: div result. selectwithcurrencies.grafico
extraje propiedades del codigo y valor en get currency
cambio restData por myData
*/