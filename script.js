const pantalla = document.getElementById("pantalla");

let numeroActual = "0";
let numeroAnterior = null;
let operador = null;
let reiniciarPantalla = false;

// Mostrar números en pantalla
function agregarNumero(numero) {
    if (reiniciarPantalla) {
        numeroActual = numero;
        reiniciarPantalla = false;
    } else if (numeroActual === "0") {
        numeroActual = numero;
    } else {
        numeroActual += numero;
    }

    pantalla.value = numeroActual;
}

// Seleccionar operación
function seleccionarOperador(op) {
    if (operador !== null && !reiniciarPantalla) {
        calcular();
    }

    numeroAnterior = Number(numeroActual);
    operador = op;
    reiniciarPantalla = true;
}

// Realizar operación
function calcular() {
    if (operador === null || numeroAnterior === null) {
        return;
    }

    const segundoNumero = Number(numeroActual);
    let resultado;

    switch (operador) {
        case "+":
            resultado = numeroAnterior + segundoNumero;
            break;

        case "-":
            resultado = numeroAnterior - segundoNumero;
            break;

        case "*":
            resultado = numeroAnterior * segundoNumero;
            break;

        case "/":
            if (segundoNumero === 0) {
                pantalla.value = "No se puede dividir entre 0";
                limpiarVariables();
                reiniciarPantalla = true;
                return;
            }
            resultado = numeroAnterior / segundoNumero;
            break;
    }

    numeroActual = String(Number(resultado.toPrecision(12)));
    pantalla.value = numeroActual;

    numeroAnterior = null;
    operador = null;
    reiniciarPantalla = true;
}

// Limpiar calculadora
function limpiar() {
    numeroActual = "0";
    numeroAnterior = null;
    operador = null;
    reiniciarPantalla = false;

    pantalla.value = "0";
}

function limpiarVariables() {
    numeroActual = "0";
    numeroAnterior = null;
    operador = null;
}

// Agregar punto decimal
function agregarDecimal() {
    if (reiniciarPantalla) {
        numeroActual = "0.";
        reiniciarPantalla = false;
    } else if (!numeroActual.includes(".")) {
        numeroActual += ".";
    }

    pantalla.value = numeroActual;
}

// Conectar botones numéricos
document.querySelectorAll("[data-number]").forEach(boton => {
    boton.addEventListener("click", () => {
        agregarNumero(boton.dataset.number);
    });
});

// Conectar botones de operaciones
document.querySelectorAll("[data-operator]").forEach(boton => {
    boton.addEventListener("click", () => {
        seleccionarOperador(boton.dataset.operator);
    });
});

// Conectar botón igual
document.querySelector('[data-action="equals"]')
    .addEventListener("click", calcular);

// Conectar botón limpiar
document.querySelector('[data-action="clear"]')
    .addEventListener("click", limpiar);

// Conectar punto decimal
document.querySelector('[data-action="decimal"]')
    .addEventListener("click", agregarDecimal);