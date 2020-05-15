import React, { Component } from 'react'

import Argument from '../components/Argument/Argument'
import Button from '../components/Button'
import Result from '../components/Result/Result'
import Aux from '../hoc/Auxiliary'
import './Arguments.css'

class Arguments extends Component {
    state = {
        firstExpression: '',
        secondExpression: '',
        result: ''
    }

    removeAllExpressions = () => {
        this.setState({ firstExpression: '', secondExpression: '' })
    }
    // this is my main function
    concatenation = (firstExpression, secondExpression) => {
        // regular expression to take single terms from expression
        const regularExpressionTermsPattern = /(([(]?[-]?(([0-9]+[.][0-9]+)|([0-9]*))[)]?[x]{1}([^][-]?((([0-9]+[.][0-9]+)|([0-9]*)))|))|[(]?[-]?(([0-9]+[.][0-9]+)|[0-9]+)[)]?)/g
        // first expression provided by user, divided into single terms
        let firstExpressionTerms = firstExpression.match(regularExpressionTermsPattern)
        // second expression provided by user, divided into single terms
        let secondExpressionTerms = secondExpression.match(regularExpressionTermsPattern)
        // now I will compare every term from first expression with every term from second expression
        for(let i = 0; i < firstExpressionTerms.length; i++) {
            // check exponent of first compared value
            let firstExpressionExponent = this.takeExponent(firstExpressionTerms[i].toString())
            
            for(let j = 0; j < secondExpressionTerms.length; j++) {
                // this condition check whether compared value from secondExpressionTerms isn' t 0
                if(secondExpressionTerms[j] !== 0) {
                    // check exponent of second compared value
                    let secondExpressionExponent = this.takeExponent(secondExpressionTerms[j].toString())
                    // this condition check whether exponents of compared terms are equal
                    if(firstExpressionExponent === secondExpressionExponent) {
                        // take coefficient values for actually compared terms
                        let firstExpressionCoefficient = this.takeCoefficient(firstExpressionTerms[i].toString())
                        let secondExpressionCoefficient = this.takeCoefficient(secondExpressionTerms[j].toString())
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
        // before showing result I join the firstExpressionTerms values by ' + '
        this.setState({ result: firstExpressionTerms.join(' + ') })
    }
    // takeExponent and takeCoefficient are two ancillary functions
    takeExponent = (expression) => {
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

    takeCoefficient = (expression) => {
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

    render() {
        return (
            <Aux>
                <div className='Rules'>
                    <p>If you want to provide negative coefficient, you have to use brackets. For example: (-5)x </p>
                    <p>If you want to provide negative exponent, please provide it without brackets. For example: x^-2.543 </p>
                    <p>Terms in sequence have to be divided by ' + '. I mean that you have to sum one term to each another, 
                        but if you want to provide negative value do it as I said in the above examples. So if you want
                        to subtract values, you should do it like that -> ... + (-2)x^2 + ...</p>
                </div>
                <div className='Arguments'>
                    <Argument expression={this.state.firstExpression}/>
                    <Argument expression={this.state.secondExpression}/>
                </div>
                <div className='ControlPanel'>
                    <input type='text' value={this.state.firstExpression} onChange={e => this.setState({ firstExpression: e.target.value })}/>
                    <input type='text' value={this.state.secondExpression} onChange={e => this.setState({ secondExpression: e.target.value })}/>
                    <Button  clicked={this.removeAllExpressions}>Reset wyrażeń</Button>
                    <Button  clicked={() => this.concatenation(this.state.firstExpression, this.state.secondExpression)}>Wynik</Button>
                </div>
                <Result result={this.state.result}/>
            </Aux>
        ) 
    }
}

export default Arguments