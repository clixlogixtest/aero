import React from 'react';
import Sketch from './colorPicker.component';

function Colorbox({title, name, value, handle, compact}) {
    return (
        <React.Fragment>
            <p
                style={{
                marginBottom: '4px',
                color: 'black'
            }}>{title}</p>
            <div
                className="colo-picker"
                style={{
                overflow: 'hidden'
            }}>
                <span>
                    <Sketch name={name} color={value} set={handle} compact={compact}/>
                </span>
                <input
                    style={{
                    border: 'none',
                    outline: 'none',
                    maxWidth: '60%'
                }}
                    readOnly
                    type="text"
                    value={value}/>
            </div>
        </React.Fragment>
    )
}

export default Colorbox;
