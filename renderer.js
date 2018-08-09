// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron')

ipcRenderer.send('getPrinters')

document.querySelector('#form').addEventListener('submit', (e)=> {
    e.preventDefault()
    let title = document.getElementById('title').value
    let name = document.getElementById('name').value
    let numbers = document.getElementById('numbers').value

    console.log(title, name, numbers)
    let htmlBoleto = `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Hello World!</title>
            <style>
                * {
                    font-size: 12px;
                    font-family: 'Times New Roman';
                    }

                    td,
                    th,
                    tr,
                    table {
                    border-top: 1px solid black;
                    border-collapse: collapse;
                    }

                    td.producto,
                    th.producto {
                    width: 75px;
                    max-width: 75px;
                    }

                    td.cantidad,
                    th.cantidad {
                    width: 40px;
                    max-width: 40px;
                    word-break: break-all;
                    }

                    td.precio,
                    th.precio {
                    width: 40px;
                    max-width: 40px;
                    word-break: break-all;
                    }

                    .centrado {
                    text-align: center;
                    align-content: center;
                    }

                    .ticket {
                    width: 155px;
                    max-width: 155px;
                    }

                    img {
                    max-width: inherit;
                    width: inherit;
                    }

                    @media print{
                    .oculto-impresion, .oculto-impresion *{
                        display: none !important;
                    }
                    }
            </style>
        </head>
        <body>
            <div class="ticket">
                <img src="https://yt3.ggpht.com/-3BKTe8YFlbA/AAAAAAAAAAI/AAAAAAAAAAA/ad0jqQ4IkGE/s900-c-k-no-mo-rj-c0xffffff/photo.jpg" alt="Logotipo">
                <p class="centrado">${title}
                <br>${name} :) <3
                <br>${numbers}</p>
                <table>
                <thead>
                    <tr>
                    <th class="cantidad">CANT</th>
                    <th class="producto">PRODUCTO</th>
                    <th class="precio">$$</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td class="cantidad">1.00</td>
                    <td class="producto">CHEETOS VERDES 80 G</td>
                    <td class="precio">$8.50</td>
                    </tr>
                    <tr>
                    <td class="cantidad">2.00</td>
                    <td class="producto">KINDER DELICE</td>
                    <td class="precio">$10.00</td>
                    </tr>
                    <tr>
                    <td class="cantidad">1.00</td>
                    <td class="producto">COCA COLA 600 ML</td>
                    <td class="precio">$10.00</td>
                    </tr>
                    <tr>
                    <td class="cantidad"></td>
                    <td class="producto">TOTAL</td>
                    <td class="precio">$28.50</td>
                    </tr>
                </tbody>
                </table>
                <p class="centrado">¡GRACIAS POR SU COMPRA!
                <br>parzibyte.me</p>
            </div>
        </body>
        </html>
`
    imprimir(htmlBoleto)
    e.target.reset()
})

function imprimir(htmlBoleto){
    ipcRenderer.send('print', htmlBoleto)
}

ipcRenderer.on('res-printers', (event, arg)=> {
    console.log(arg)
})
