import React from 'react'

import './Argument.css'

const argument = (props) => {
    return (
        <div className='Argument'>
            <p>{props.expression}</p>
        </div>
    )
}

export default argument