//clases
class Vehiculo {
    constructor(id, modelo,anoFabricacion, velMax) {
        
        this.id = id; 
        this.modelo = modelo;
        this.anoFabricacion = anoFabricacion;


        this.velMax = velMax;

    }
    toString() {
        return `Vehiculo [ID: ${this.id}, modelo: ${this.modelo},  anoFabricacion: ${this.anoFabricacion}, velMax: ${this.velMax}`;
    }
}

class Auto extends Vehiculo {
    constructor(id, modelo,anoFabricacion, velMax, cantidadPuertas, asientos) {
        super(id, modelo,anoFabricacion, velMax);

        this.cantidadPuertas = cantidadPuertas;
        if (typeof cantidadPuertas !== 'number' || anoFabricacion <= 2) {
            throw new Error("anoFabricacion debe ser un número mayor a 2");
        }
        this.asientos = asientos;

    }

    toString() {
        return `${super.toString()} - cantidadPuertas: ${this.cantidadPuertas},  asientos: ${this.asientos}`;
    }
}
class Camion extends Vehiculo {
    constructor(id, modelo,anoFabricacion, velMax, carga, autonomia) {
        super(id, modelo,anoFabricacion, velMax);

        this.carga = carga;

        this.autonomia = autonomia;


    }

    toString() {
        return `${super.toString()} - carga: ${this.carga}, autonomia: ${this.autonomia}`;
    }
}
//funciones
let Vehiculos = [
];

function cargarVehiculos() {
    console.log("Iniciando carga de Vehiculos...");
    mostrarSpinner(); 

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://examenesutn.vercel.app/api/VehiculoAutoCamion', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log("Solicitud completada, ocultando spinner...");
            ocultarSpinner(); 

            if (xhr.status === 200) {
                console.log("Datos recibidos:", xhr.responseText);
                const respuesta = JSON.parse(xhr.responseText);
                
                respuesta.forEach(obj => {
                    if ('cantidadPuertas' in obj  && 'asientos' in obj) {
                        Vehiculos.push(new Auto(obj.id, obj.modelo, obj.anoFabricacion, obj.velMax, obj.cantidadPuertas,  obj.asientos));
                    } else {
                        try {
                            Vehiculos.push(new Camion(obj.id, obj.modelo, obj.anoFabricacion, obj.velMax, obj.carga, obj.autonomia));
                        } catch (error) {
                            console.error('Error al crear Camion:', error.message);
                        }
                    }
                });

                actualizarEncabezados();
                rellenarTabla();

                document.querySelectorAll('#tabla-Vehiculos thead').forEach(thead => {
                    thead.addEventListener('click', evento => {
                        if (evento.target.tagName === 'TH') {
                            const indiceColumna = Array.from(evento.target.parentNode.children).indexOf(evento.target);
                            ordenarTabla(indiceColumna);
                        }
                    });
                });
            } else {
                alert("Hubo un problema al obtener los datos: " + xhr.status);
            }
        }
    };

    xhr.send(); 
}

function actualizarEncabezados() {
    const thead = document.querySelector("#tabla-Vehiculos thead tr");
    thead.innerHTML = '';

    document.querySelectorAll("#checklist input[type='checkbox']:checked").forEach(checkbox => {
        const th = document.createElement('th');
        th.textContent = checkbox.parentElement.textContent.trim();
        thead.appendChild(th);
    });

    const modificarTh = document.createElement('th');
    modificarTh.textContent = 'Modificar';
    thead.appendChild(modificarTh);

    const eliminarTh = document.createElement('th');
    eliminarTh.textContent = 'Eliminar';
    thead.appendChild(eliminarTh);
}

function rellenarTabla() {
    const filtro = document.getElementById('filtro').value;
    const checklist = Array.from(document.querySelectorAll("#checklist input[type='checkbox']"));
    const datosFiltrados = Vehiculos.filter(Vehiculo => filtrarVehiculos(Vehiculo, filtro, checklist));

    const tbody = document.querySelector("#tabla-Vehiculos tbody");
    tbody.innerHTML = ''; 

    datosFiltrados.forEach(Vehiculo => {
        const row = document.createElement('tr');
        
        checklist.forEach(checkbox => {
            if (checkbox.checked) {
                const cell = document.createElement('td');
                cell.textContent = Vehiculo[checkbox.value] || 'N/A';
                row.appendChild(cell);
            }
        });

        const modificarCelda = document.createElement('td');
        const modificarBoton = document.createElement('button');
        modificarBoton.textContent = 'Modificar';

        modificarBoton.onclick = (event) => {
            event.preventDefault(); 
            alternarVisibilidad(); 
            seleccionarItemArray(Vehiculo.id); 
            const encabezado = document.getElementById("form-ABM-encabezado");
            if (encabezado) {
                encabezado.textContent = "Modificar"; 
            }

        };

        modificarCelda.appendChild(modificarBoton);
        row.appendChild(modificarCelda);

        const eliminarCelda = document.createElement('td');
        const eliminarBoton = document.createElement('button');
        eliminarBoton.textContent = 'eliminar';


        eliminarBoton.onclick = (event) => {
            event.preventDefault(); 
            alternarVisibilidad(); 
            seleccionarItemArray(Vehiculo.id); 
            const encabezado = document.getElementById("form-ABM-encabezado");
            if (encabezado) {
                encabezado.textContent = "Eliminar"; 
            }
        };


        eliminarCelda.appendChild(eliminarBoton);
        row.appendChild(eliminarCelda);

        tbody.appendChild(row);
    });
}


function filtrarVehiculos(Vehiculo, filtro, checklist) {


    checklist.forEach(checkbox => {
        if (checkbox.checked && !Vehiculo.hasOwnProperty(checkbox.value)) {
            Vehiculo[checkbox.value] = 'N/A';
        }
    });

        const esAuto = Vehiculo.cantidadPuertas !== 'N/A'; 
    const esCamion = Vehiculo.carga !== 'N/A'; 

    if (filtro === '1' && !esAuto) return false; 
    if (filtro === '2' && !esCamion) return false; 

    return true;
}

function alternarVisibilidad() {
    var x = document.getElementById("form-datos");
    var z = document.getElementById("form-ABM");

    if (z.style.display === "none" || z.style.display === "") {
        z.style.display = "block";
        x.style.display = "none";
    } else {
        z.style.display = "none";
        x.style.display = "block";
    }
}

function agregarNuevo() {
    const modelo = document.getElementById('abm-modelo').value;

    const anoFabricacion = document.getElementById('abm-anoFabricacion').value;
    const velMax = parseInt(document.getElementById('abm-velMax').value, 10);
    const filtroAbm = document.getElementById('filtro-abm').value;

    if (typeof modelo !== 'string' || modelo.trim() === '') {
        console.error('Modelo no válido');
        return;
    }

    if (isNaN(anoFabricacion) || anoFabricacion <= 1985) {
        console.error('Año de fabricación no válido');
        return;
    }

    if (isNaN(velMax) || velMax <= 0) {
        console.error('Velocidad máxima no válida');
        return;
    }


    let nuevoVehiculo = {
        modelo,
        anoFabricacion,
        velMax,
    };

    if (filtroAbm === '1') {
        nuevoVehiculo.cantidadPuertas = document.getElementById('abm-cantidadPuertas').value;
        nuevoVehiculo.asientos = parseInt(document.getElementById('abm-asientos').value);
        if (isNaN(nuevoVehiculo.cantidadPuertas) || nuevoVehiculo.cantidadPuertas <= 2) {
            console.error('Cantidad de puertas no válida');
            return;
        }

        if (isNaN(nuevoVehiculo.asientos) || nuevoVehiculo.asientos <= 2) {
            console.error('Cantidad de asientos no válida');
            return;
        }


    } else if (filtroAbm === '2') {
        nuevoVehiculo.carga = document.getElementById('abm-carga').value;
        nuevoVehiculo.autonomia = document.getElementById('abm-autonomia').value;

        if (isNaN(nuevoVehiculo.carga) || nuevoVehiculo.carga <= 0) {
            console.error('Carga no válida');
            return;
        }
        if (isNaN(nuevoVehiculo.autonomia) || nuevoVehiculo.autonomia <= 0) {
            console.error('Autonomía no válida');
            return;
        }
    } else {
        console.error('Tipo de Vehiculo no válido');
        return;
    }

    mostrarSpinner();

    fetch('https://examenesutn.vercel.app/api/VehiculoAutoCamion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoVehiculo)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        if (data.id) {
            nuevoVehiculo.id = data.id;
            Vehiculos.push(nuevoVehiculo);
            alternarVisibilidad();
            rellenarTabla();
        } else {
            console.error('Error al agregar Vehiculo:', data);
        }
    })
    .catch(error => console.error('Error en la solicitud:', error))
    .finally(() => ocultarSpinner());
}


function modificarId() {
    const id = parseInt(document.getElementById('abm-id').value, 10);
    const vehiculo = Vehiculos.find(v => v.id === id);
    const filtroAbm = document.getElementById('filtro-abm').value;

    if (!vehiculo) {
        console.error('Vehículo no encontrado');
        return;
    }

    const modelo = document.getElementById('abm-modelo').value.trim();
    const anoFabricacion = parseInt(document.getElementById('abm-anoFabricacion').value.trim(), 10);
    const velMax = parseInt(document.getElementById('abm-velMax').value, 10);

    if (typeof modelo !== 'string' || modelo.trim() === '') {
        console.error('Modelo no válido');
        return;
    }

    if (isNaN(anoFabricacion) || anoFabricacion <= 1985) {
        console.error('Año de fabricación no válido');
        return;
    }

    if (isNaN(velMax) || velMax <= 0) {
        console.error('Velocidad máxima no válida');
        return;
    }

    if (filtroAbm === '1') { 
        const cantidadPuertas = parseInt(document.getElementById('abm-cantidadPuertas').value, 10);
        const asientos = parseInt(document.getElementById('abm-asientos').value, 10);

        if (isNaN(cantidadPuertas) || cantidadPuertas <= 2) {
            console.error('Cantidad de puertas no válida');
            return;
        }

        if (isNaN(asientos) || asientos <= 2) {
            console.error('Cantidad de asientos no válida');
            return;
        }

        vehiculo.modelo = modelo;
        vehiculo.anoFabricacion = anoFabricacion;
        vehiculo.velMax = velMax;
        vehiculo.cantidadPuertas = cantidadPuertas;
        vehiculo.asientos = asientos;

    } else if (filtroAbm === '2') { 
        const carga = parseInt(document.getElementById('abm-carga').value, 10);
        const autonomia = parseInt(document.getElementById('abm-autonomia').value, 10);

        if (isNaN(carga) || carga <= 0) {
            console.error('Carga no válida');
            return;
        }
        
        if (isNaN(autonomia) || autonomia <= 0) {
            console.error('Autonomía no válida');
            return;
        }

        vehiculo.modelo = modelo;
        vehiculo.anoFabricacion = anoFabricacion;
        vehiculo.velMax = velMax;
        vehiculo.carga = carga;
        vehiculo.autonomia = autonomia;
    }

    mostrarSpinner();

    fetch(`https://examenesutn.vercel.app/api/VehiculoAutoCamion?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculo) 
    })
    .then(response => response.text())
    .then(text => {
        if (text.includes("Registro Actualizado")) {
            rellenarTabla();
            alternarVisibilidad();
        } else {
            console.error('Error al modificar Vehículo:', text);
        }
    })
    .catch(error => console.error('Error en la solicitud:', error))
    .finally(() => ocultarSpinner());
}

function cargarDatosAbm(item) {
    const campos = ['id', 'modelo', 'anoFabricacion', 'velMax', 'cantidadPuertas',  'asientos', 'carga', 'autonomia'];
    campos.forEach(campo => {
        const elemento = document.getElementById(`abm-${campo}`);
        if (elemento) {
            elemento.value = item[campo] || '';
        }
    });

    const elementoFiltroAbm = document.getElementById('filtro-abm');
    const esAuto = item.cantidadPuertas !== 'N/A';
    const esCamion = item.carga !== 'N/A';

    if (esAuto) {
        elementoFiltroAbm.value = '1';
    } else if (esCamion) {
        elementoFiltroAbm.value = '2'; 
    } else {
        elementoFiltroAbm.value = '0'; 
    }

    elementoFiltroAbm.dispatchEvent(new Event('change'));
}


function seleccionarItemArray(id) {
    const Vehiculo = Vehiculos.find(Vehiculo => Vehiculo.id === id);
    if (Vehiculo) {
        cargarDatosAbm(Vehiculo); 
    }
    return Vehiculo;
}

function eliminarId() {
    const id = parseInt(document.getElementById('abm-id').value, 10);
    const objetoIndex = Vehiculos.findIndex(obj => obj.id == id);

    if (objetoIndex !== -1) {
        mostrarSpinner();
        fetch('https://examenesutn.vercel.app/api/VehiculoAutoCamion', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.text();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            const objetoIndex = Vehiculos.findIndex(obj => obj.id == id);

            if (objetoIndex !== -1) {
                Vehiculos.splice(objetoIndex, 1); 
                rellenarTabla(); 
                alternarVisibilidad();
            } else {
                console.error('Vehiculo no encontrada en el arreglo local.');
            }
        })
        .catch(error => {
            console.error('Error al eliminar Vehiculo:', error);
        })
        .finally(() => {
            rellenarTabla(); 
            ocultarSpinner();
        });

    } else {
        console.error('Vehiculo no encontrado');
    }
}


function ordenarTabla(colIndex) {
    const tbody = document.querySelector("#tabla-Vehiculos tbody");
    const filas = Array.from(tbody.querySelectorAll('tr'));

    const filasOrdenadas = filas.map(fila => {
        const texto = fila.children[colIndex].textContent.trim();
        const numero = parseFloat(texto);
        return {
            fila,
            valor: isNaN(numero) ? texto : numero
        };
    }).sort((a, b) => {
        return (typeof a.valor === 'number' && typeof b.valor === 'number')
            ? a.valor - b.valor 
            : a.valor.localeCompare(b.valor); 
    }).map(item => item.fila); 

    tbody.innerHTML = '';
    filasOrdenadas.forEach(fila => tbody.appendChild(fila));
}


function mostrarSpinner() {
    document.getElementById("spinner").style.display = "flex"; 
}

function ocultarSpinner() {
    document.getElementById("spinner").style.display = "none";
}


//doms

document.addEventListener('DOMContentLoaded', () => {
    cargarVehiculos();
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-aceptar').addEventListener('click', function() {
        const encabezado = document.getElementById("form-ABM-encabezado");
        if (encabezado.textContent === "Agregar") {
            agregarNuevo();
        } else if (encabezado.textContent === "Modificar") {
            modificarId();
        } else if (encabezado.textContent === "Eliminar") {
            eliminarId();
        }
    });
});



document.getElementById('btn-agregar').addEventListener('click', function() {
    alternarVisibilidad();

    document.querySelectorAll('#form-ABM input').forEach(input => input.value = '');
    document.getElementById('filtro-abm').value = '0';
    document.getElementById('filtro-abm').dispatchEvent(new Event('change'));
    const encabezado = document.getElementById("form-ABM-encabezado");
            if (encabezado) {
                encabezado.textContent = "Agregar"; 
            }
});

document.getElementById('btn-cancelar').addEventListener('click', alternarVisibilidad);



document.querySelectorAll('#checklist input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', actualizarEncabezados);
});

document.querySelectorAll('#checklist input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', rellenarTabla);
});


document.getElementById('filtro').addEventListener('change', function() {
    const filtro = this.value;
    const mostrarCamion = filtro === '2';
    const mostrarAuto = filtro === '1';

    document.querySelector('.Camion').style.display = mostrarCamion ? 'inline' : 'none';
    document.querySelector('.Auto').style.display = mostrarAuto ? 'inline' : 'none';


    actualizarEncabezados();
    rellenarTabla();
});


document.getElementById('filtro-abm').addEventListener('change', function() {
    const filtroAbm = document.getElementById('filtro-abm').value;
    const Camion = document.querySelector('#campos_faltantes .Camion');
    const Auto = document.querySelector('#campos_faltantes .Auto');

    Camion.style.display = 'none';
    Auto.style.display = 'none';

    if (filtroAbm === '1') {
        Auto.style.display = 'block';
    } else if (filtroAbm === '2') {
        Camion.style.display = 'block';
    }
    else {
        Camion.style.display = 'none';
        Auto.style.display = 'none';
    }
});
