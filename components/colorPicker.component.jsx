import React, {useState, useEffect} from 'react';
import reactCSS from 'reactcss';
import { ChromePicker } from 'react-color';

const Sketch = (props) => {

    // Define State and Default Values
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [color, setColor] = useState('#fff');
    
    // Set Default Color to Parent State Color
    useEffect(()=>{
        setColor(props.color);
    }, [props.color])

    // Handle Click Action
    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker );
    };
    // Close Picker on Clicking Anywhere Else
    const handleClose = () => {
        setDisplayColorPicker(false)
    };
    // Set Parent Color State on Change
    const handleChange = (color) => {
        setColor(color.hex)
        props.set(color.hex)
    };

    // Defined Custom CSS Properties
    const styles = reactCSS({
            'default': {
              color: {
                width: '46px',
                height: '14px',
                borderRadius: '2px',
                background: `${color}`,
                marginTop: '2px',
                border: '.3px solid #e2e2e2'
              },
              swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
              },
              popover: {
                position: 'absolute',
                zIndex: '2147483647',
              },
              cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
              },
            },
    });

    // Return Color Picker Pallete
    return(
            <div style={{marginTop:'3px'}}>
            <div style={ styles.swatch } onClick={ handleClick }>
              <div style={ styles.color } />
            </div>
            { displayColorPicker &&
            <div style={ styles.popover }>
              <div style={ styles.cover } onClick={ handleClose }/>
              <div className="coverri" style={props.compact? {position:'fixed', top:'5px', left:'5px'}: null}>
                <ChromePicker color={ color } onChange={ handleChange } />
              </div>
            </div> 
            }
          </div>
    )
}

// export Default Component
export default Sketch