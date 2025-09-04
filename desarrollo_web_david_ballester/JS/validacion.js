const validateText = (text, min , max ) => {
    if(!text) return false;
    let lengthValid = text.trim().length <= max && text.trim().length >= min;
    return lengthValid;
}

const validateEmail = (email) => {
    if (!email) return false;
    let lengthValid = email.length > 15 && email.length <= 100;

    // validamos el formato
    let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    let formatValid = re.test(email);

    // devolvemos la lógica AND de las validaciones.
    return lengthValid && formatValid;
};

const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return true;

    // Eliminamos espacios al inicio y fin
    phoneNumber = phoneNumber.trim();

    // Formato +569 XXXXXXXX
    const re = /^\+569.(?:\s?\d){8}$/;

    return re.test(phoneNumber);
};

const validateFiles = (files) => {
    if (!files) return false;

    // validación del número de archivos
    let lengthValid = 1 <= files.length && files.length <= 5;

    // validación del tipo de archivo
    let typeValid = true;

    for (const file of files) {
        // el tipo de archivo debe ser "image/<foo>" o "application/pdf"
        let fileFamily = file.type.split("/")[0];
        typeValid &&= fileFamily == "image" || file.type == "application/pdf";
    }

    // devolvemos la lógica AND de las validaciones.
    return lengthValid && typeValid;
};

const validateFilesOptional = (files) => {
    if (!files) return true;

    // validación del tipo de archivo
    let typeValid = true;

    for (const file of files) {
        // el tipo de archivo debe ser "image/<foo>" o "application/pdf"
        let fileFamily = file.type.split("/")[0];
        typeValid &&= fileFamily == "image" || file.type == "application/pdf";
    }

    // devolvemos la lógica AND de las validaciones.
    return typeValid;
};

const validateSelect = (select) => {
    if(!select) return false;
    return true;
};

const validateNums = (num, min, max) => {
    if(!num) return false;
    return num <= max && num >= min && num % 1 === 0;
};

const validateFecha = (date, act) => {
    let newDate = new Date(date);
    return newDate > act;
};

// Tuve que arreglar los minutos, ya que no me validaba con >=
let now = new Date();
now.setHours(now.getHours() + 3);
now.setMinutes(now.getMinutes() - 1);

const validateForm = () => {
    // obtener elementos del DOM usando el nombre del formulario.
    let myForm = document.forms["myForm"];

    // Donde
    let region = myForm["select-region"].value;
    let comuna = myForm["select-comuna"].value;

    // Contacato
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

    // variables auxiliares de validación y función.
    let invalidInputs = [];
    let isValid = true;
    const setInvalidInput = (inputName) => {
        invalidInputs.push(inputName);
        isValid &&= false;
    };

    // lógica de validación
    //Donde
    if (!validateSelect(region)) {
        setInvalidInput("Region");
    }

    if (!validateSelect(comuna)) {
        setInvalidInput("Comuna");
    }

    // Contacto
    if (!validateText(name, 3, 200)) {
        setInvalidInput("Nombre");
    }
    if (!validateEmail(email)) {
        setInvalidInput("Email");
    }
    if (!validatePhoneNumber(phoneNumber)) {
        setInvalidInput("Número de teléfono");
    }

    //Mascota
    if (!validateSelect(tipo)) {
        setInvalidInput("Tipo de Mascota");
    }
    if (!validateNums(cantidad, 1, Infinity)) {
        setInvalidInput("Cantidad");
    }
    if (!validateNums(edad, 1, Infinity)) {
        setInvalidInput("Edad");
    }
    if (!validateSelect(edadMedida)) {
        setInvalidInput("Unidad de medida de la edad");
    }
    if (!validateFiles(foto1)) {
        setInvalidInput("Fotos");
    }
    if (!validateFilesOptional(foto2)) {
        setInvalidInput("Fotos");
    }
    if (!validateFilesOptional(foto3)) {
        setInvalidInput("Fotos");
    }
    if (!validateFilesOptional(foto4)) {
        setInvalidInput("Fotos");
    }
    if (!validateFecha(entrega, now)) {
        setInvalidInput("Fecha de entrega");
    }
    if (!validateFilesOptional(foto5)) {
        setInvalidInput("Fotos");
    }

    // finalmente mostrar la validación
    let validationBox = document.getElementById("val-box");
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");
    let formContainer = document.querySelector(".main-container");

    if (!isValid) {
        validationListElem.textContent = "";
        // agregar elementos inválidos al elemento val-list.
        for (input of invalidInputs) {
            let listElement = document.createElement("li");
            listElement.innerText = input;
            validationListElem.append(listElement);
        }
        // establecer val-msg
        validationMessageElem.innerText = "Los siguientes campos son inválidos:";

        // aplicar estilos de error
        validationBox.style.backgroundColor = "#ffdddd";
        validationBox.style.borderLeftColor = "#f44336";

        // hacer visible el mensaje de validación
        validationBox.hidden = false;
    } else {
        // Ocultar el formulario
        myForm.style.display = "none";

        // establecer mensaje de éxito
        validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver?";
        validationListElem.textContent = "";

        // aplicar estilos de éxito
        validationBox.style.backgroundColor = "#ddffdd";
        validationBox.style.borderLeftColor = "#4CAF50";

        // Agregar botones para enviar el formulario o volver
        let submitButton = document.createElement("button");
        submitButton.innerText = "Enviar";
        submitButton.style.marginRight = "10px";
        submitButton.addEventListener("click", () => {
        // myForm.submit();
            window.location.href = "../../HTML/formulario/msj_final_formulario.html";
        });

        let backButton = document.createElement("button");
        backButton.innerText = "Volver";
        backButton.addEventListener("click", () => {
        // Mostrar el formulario nuevamente
        myForm.style.display = "block";
        validationBox.hidden = true;
        });

        validationListElem.appendChild(submitButton);
        validationListElem.appendChild(backButton);

        // hacer visible el mensaje de validación
        validationBox.hidden = false;
    }
    };


let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateForm);