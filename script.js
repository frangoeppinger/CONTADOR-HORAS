document.getElementById('dias').addEventListener('input', function() {
    let dias = parseInt(this.value);
    let entradas = document.getElementById('entradas');
    entradas.innerHTML = '';

    for (let i = 1; i <= dias; i++) {
        entradas.innerHTML += `
        <div class="dia-container">
            <h3>Día ${i}</h3>
            <label for="ingreso${i}">Hora de ingreso:</label>
            <input type="time" id="ingreso${i}">
            
            <label for="colacion${i}">Hora de colación:</label>
            <input type="time" id="colacion${i}">
            
            <label for="regreso${i}">Hora de regreso de colación:</label>
            <input type="time" id="regreso${i}">
            
            <label for="salida${i}">Hora de salida:</label>
            <input type="time" id="salida${i}">
            
            <label for="salidaDiaSiguiente${i}">¿Salida al día siguiente?</label>
            <input type="checkbox" id="salidaDiaSiguiente${i}">
        </div>
        `;
    }
});

document.getElementById('calcular').addEventListener('click', function() {
    let dias = parseInt(document.getElementById('dias').value);
    let resultados = [];
    let totalMinutos = 0;

    for (let i = 1; i <= dias; i++) {
        let ingreso = document.getElementById(`ingreso${i}`).value;
        let colacion = document.getElementById(`colacion${i}`).value;
        let regreso = document.getElementById(`regreso${i}`).value;
        let salida = document.getElementById(`salida${i}`).value;
        let salidaDiaSiguiente = document.getElementById(`salidaDiaSiguiente${i}`).checked;

        if (ingreso && colacion && regreso && salida) {
            let minutosTrabajados = calcularHoras(ingreso, colacion, regreso, salida, salidaDiaSiguiente);
            resultados.push(`Día ${i}: ${convertirMinutosAHHMM(minutosTrabajados)}`);
            totalMinutos += minutosTrabajados;
        } else {
            alert(`Por favor, completa todos los campos del Día ${i}.`);
            return; 
        }
    }

    mostrarResultados(resultados, convertirMinutosAHHMM(totalMinutos));
});

function calcularHoras(ingreso, colacion, regreso, salida, salidaDiaSiguiente) {
    let ingresoDate = new Date(`1970-01-01T${ingreso}:00`);
    let colacionDate = new Date(`1970-01-01T${colacion}:00`);
    let regresoDate = new Date(`1970-01-01T${regreso}:00`);
    let salidaDate = new Date(`1970-01-01T${salida}:00`);

    if (salidaDiaSiguiente) {
        salidaDate.setDate(salidaDate.getDate() + 1); 
    }

    let minutosAntesColacion = (colacionDate - ingresoDate) / 1000 / 60; 
    let minutosDespuesColacion = (salidaDate - regresoDate) / 1000 / 60; 

    return minutosAntesColacion + minutosDespuesColacion;
}

function convertirMinutosAHHMM(minutos) {
    let horas = Math.floor(minutos / 60);
    let mins = minutos % 60;
    return `${horas.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

function mostrarResultados(resultados, totalHoras) {
    let resultadosDiv = document.getElementById('resultados');
    let totalDiv = document.getElementById('total');
    
    resultadosDiv.innerHTML = resultados.join('<br>');
    totalDiv.innerHTML = `Total de horas trabajadas: ${totalHoras}`;
}