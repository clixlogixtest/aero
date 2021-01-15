import React from 'react';

function MatButton(props) {
    const {name, red, func, funcValue} = props

    return (
        <button 
        onClick={()=> {
            if(func) func(funcValue)
        }}
        className="slim_button" 
        style={red ? {backgroundColor:'red', color:'#ffffff', marginRight:'0'}: {backgroundColor:'#5563c1', color:'#ffffff', marginRight:'0'}}
        >
            {name}
        </button>
    )
}

export default MatButton;
