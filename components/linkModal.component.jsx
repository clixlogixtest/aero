import React, {useState, useEffect} from 'react';
import {Modal, Select, TextField, FormLayout} from '@shopify/polaris';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import Colorbox from './colorBox.component';
import {iconOptions} from '../selectOptions/list.options';
import Finder from './finder.component';

function LinkModal(props) {
    const {handleChange, active, icon, refetch, setActive, accessToken, hostId} = props;
       
    const [iconType,
        setIconType] = useState();
    const [type,
        setType] = useState()
    const [label,
        setLabel] = useState('');
    const [href,
        setHref] = useState('');
    const [id,
        setId] = useState();
    const [background,
        setBackground] = useState();
    const [color,
        setColor] = useState();
    const [iconLinkName,
        setIconLinkName] = useState();
    const [loading,
        setLoading] = useState(false)

    useEffect(() => {
        setIconType(icon.iconType);
        setType(icon.type)
        setLabel(icon.iconLabel)
        setHref(icon.iconHref)
        setBackground(icon.background)
        setColor(icon.color)
        setIconLinkName(icon.iconLinkName)
        setId(icon._id)
        setLoading(false)
    }, [icon])
    
    const handleSubmit = () => {
        const url = `/api/v1/icon/${id}`
        const object = {
            iconType: iconType,
            iconLabel: label,
            iconHref: href,
            background,
            color,
            iconLinkName,
            style: `background-color:${background};color:${color}`
        }
        if(!label || !href){
          alert("please provide required fields");
          return
        }
        axios
            .patch(url, object)
            .then(res => {
                if(res.data.status === "success"){
                    alert("changes saved")
                    setActive(false)
                }
                refetch()
            })
            .catch(err => console.log("some error has occured"))
    }

    const updateImage = () => {
        const elem = document.getElementById('update_image');
        elem.click();
    }
    const handleImage = (e) => {
        let fileInput = false
        if (e.target.files[0]) {
            fileInput = true
            setLoading(true)
        }
        if (fileInput) {
            Resizer.imageFileResizer(e.target.files[0], 120, 120, 'PNG', 100, 0, uri => {
                axios
                    .patch(`/api/v1/uploads/${id}/${icon.iconKey}`, {image: uri})
                    .then(res => {
                        alert('Link Image Updated')
                        fileInput = false
                        handleChange()
                        setLoading(false)
                        refetch()
                    })
            }, 'base64')
        }
        e.target.value = ''
    }
    const linkOptions = [
        {label: 'Product', value: 'product'},
        {label: 'Collection', value: 'collection'},
        {label: 'Page', value: 'page'},
        {label: 'Blog', value: 'blog'},
        {label: 'Other', value: 'other'}
    ];
    return (
        <div style={{
            width: 'auto'
        }}>
            <input
                type="file"
                accept="image/*"
                id="update_image"
                onChange={handleImage}
                hidden/>
            <Modal
                open={active}
                title={`Update ${label.toUpperCase()} Link`}
                onClose={handleChange}
                primaryAction={{
                content: 'Save Changes',
                onAction: handleSubmit
            }}
                secondaryActions={type === 'image'
                ? [
                    {
                        content: `${loading
                            ? 'uploading... .'
                            : 'Change Image'}`,
                        onAction: updateImage
                    }
                ]
                : null}>
                <Modal.Section>
                    <div className="link_edit_form">
                        <FormLayout>
                            <FormLayout.Group condensed>
                                <TextField
                                    value={label}
                                    maxLength="30"
                                    label="Link Label"
                                    onChange={(value) => setLabel(value)}
                                    placeholder="Label Of Link"/>
                                <Select
                                    label="Link Type"
                                    options={linkOptions}
                                    value={iconType}
                                    onChange={(value) => setIconType(value)}/>
                                <Colorbox
                                    title={"Button Color"}
                                    name={"background"}
                                    handle={setBackground}
                                    compact="true"
                                    value={background}/>
                            </FormLayout.Group>
                            <FormLayout.Group condensed>
                                {
                                    type === "icon" &&
                                    <Select
                                    label="Icon"
                                    options={iconOptions}
                                    value={iconLinkName}
                                    onChange={(value) => setIconLinkName(value)}/>
                                }

                                    {/* <TextField
                                    value={href}
                                    label="Link Address"
                                    onChange={(value) => setHref(value)}
                                    placeholder="Label Of Link"/> */}
                                    <Finder 
                                    type={iconType} 
                                    setHref={setHref} 
                                    href={href} 
                                    accessToken={accessToken}
                                    shopOrigin={hostId}
                                    edit={true}
                                    settedHref={icon.iconHref}
                                    />
                                {
                                type === "icon" && <Colorbox
                                    title={"Icon Color"}
                                    name={"color"}
                                    handle={setColor}
                                    value={color}
                                    compact="true"/>}
                            </FormLayout.Group>
                        </FormLayout>
                    </div>
                </Modal.Section>
            </Modal>
        </div>
    );
};

export default LinkModal;
