state = {
    firstOperand: undefined,
    operator: undefined,
    secondOperand: undefined,
    isResult: false
}

clearState(state);

function clearState(state) {
    state.firstOperand = '';
    state.operator = '';
    state.secondOperand = '';
    state.isResult = false;
}

const numbers = document.querySelectorAll('.number');
const operations = document.querySelectorAll('.operator');
const clearSymbolBtn = document.getElementById('ce');
const clearAllBtn = document.getElementById('c');
const equalButton = document.getElementById("result");
const display = document.getElementById('display');

numbers.forEach(button => {
    button.addEventListener('click', () => {
        pressNumber(button.innerText, state);
        renderDisplay(state);
    })
})

operations.forEach(button => {
    button.addEventListener('click', () => {
        pressOperator(button.innerText, state);
        renderDisplay(state);
    })
})
equalButton.addEventListener('click', () => {
    evaluate(state);
    state.isResult = true;
    renderDisplay(state);
})

clearSymbolBtn.addEventListener('click', () => {
    clear(state);
    renderDisplay(state);
});

clearAllBtn.addEventListener('click', () => {
    clearState(state);
    renderDisplay(state);
});

function renderDisplay(state) {
    if (!state.operator) {
        display.value = state.firstOperand;
    } else {
        display.value = `${state.firstOperand} ${state.operator} ${state.secondOperand}`;
    }
}

function pressNumber(number, state) {
    if (state.isResult) clearState(state);
    const operand = !state.operator ? "firstOperand" : "secondOperand";
    if (validChar(number, state[operand])) {
        if (state[operand] === '0' && number !== '.') {
            state[operand] = number;
        } else state[operand] += number;
    }
}

function validChar(char, operand) {
    if (char === '.' && !operand.includes('.')) return true;
    let lastChar = operand[operand.length - 1];

    if (char === '√' || char === '-') {
        if (operand.length === 0) return true;
        if (lastChar === '√') return true;
        if (operand[0] === '-') return true;
    }
    if (char === '^' && /[0-9]/g.test(lastChar)) return true;

    return /[0-9]/g.test(char);
}

function pressOperator(operator, state) {
    if (operator === '-') {
        const operand = !state.operator ? "firstOperand" : "secondOperand";
        const operandVal = state[operand];
        if (operandVal[operandVal.length - 1] === '-') return;
    }
    if (state.firstOperand && state.operator && state.secondOperand) {
        evaluate(state);
    }
    state.operator = operator;
    state.isResult = false;
}

function clear(state) {
    state.isResult = false;
    let operand = !state.operator ? "firstOperand" : "secondOperand";
    state[operand] = state[operand].substring(0, state[operand].length - 1);
}

function evaluate(state) {
    if (state.firstOperand) {
        let result;
        if (state.operator && state.secondOperand) {
            result = evaluateBinary(state.firstOperand, state.operator, state.secondOperand);
        } else {
            if (state.firstOperand.includes('√-')) {
                result = 'Illegal operation!';
            } else result = evaluateUnary(state.firstOperand);
        }
        clearState(state);
        state.firstOperand = "" + result;
    }
}

function evaluateUnary(expression) {
    if (expression[0] === '-') {
        return -evaluateUnary(expression.slice(1));
    }
    if (expression.includes('√')) {
        return evaluateSqrt(expression);
    }
    if (expression.includes('^')) {
        return evaluatePower(expression);
    }
    return parseFloat(expression);
}

function evaluateBinary(first, operator, second) {
    let firstOperand = evaluateUnary(first);
    let secondOperand = evaluateUnary(second);
    let result = 0;
    switch (operator) {
        case '+': {
            result = firstOperand + secondOperand;
            break
        }
        case '-': {
            result = firstOperand - secondOperand;
            break
        }
        case '*': {
            result = firstOperand * secondOperand;
            break
        }
        case '/': {
            result = firstOperand / secondOperand;
            break
        }
    }
    return parseFloat(result.toFixed(12));
}

function evaluatePower(expression) {
    let index = expression.lastIndexOf('^');
    let base = expression.substring(0, index);
    let exponent = expression.substring(index + 1);
    return Math.pow(evaluateUnary(base), evaluateUnary(exponent));
}

function evaluateSqrt(expression) {
    return Math.sqrt(evaluateUnary(expression.slice(1)));
}