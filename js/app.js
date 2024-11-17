// SIMPLE LOAN CALCULATOR
// 237. Validar campos
doc = document;
const principal = doc.querySelector("#principal");
const interest = doc.querySelector("#interest");
const termInput = doc.querySelector("#term");
const replaceComma = "/,/g, ''";

// funcion para agregar coma como separador de miles
function addCommas(e) {
  let inputValue = e.target.value;
  // g busca cualquier coma en el texto ingresado
  inputValue = inputValue.replace(/,/g, "");
  inputValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  e.target.value = inputValue;
}

// Evento para detectar cambio en los campos de entrada
principal.addEventListener("input", addCommas);
interest.addEventListener("input", addCommas);
termInput.addEventListener("input", addCommas);

// 238. Validar campos II
// funcion para validar los campos del formulario
function validateFields() {
  let isValid = true;

  // validar campo del monto del prestamo
  if (principal.value.trim() === "") {
    isValid = false;
    principal.nextElementSibling.innerText = "Este campo es requerido";
  } else {
    principal.nextElementSibling.innerText = "";
  }

  // validar campo del interes del prestamo
  if (interest.value.trim() === "") {
    isValid = false;
    interest.nextElementSibling.innerText = "Este campo es requerido";
  } else {
    interest.nextElementSibling.innerText = "";
  }

  // validar campo del termino del prestamo
  if (termInput.value.trim() === "") {
    isValid = false;
    termInput.nextElementSibling.innerText = "Este campo es requerido";
  } else {
    termInput.nextElementSibling.innerText = "";
  }

  return isValid;
}

// funcion para verificar que se ingresen valores numericos
function validateNumericValue(e) {
  const inputValue = e.target.value;
  const erroMessageElement = e.target.nextElementSibling;

  // expresion regular para verificar si un campo es numerico
  const numericRegex = /^(\d{1,3}(,\d{3})*|\d+\.\d+)?$/;

  if (!numericRegex.test(inputValue)) {
    erroMessageElement.innerText = "Debes escribir un valor númerico";
    erroMessageElement.style.color = "#ff0000";
  } else {
    erroMessageElement.innerText = "";
  }
}

// funcion para detectar cambios en los campos de entrada de datos
principal.addEventListener("input", validateNumericValue);
interest.addEventListener("input", validateNumericValue);
termInput.addEventListener("input", validateNumericValue);

// 239. Calcular préstamos
// clase para calcular las cuotas periodicas de un prestamos
class loanCalculator {
  constructor(principal, interest, term) {
    this.principal = principal;
    this.interest = interest;
    this.term = term;
  }

  // metodo para calcular los pagos mensuales
  calculateMonthlyPayments() {
    const monthlyInterest = parseFloat(this.interest) / 12 / 100;
    const numberOfPayments = parseInt(this.term);
    const loanAmount = parseFloat(this.principal);

    // para calcular las cuotas de un prestamo ver minuto 11:00
    const monthlyPayment =
      (loanAmount * monthlyInterest) /
      (1 - Math.pow(1 + monthlyInterest, -numberOfPayments));

    return monthlyPayment;
  }

  // metodo para el calcular el interes total pagado
  calculateTotalInterestPaid() {
    const monthlyPayment = parseFloat(this.calculateMonthlyPayments());
    const numberOfPayments = parseInt(this.term);
    const loanAmount = parseFloat(this.principal.replace(/,/g, ""));

    const totalInterestPaid = monthlyPayment * numberOfPayments - loanAmount;
    return totalInterestPaid;
  }

  // metodo para calcular el monto principal pagado
  calculateTotalPrincipalPaid() {
    const totalInterestPaid = this.calculateTotalInterestPaid();
    const loanAmount = parseFloat(this.principal.replace(/,/g, ""));
    const totalPrincipalPaid = loanAmount + totalInterestPaid;
    return totalPrincipalPaid;
  }
}
// funcion auxiliar para agregar comas separadoas de miles en los resultados
function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 240. Calcular préstamos II
function calculateLoan(e) {
  // prevenir envio del formulario
  e.preventDefault();

  // si los ccampos no son validos se detiene la ejecucion
  if (!validateFields()) return;

  // valor del campo monto prestamo
  const principalValue = principal.value.replace(/,/g, "");
  // valor del campo interes
  const interestValue = interest.value;
  // valor del campo termino de prestamo
  const termValue = termInput.value;

  // llamamos a la clase
  const loanCal = new loanCalculator(principalValue, interestValue, termValue);

  // mostrar resultados en el DOM
  doc.querySelector("#monthlyPayments").innerText =
    "$" + numberWithCommas(loanCal.calculateMonthlyPayments().toFixed(2));

  doc.querySelector("#totalPrincipalPaid").innerText =
    "$" + numberWithCommas(loanCal.calculateTotalPrincipalPaid().toFixed(2));

  doc.querySelector("#totalInterestPaid").innerText =
    "$" + numberWithCommas(loanCal.calculateTotalInterestPaid().toFixed(2));
}

// Evento para realizar los calculos
doc.querySelector("#calculate-button").addEventListener("click", calculateLoan);

// 241. Tabla de amortización
// mostrar la amortización
function calculateAmortization(e) {
  // prevenir envio del formulario
  e.preventDefault();

  // si los ccampos no son validos se detiene la ejecucion
  if (!validateFields()) return;

  // valor del campo monto prestamo
  const principalValue = principal.value.replace(/,/g, "");
  // valor del campo interes
  const interestValue = interest.value;
  // valor del campo termino de prestamo
  const termValue = termInput.value;

  // llamamos a la clase
  const loanCal = new loanCalculator(principalValue, interestValue, termValue);

  // mostrar resultados en el DOM
  doc.querySelector("#monthlyPayments").innerText =
    "$" + numberWithCommas(loanCal.calculateMonthlyPayments().toFixed(2));

  doc.querySelector("#totalPrincipalPaid").innerText =
    "$" + numberWithCommas(loanCal.calculateTotalPrincipalPaid().toFixed(2));

  doc.querySelector("#totalInterestPaid").innerText =
    "$" + numberWithCommas(loanCal.calculateTotalInterestPaid().toFixed(2));

  let remainingBalance = parseFloat(principalValue);
  let totalInterestPaid = 0;

  const table = doc.querySelector("table");
  table.innerHTML = `
  
  <tr>
    <th>Mes</th>
    <th>Pago</th>
    <th>Principal</th>
    <th>Interés pagado</th>
    <th>Interés total</th>
    <th>Balance</th>
  </tr> 

  `;
  for (let i = 0; i <= termValue; i++) {
    const interestPayment =
      remainingBalance * (parseFloat(interestValue) / 100 / 12);
    const principalPayment =
      loanCal.calculateMonthlyPayments() - interestPayment;
    totalInterestPaid += interestPayment;

    // agregar fila a la tabla con los resultados de la amortizacion
    table.innerHTML += `
    <tr>
      <td>${i}</td>
      <td>$${numberWithCommas(
        loanCal.calculateMonthlyPayments().toFixed(2)
      )}</td>
      <td>$${numberWithCommas(principalPayment.toFixed(2))}</td>
      <td>$${numberWithCommas(interestPayment.toFixed(2))}</td>
      <td>$${numberWithCommas(totalInterestPaid.toFixed(2))}</td>
      <td>$${numberWithCommas(remainingBalance.toFixed(2))}</td>
    </tr>
    
    `;

    remainingBalance -= principalPayment;
  }
}

// Evento para realizar los calculos
doc.querySelector("#calculate-button").addEventListener("click", calculateAmortization);

// 242. Limpiar campos
// funcion para limpiar los campos y borrar los resultados;
function clearResults() {
  doc.querySelector("#monthlyPayments").innerText = "$0";
  doc.querySelector("#totalPrincipalPaid").innerText = "$0";
  doc.querySelector("#totalInterestPaid").innerText = "$0";

  // limpiar celdas de la tabla
  const table = doc.querySelector("table");
  table.innerHTML = `
  <tr>
    <th>Mes</th>
    <th>Pago</th>
    <th>Principal</th>
    <th>Interés pagado</th>
    <th>Interés total</th>
    <th>Balance</th>
  </tr>
  <tr>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
  </tr>  
  
  `;
}

// evento para limpiar los campos y resultados
doc.querySelector("button[type='reset']").addEventListener("click", clearResults);