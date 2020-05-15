import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import Arguments from './containers/Arguments'

const assert = require('assert')

// it('It correctly calculates the sum of 2x^2 + 3 and 3x^3 + x^2', () => {
//   assert.equal(concatenation('2x^2 + 3', '3x^3 + x^2'), '3x^2 + 3 + 3x^3')
// })

// takeExponents testing
it('It is correctly finds exponents of 2x^2', () => {
  assert.equal(takeExponent('2x^2'), '2')
})

it('It is correctly finds exponents of 2x^-2.4352', () => {
  assert.equal(takeExponent('2x^-2.4352'), '-2.4352')
})

it('It is correctly finds exponents of 2x^2.333', () => {
  assert.equal(takeExponent('2x^2.333'), '2.333')
})

it('It is correctly finds exponents of x', () => {
  assert.equal(takeExponent('x'), '1')
})

it('It is correctly finds exponents of number (in this case 5)', () => {
  assert.equal(takeExponent('5'), '0')
})

// takeCoefficient testing
it('It is correctly finds coefficient of 2x^2', () => {
  assert.equal(takeCoefficient('2x^2'), '2')
})

it('It is correctly finds coefficient of 2x^-2.4352', () => {
  assert.equal(takeCoefficient('-2x^-2.4352'), '-2')
})

it('It is correctly finds coefficient of 2.434x^2.333', () => {
  assert.equal(takeCoefficient('2.434x^2.333'), '2.434')
})

it('It is correctly finds coefficient of -2.434x^2.333', () => {
  assert.equal(takeCoefficient('-2.434x^2.333'), '-2.434')
})

it('It is correctly finds coefficient of x', () => {
  assert.equal(takeCoefficient('x'), '1')
})

it('It is correctly finds coefficient of number (in this case 5)', () => {
  assert.equal(takeCoefficient('5'), '5')
})

// concatenation testing
it('It is correctly concat given expressions 2x^2 + 3, 3x^3 + x^2', () => {
  assert.equal(concatenation('2x^2 + 3', '3x^3 + x^2'), '3x^2 + 3 + 3x^3')
})

it('It is correctly concat given expressions 2x^2 + 3, 3x^3 + (-1)x^2 with negative coefficient', () => {
  assert.equal(concatenation('2x^2 + 3', '3x^3 + (-1)x^2'), '1x^2 + 3 + 3x^3')
})

it('It is correctly concat given expressions 2x^2 + 3, 3x^3 + (-1)x^-2 with negative coefficient and exponent', () => {
  assert.equal(concatenation('2x^2 + 3', '3x^3 + (-1)x^-2'), '2x^2 + 3 + 3x^3 + (-1)x^-2')
})

it('It is correctly concat given expressions 2x^2 + 3, 3x^3 + (-1.11)x^-2 with negative real coefficient and real exponent', () => {
  assert.equal(concatenation('2x^2 + 3', '3x^3 + (-1.11)x^-2.5'), '2x^2 + 3 + 3x^3 + (-1.11)x^-2.5')
})

it('It is correctly concat given expressions 2x^2 + 3, 3x^3 + (-1.2)x^2 with negative real coefficient and real exponent', () => {
  assert.equal(concatenation('2x^2 + 3', '3x^3 + (-1.2)x^2'), '0.8x^2 + 3 + 3x^3')
})

it('It is correctly concat given expressions 2x^2.1 + 3, 3x^3 + (-1.2)x^2.1 with negative real coefficient and real exponent', () => {
  assert.equal(concatenation('2x^2.1 + 3', '3x^3 + (-1.2)x^2.1'), '0.8x^2.1 + 3 + 3x^3')
})

it('It is correctly notify about error', () => {
  assert.equal(concatenation('asdasd', 'dsadasd'), 'Provided arguments are not correct')
})


// ************* FUNCTIONS TO TESTS *********************
function takeExponent(expression) {
  // if expression is only number
  let exponent = '0'
  // if expression is complex, I mean it is something like 2x^2, so we' ve got coefficient and exponent
  if(expression.includes("^")) {
      let indexOfPowerSize = expression.indexOf('^')
      exponent = expression.slice(indexOfPowerSize + 1, expression.length)
  // if expression is a little bit less complex, we haven' t got exponent
  } else if(expression.includes("x")) {
      exponent = '1'
  }
  
  return exponent
}

function concatenation(firstExpression, secondExpression) {
  let result = ''
  // regular expression to take single terms from expression
  const regularExpressionTermsPattern = /(([(]?[-]?(([0-9]+[.][0-9]+)|([0-9]*))[)]?[x]{1}([^][-]?((([0-9]+[.][0-9]+)|([0-9]*)))|))|[(]?[-]?(([0-9]+[.][0-9]+)|[0-9]+)[)]?)/g
  // first expression provided by user, divided into single terms
  let firstExpressionTerms = firstExpression.match(regularExpressionTermsPattern)
  // second expression provided by user, divided into single terms
  let secondExpressionTerms = secondExpression.match(regularExpressionTermsPattern)
  // if we provided arguments are like 'dasdadfsbhjwfwy', so it doesnt match to regular expression pattern
  if(firstExpressionTerms === null || secondExpressionTerms === null) {
      result = 'Provided arguments are not correct'
      return result
  } else {
      // now I will compare every term from first expression with every term from second expression
      for(let i = 0; i < firstExpressionTerms.length; i++) {
          // check exponent of first compared value
          let firstExpressionExponent = takeExponent(firstExpressionTerms[i].toString())
          
          for(let j = 0; j < secondExpressionTerms.length; j++) {
              // this condition check whether compared value from secondExpressionTerms isn' t 0
              if(secondExpressionTerms[j] !== 0) {
                  // check exponent of second compared value
                  let secondExpressionExponent = takeExponent(secondExpressionTerms[j].toString())
                  // this condition check whether exponents of compared terms are equal
                  if(firstExpressionExponent === secondExpressionExponent) {
                      // take coefficient values for actually compared terms
                      let firstExpressionCoefficient = takeCoefficient(firstExpressionTerms[i].toString())
                      let secondExpressionCoefficient = takeCoefficient(secondExpressionTerms[j].toString())
                      // here we are counting new coefficient
                      let newCoefficent = parseFloat(firstExpressionCoefficient) + parseFloat(secondExpressionCoefficient)

                      let newFirstExpressionTerms = ''
                      // this condition check whether our actually term is only number, only x, or more complex term like 2x^-2.3
                      // according to situation I create updated value of term which I'm going to use to replace old value
                      if(firstExpressionTerms[i].includes("x^")) {
                          newFirstExpressionTerms = newCoefficent.toString() + 'x^' + firstExpressionExponent
                      } else if(firstExpressionTerms[i].includes("x")) {
                          newFirstExpressionTerms = newCoefficent.toString() + 'x'
                      } else {
                          newFirstExpressionTerms = newCoefficent.toString()
                      }
                      // replacing old terms. New term have updated coefficient value
                      firstExpressionTerms[i] = newFirstExpressionTerms
                      // and in order to don' t use this value again I assign 0. That's why the first condition in this loop is if(secondExpressionTerms[j] !== 0)
                      // because if value was added, we can' t do it again
                      secondExpressionTerms[j] = 0
                  }
              }
              
          }
      }
      // this loop is checking whether we have values in secondExpressionTerms array which exponents wasn' t equal to any exponents from firstExpressionTerms values array
      for(let i = 0; i < secondExpressionTerms.length; i++) {
          if(secondExpressionTerms[i] !== 0) {
              firstExpressionTerms.push(secondExpressionTerms[i])
          }
      }
      result = firstExpressionTerms.join(' + ')
      // before showing result I join the firstExpressionTerms values by ' + '
      return result
  }
}

function takeCoefficient(expression) {
  let indexOfVariable = expression.indexOf('x')
  // if expression is onlu number
  let coefficient = expression
  // if expression doesn' t have coefficient
  if(indexOfVariable === 0) {
      coefficient = 1
  // if expression have coefficient
  } else if(indexOfVariable > 0) {
      // if coefficient is negative value, because user should provide it in brackets
      if(expression[0] === '(') {
          coefficient = expression.slice(1, indexOfVariable - 1)
      // if coefficient is positive value 
      } else {
          coefficient = expression.slice(0, indexOfVariable)
      }
  }
  
  return coefficient
}
