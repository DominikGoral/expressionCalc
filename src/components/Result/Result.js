import React from 'react'

import './Result.css'

const result = (props) => {
    return(
        <div className='Result-box'>
            <p>WYNIK: {props.result}</p>
        </div>
    )
}

export default result