const divideByZeroMSG = 'ERROR: Divide by 0';
const negRadicalMSG = 'ERROR: Neg radical';

const add = (a, b) => (a + b);
const subtract = (a, b) => (a - b);
const multiply = (a, b) => (a * b);
const divide = (a,b) => (b === 0 ? divideByZeroMSG : a / b); 
const exponent = (base, exp) => (base ** exp);
const percent = (x) => (x /= 100);
const posNegToggle = (x) => (x * -1);
const squareRoot = (x) => (Math.sqrt(x));
const R2 = (x) => (String(Math.round(parseFloat(x)*100)/100));
const R0 = (x) => (String(Math.round(parseFloat(x))));

const eightDecimals = 100000000;

let operand1 = '';
let operand2 = '';
let operator = '';

const resetVariables = () => {
    operator = '';
    operand1 = '';
    operand2 = '';
};

const operate = (op, a, b) => {
    a = parseFloat(a);
    b = parseFloat(b);
    if (op === undefined || a === undefined || b === undefined) {
        return '?';
    }
    resetVariables();
    let result;
    switch(op) {
        case '+':
            result = add(a,b);
            break;
        case '-':
            result = subtract(a,b);
            break;
        case '*':
            result = multiply(a,b);
            break;
        case '/':
            result = divide(a,b);
            break;
        case '^':
            result = exponent(a,b);
            break;
        default:
            return '?';
    }
    if (result === divideByZeroMSG) {
        return result;
    }
    return Math.round(result*eightDecimals)/eightDecimals;
};

const display = document.querySelector('.display');

function setCursor() {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(display);
    range.collapse(false); // place cursor at end 
    selection.removeAllRanges();
    selection.addRange(range);
    display.focus();
}
display.addEventListener('keydown', (event) => {
    event.preventDefault();
    setCursor();

    let key = event.key;
  
    if (key === '×') {
        key = '*';
    }
    else if (key === '÷') {
        key = '/';
    }
    
    keyInt = parseInt(key);
    if (Number.isInteger(keyInt)) {
        if (operator === '') {
            operand1 += keyInt;
            display.textContent = operand1;
        }
        else {
            operand2 += keyInt;
            display.textContent = operand2;
        }
        setCursor();
    }
    else if (key === '.') {
        decimalFunction();
        setCursor();
    }
    else if (key === 'Backspace') {
        if (operand1 === '') {
            display.textContent = '0';
        }
        else if (operand2 === '') {
            operand1 = operand1.slice(0,-1);
            display.textContent = operand1;
        }
        else if (operand2 !== '') {
            operand2 = operand2.slice(0,-1);
            display.textContent = operand2;
        }  
        setCursor();
    }
    else if (key === '=' || key === 'Enter') {
        equalFunction();
        setCursor();
    }
    else if (operatorsStr.includes(key)) {
        display.textContent = key;
        operatorFunction(key);
        setCursor();
    }
});

const digitsContainer = document.querySelector('.digits-container');

const decimal = document.createElement('button');
decimal.classList.add('digits');
decimal.textContent = '.';
const decimalFunction = () => {
     if (operand1 === '') {
        operand1 = '0.';
        display.textContent = operand1;
    }
    else if (operator === '') {
        if (!display.textContent.includes('.')) {
            operand1 += '.';
            display.textContent = operand1;
        }
    }
    else if (operand2 === '') {
        operand2 = '0.';
        display.textContent = operand2;
    }
    else {
        if (!display.textContent.includes('.')) {
            operand2 += '.';
            display.textContent = operand2;
        }
    }
}
decimal.addEventListener('click', decimalFunction);
digitsContainer.appendChild(decimal);

for (let i = 0; i < 10; ++i) {
    const digit = document.createElement('button');
    digit.classList.add('digits');
    digit.textContent = i;
    digit.addEventListener('click', (event) => {
        const targetDigit = event.target.textContent 
        if (operator === '') {
            operand1 += targetDigit;
            display.textContent = operand1;
        }
        else {
            operand2 += targetDigit;
            display.textContent = operand2;
        }
    });
    digitsContainer.appendChild(digit);
}

const right = document.querySelector('.right');

const operatorsArr = ['+','-', '×', '÷'];
const operatorsStr = '+-*/^';
const operatorFunction = (targetText) => {
    let targetOp = targetText;
    if (targetOp === '×') {
        targetOp = '*';
    }
    else if (targetOp === '÷') {
        targetOp = '/';
    }

    display.textContent = targetOp;
        if (operand1 === '') {
            operand1 = '0'
        }
        else if (operator === '') {}
        // if second operator, and operands are assigned
        else if (operator !== '' && operand1 !== '' && operand2 !== '') { 
            operand1 = operate(operator, operand1, operand2);
            operand2 = '';
            operator = targetOp;
            display.textContent = operand1;
            if (operand1 === divideByZeroMSG) {
                operand1 = '';
            }
            return;
        }
        operator = targetOp;
        display.textContent = targetOp;
}
for (const item of operatorsArr) {
    const op = document.createElement('button');
    op.classList.add('operators', 'right-side');
    op.textContent = item;
    op.addEventListener('click', () => operatorFunction(item));
    right.appendChild(op);
}

const equal = document.getElementById('equal');
const equalFunction = () => {
    result = String(operate(operator, operand1, operand2));
    if (result !== '?') {
        operand1 = result;
        display.textContent = result;
        if (operand1 === divideByZeroMSG) {
            operand1 = '';
        }
    }
}

equal.addEventListener('click', equalFunction);

const clear = document.querySelector('.clear');
clear.addEventListener('click', () => {
    resetVariables();
    display.textContent = '0';
})

const backspace = document.querySelector('.backspace');
backspace.addEventListener('click', () => {
     if (operand2 === '' && operand1 !== '') {
        operand1 = operand1.slice(0,-1);
        if (operand1 === '') {
            display.textContent = '0';
        }
        else {
            display.textContent = operand1;
        }
    }
    else if (operand2 !== '') {
        operand2 = operand2.slice(0,-1);
        if (operand2 === '') {
            display.textContent = '0';
        }
        else {
            display.textContent = operand2;
        }
    }
});

const piVal = 3.1415926536;
const pi = document.querySelector('.pi');
pi.addEventListener('click', () => {
    if (operand1 === '' || operator === '') {
        operand1 = piVal;
    }
    else {
        operand2 = piVal;
    }
    display.textContent = piVal;
})

const exp = document.getElementById('exponent');
exp.addEventListener('click', (event) => {
    operatorFunction(event.target.textContent);
});

const sqrt = document.querySelector('.sqrt');
sqrt.addEventListener('click', () => {
    if (operand1 === '') {} 
    else if (operand2 == '') {
        operand1 = squareRoot(operand1);
        display.textContent = operand1;
    }
    else {
        operand2 = squareRoot(operand2);
        display.textContent = operand2;
    }
});

const posNeg = document.getElementById('pos-neg');
posNeg.addEventListener('click', () => {
    if (operand1 === '') {}
    else if (operand2 === '') {
        operand1 = posNegToggle(operand1);
        display.textContent = operand1;
    }
    else {
        operand2 = posNegToggle(operand2);
        display.textContent = operand2;
    }
});

const percentage = document.querySelector('.percentage');
percentage.addEventListener('click', () => {
    if (operand1 === '') {}
    else if (operand2 === '') {
        operand1 = percent(operand1);
        display.textContent = operand1;
    }
    else {
        operand2 = percent(operand2);
        display.textContent = operand2;
    }
});

const round2 = document.getElementById('round-2');
round2.addEventListener('click', () => {
    if (operand1 === '') {}
    else if (operand2 === '') {
        operand1 = R2(operand1);
        display.textContent = operand1;
    }
    else {
        operand2 = R2(operand2);
        display.textContent = operand2;
    }
});

const round0 = document.getElementById('round-0');
round0.addEventListener('click', () => {
    if (operand1 === '') {}
    else if (operand2 === '') {
        operand1 = R0(operand1);
        display.textContent = operand1;
    }
    else {
        operand2 = R0(operand2);
        display.textContent = operand2;
    }
});

const button = document.querySelectorAll('button');
const digits = document.querySelectorAll('.digits');
const theme = document.querySelector('.theme');
theme.addEventListener('click', (event) => {
    const darkModeClass = 'dark-mode';
    if (event.target.textContent === 'light') {
        theme.textContent = 'dark';
        document.body.classList.add(darkModeClass);
        button.forEach(element => element.classList.add(darkModeClass));
        digits.forEach(element => element.classList.add(darkModeClass));
    }
    else {
        theme.textContent = 'light';
        document.body.classList.remove(darkModeClass);
        button.forEach(element => element.classList.remove(darkModeClass));
        digits.forEach(element => element.classList.remove(darkModeClass))
    }
});