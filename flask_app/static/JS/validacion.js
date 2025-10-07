// Valida un texto con largo mínimo y máximo
const validateText = (text, min , max ) => {
    if(!text) return false;
    let lengthValid = text.trim().length <= max && text.trim().length >= min;
    return lengthValid;
}

// Valida que un email cumpla con largo y formato correcto
const validateEmail = (email) => {
    if (!email) return false;
    let lengthValid = email.length > 15 && email.length <= 100;

    // Validar el formato: usuario@dominio.ext
    let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    let formatValid = re.test(email);

    // Ambas validaciones deben cumplirse
    return lengthValid && formatValid;
};

// Valida número de teléfono en formato chileno: +569 XXXXXXXX
const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return true;

    // Elimina espacios al inicio y final
    phoneNumber = phoneNumber.trim();

    // Expresión regular para +569 seguido de 8 dígitos
    const re = /^\+569.(?:\s?\d){8}$/;

    return re.test(phoneNumber);
};

// Valida que existan entre 1 y 5 archivos y que sean imágenes o PDF
const validateFiles = (files) => {
    if (!files) return false;

    // Número de archivos permitido
    let lengthValid = 1 <= files.length && files.length <= 5;

    // Tipo de archivo permitido
    let typeValid = true;
    for (const file of files) {
        let fileFamily = file.type.split("/")[0];
        typeValid &&= fileFamily == "image" || file.type == "application/pdf";
    }

    return lengthValid && typeValid;
};

// Igual a validateFiles, pero opcional (puede no haber archivos)
const validateFilesOptional = (files) => {
    if (!files) return true;

    let typeValid = true;
    for (const file of files) {
        let fileFamily = file.type.split("/")[0];
        typeValid &&= fileFamily == "image" || file.type == "application/pdf";
    }

    return typeValid;
};

// Verifica que un select tenga valor seleccionado
const validateSelect = (select) => {
    if(!select) return false;
    return true;
};

// Valida que el número esté dentro de un rango y sea entero
const validateNums = (num, min, max) => {
    if(!num) return false;
    return num <= max && num >= min && num % 1 === 0;
};

// Valida que la fecha ingresada sea posterior a la actual
const validateFecha = (date, act) => {
    let newDate = new Date(date);
    return newDate > act;
};

const validateContactos = (form) => {
    const inputsContacto = document.querySelectorAll('#inputs-contacto input[type="text"]');
    if (inputsContacto.length === 0) return false; // Debe haber al menos un contacto
    
    for (let input of inputsContacto) {
        if (!validateText(input.value, 4, 50)) {
            return false;
        }
    }
    return true;
};

// Ajuste de fecha actual para validación (con margen de minutos)
let now = new Date();
now.setHours(now.getHours() + 3);
now.setMinutes(now.getMinutes() - 1);

// Función principal de validación del formulario
const validateForm = () => {
    // Obtener el formulario y sus campos
    let myForm = document.forms["myForm"];

    // Donde (ubicación)
    let region = myForm["select-region"].value;
    let comuna = myForm["select-comuna"].value;

    // Contacto
    let name = myForm["nombre"].value;
    let email = myForm["email"].value;
    let phoneNumber = myForm["phone"].value;
    
    // Mascota
    let tipo = myForm["select-tipo"].value;
    let cantidad = myForm["cantidad"].value;
    let edad = myForm["edad"].value;
    let edadMedida = myForm["select-edad"].value;
    let entrega = myForm["entrega"].value;
    let foto1 = myForm["foto1"].files;
    let foto2 = myForm["foto2"].files;
    let foto3 = myForm["foto3"].files;
    let foto4 = myForm["foto4"].files;
    let foto5 = myForm["foto5"].files;

    // Variables auxiliares
    let invalidInputs = [];
    let isValid = true;
    const setInvalidInput = (inputName) => {
        invalidInputs.push(inputName);
        isValid &&= false;
    };

    // Validaciones por secciones
    // Ubicación
    if (!validateSelect(region)) setInvalidInput("Region");
    if (!validateSelect(comuna)) setInvalidInput("Comuna");

    // Contacto
    if (!validateText(name, 3, 200)) setInvalidInput("Nombre");
    if (!validateEmail(email)) setInvalidInput("Email");
    if (!validatePhoneNumber(phoneNumber)) setInvalidInput("Número de teléfono");
    if (!validateContactos(myForm)) setInvalidInput("Formas de contacto");

    // Mascota
    if (!validateSelect(tipo)) setInvalidInput("Tipo de Mascota");
    if (!validateNums(cantidad, 1, Infinity)) setInvalidInput("Cantidad");
    if (!validateNums(edad, 1, Infinity)) setInvalidInput("Edad");
    if (!validateSelect(edadMedida)) setInvalidInput("Unidad de medida de la edad");
    if (!validateFiles(foto1)) setInvalidInput("Fotos");
    if (!validateFilesOptional(foto2)) setInvalidInput("Fotos");
    if (!validateFilesOptional(foto3)) setInvalidInput("Fotos");
    if (!validateFilesOptional(foto4)) setInvalidInput("Fotos");
    if (!validateFecha(entrega, now)) setInvalidInput("Fecha de entrega");
    if (!validateFilesOptional(foto5)) setInvalidInput("Fotos");

    // Mostrar resultados de la validación
    let validationBox = document.getElementById("val-box");
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");
    let formContainer = document.querySelector(".main-container");

    if (!isValid) {
        // Mostrar errores
        validationListElem.textContent = "";
        for (input of invalidInputs) {
            let listElement = document.createElement("li");
            listElement.innerText = input;
            validationListElem.append(listElement);
        }
        validationMessageElem.innerText = "Los siguientes campos son inválidos:";
        validationBox.style.backgroundColor = "#ffdddd";
        validationBox.style.borderLeftColor = "#f44336";
        validationBox.hidden = false;
    } else {
        // Mostrar mensaje de éxito y botones
        myForm.style.display = "none";
        validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver?";
        validationListElem.textContent = "";
        validationBox.style.backgroundColor = "#ddffdd";
        validationBox.style.borderLeftColor = "#4CAF50";

        // Botón para enviar
        let submitButton = document.createElement("button");
        submitButton.innerText = "Enviar";
        submitButton.style.marginRight = "10px";
        submitButton.addEventListener("click", () => {
            window.location.href = "/HTML/mensaje_final.html";
        });

        // Botón para volver
        let backButton = document.createElement("button");
        backButton.innerText = "Volver";
        backButton.addEventListener("click", () => {
            myForm.style.display = "block";
            validationBox.hidden = true;
        });

        validationListElem.appendChild(submitButton);
        validationListElem.appendChild(backButton);
        validationBox.hidden = false;
    }
};

// Asociar validación al botón de envío
let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateForm);
