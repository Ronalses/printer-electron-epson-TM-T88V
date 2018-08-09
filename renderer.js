// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron')

document.querySelector('#form').addEventListener('submit', async (e)=> {
    e.preventDefault()
    // Obtener la impresora actual
    let currentPrinter = await getDetaultPrinter()

    // check if the printer is disconect
    if (currentPrinter.status === 4096) {
        printerIsNotConect()
        return
    } else if((currentPrinter.status !== 0)) {
        printerIsnotAvaliable()
        return
    }

    let title = document.getElementById('title').value
    let name = document.getElementById('name').value
    let numbers = document.getElementById('numbers').value

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
    let arrHtml = [htmlBoleto]
    
    /**
     * returns the data from the printed files
     */
    imprimir(arrHtml).then(resData=> {
        console.log(resData)
    })

    // reset value of form
    e.target.reset()
})

function imprimir(arrHtml){
    console.log(arrHtml instanceof Array)
    if (!(arrHtml instanceof Array)) throw 'Este argumento debe ser un Array'
    ipcRenderer.send('print', arrHtml)
    return new Promise((resolve, reject) => {
        ipcRenderer.on('res-print',(event, arg) => {
            console.log(arg)
        })
    })
}

function getDetaultPrinter(){
    ipcRenderer.send('getDetaultPrinter')
    return new Promise((resolve, reject)=> {
        ipcRenderer.on('res-getDetaultPrinter', (event, arg)=> {
            resolve(arg)
        })
    })
}

function printerIsnotAvaliable(){
    alert('La impresora esta ocupada')
}

function printerIsNotConect(){
    alert('La impresora esta desconectada') 
}
