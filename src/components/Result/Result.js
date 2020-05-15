import React from 'react'

import './Result.css'

const result = (props) => {
    return(
        <div className='Result-box'>
            <p>RESULT: {props.result}</p>
        </div>
    )
}

export default result