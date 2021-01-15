import React, {useState, useEffect} from 'react';
import {iconOptions} from '../selectOptions/list.options';
import {Button,Card,Page,Banner,FormLayout,Select,TextField,ButtonGroup,Frame,Loading} from '@shopify/polaris';
import LinkCard from '../components/links.component';
import Header from '../components/header.component';
import Router from 'next/router';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import Colorbox from '../components/colorBox.component';
import Finder from '../components/finder.component';

function Manage({shopOrigin, accessToken}) {
    const [widget, setWidget] = useState(true);
    const [toggle,setToggle] = useState('icon');
    const [iconImage,setImage] = useState();
    const [iconKey,setIconKey] = useState();
    const [iconLabel,setIconLabel] = useState('');
    const [iconType,setIconType] = useState('product');
    const [iconHref,setIconHref] = useState('');
    const [icon,setIcon] = useState();
    const [iconLinkName,setIconLinkName] = useState("fas fa-ribbon");
    const [iconColor,setIconColor] = useState('#000000')
    const [iconBackground,setIconBackground] = useState('#ffffff');
    const [floatingWidgetStatus,setFloatingWidgetStatus] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axios
            .get(`/api/v1/widget/${shopOrigin}`)
            .then(result => {
                if(result.data){
                  return result.data.data[0]
                }else{
                  return null
                }
            })
            .then(data => {
                setWidget(data);
                if(data) setFloatingWidgetStatus(data.floatingCart);
            }).catch(err => {
                console.log("some error has occured")
            })

        axios
            .get(`/api/v1/icon/${shopOrigin}`)
                .then(res => {setIcon(res.data.icons)})
                .catch(err => {
                    console.log("some error has occured")
                })
    }, [])

    // Function Submit properties to Backend
    const handleSubmit = () => {
        let required = [];
        if(!iconLabel) required.push('Icon Label')
        if(toggle === "image"){
            if(!iconImage) required.push('Icon Image');
        }
        if(toggle === "icon"){
            if(!iconLinkName) required.push('Fontawesome Icon')
        }
        if(!iconHref) {
            if(iconType === "product") required.push('Choose a Product')
            if(iconType === "collection") required.push('Choose a Collection')
            if(iconType === "page") required.push('Choose a Page')
            if(iconType === "blog") required.push('Choose a blog')
            if(iconType === "other") required.push('Provide a Link Address')
        }
        if(required.length > 0){
            const alertString = `Please provide ${
                required.map(item => {
                    return item
                }).join(" and ")
            }`;
            return alert(alertString);
        }
        
        const obj = {
            type: toggle,
            order: icon.length > 0? icon[icon.length -1].order + 1 : 0,
            hostId: shopOrigin,
            iconType,
            iconLabel,
            iconHref,
            iconImage,
            iconKey,
            iconLinkName,
            color: iconColor,
            background: iconBackground,
            style: `background-color:${iconBackground};color:${iconColor}`
        }
        if(!iconLabel || !iconHref) {alert("please provide required fields"); return}
        setLoading('creating-icon');
        axios
            .post('/api/v1/icon', obj)
            .then(res => {
                if(res.data.status === "fail"){
                    alert("To create more than 2 links, you need a Paid Plan. Please upgrade.");
                    Router.push('/pricing')
                    return
                }
                setIcon(res.data.icons);
                setIconLabel('')
                setIconType('product')
                setImage('')
                setIconHref('')
                setLoading(false)
                alert('link created')
            })
            .catch(err => {
                console.log("some error has occured");
                alert('only two images are allowed for free plan')
            })
    };

    // Function Open File Picker
    const openInput = () => {
        const elem = document.getElementById('custom-file');
        elem.click()
    }
    // Function Resize Images and Save to Backend
    const resizeImage = (e) => {
        let fileInput = false
        if (e.target.files[0]) {
            fileInput = true
        }
        if (fileInput) {
            Resizer.imageFileResizer(e.target.files[0], 120, 120, 'PNG', 100, 0, uri => {
                axios
                    .post('/api/v1/uploads', {image: uri})
                    .then(res => {
                        setImage(res.data.url);
                        setIconKey(res.data.public_id)
                        fileInput = false
                    })
            }, 'base64')
        }
        e.target.value = ''
    }

    // Function Disable/Enable Floating Widget -- PRO PLAN
    const manageFloatingWidget = (value) => {
        let floatingCart
        if (value === true) {
            floatingCart = true
        } else {
            floatingCart = false
        }
        const obj = {
            hostId: shopOrigin,
            floatingCart
        }
        axios
            .patch('/api/v1/widget', obj)
            .then(result => setFloatingWidgetStatus(value))
            .catch(error => {
                console.log("some error has occured")
            })
    }

    // LINK TYPE
    const linkOptions = [
        {
            label: "Product",
            value: "product"
        }, {
            label: 'Collection',
            value: 'collection'
        }, {
            label: 'Page',
            value: 'page'
        }, {
            label: 'Blog',
            value: 'blog'
        }, {
            label: 'Other',
            value: 'other'
        }
    ];
    if(widget){
        return (
            <div style={{
                backgroundColor: '#F4F6F8'
            }}>
                <Header manage={'manage'}/>
                <Page>
                    <section className="m-0 newcass">
                        <div
                            className="banner_info"
                            style={{
                            paddingTop: '8px'
                        }}>
                            <Banner
                            id="banner_link"
                            title={`Aero Links`}
                            status="info"
                            action={{content: 'Learn More', onAction: () => window.open('https://www.launchtip.com/apps/aero/', '_blank')}}
                            >
                            <p style={{fontSize:'14px', lineHeight:'21px'}}>Aero Links allows seamless integration of Links into store front. You can create links to products, collections, pages and blogs, You can also create custom links and enable floating add to cart or manage old links in this page.</p>
                            </Banner>
                        </div>
    
                        <div
                            className="manage_flex"
                            style={{
                            marginTop: '20px'
                        }}>
                            <div
                                className="manage_flex_1"
                                style={toggle === 'icon'
                                ? {
                                    width: '100%'
                                }
                                : null}>
                                <Card sectioned>
                                    <FormLayout>
                                        <FormLayout.Group condensed>
                                            <TextField
                                                value={iconLabel}
                                                maxLength="30"
                                                label="Link Label*"
                                                onChange={(value) => setIconLabel(value)}
                                                placeholder="Label Of Link"/>
                                            <Select
                                                label="Link Type*"
                                                options={linkOptions}
                                                value={iconType}
                                                onChange={(value) => setIconType(value)}/>
                                            <Finder type={iconType} shopOrigin={shopOrigin} accessToken={accessToken} setHref={setIconHref} href={iconHref} icon={icon} />
                                            
                                        </FormLayout.Group>
                                        <FormLayout.Group condensed>
                                            <div className="inline_block">
                                                <p
                                                    style={{
                                                    color: 'black',
                                                    marginBottom: '4px'
                                                }}>Icon Type</p>
                                                {toggle === 'icon'
                                                    ? <ButtonGroup segmented>
                                                            <Button pressed onClick={() => setToggle('icon')}>Icon</Button>
                                                            <Button onClick={() => setToggle('image')}>Image</Button>
                                                        </ButtonGroup>
                                                    : <ButtonGroup segmented>
                                                        <Button onClick={() => setToggle('icon')}>Icon</Button>
                                                        <Button pressed onClick={() => setToggle('image')}>Image</Button>
                                                    </ButtonGroup>
    }
                                            </div>
                                            <Colorbox
                                                title={"Button Color"}
                                                name={"iconBackground"}
                                                handle={setIconBackground}
                                                value={iconBackground}/> 
    
                                            {toggle === 'icon' && 
                                            <div style={{position:'relative'}}>
                                                <div className="fontawesome_preview">
                                                    <i className={iconLinkName}></i> 
                                                </div>
                                                <Select
                                                label="Select Icon"
                                                options={iconOptions}
                                                value={iconLinkName}
                                                onChange={(value) => setIconLinkName(value)}/>
                                                
                                            </div>
    }
                                            {toggle === 'icon' && <Colorbox
                                                title={"Icon Color"}
                                                name={"iconColor"}
                                                handle={setIconColor}
                                                value={iconColor}/>
    }
                                            <div
                                                style={{
                                                marginTop: '23px'
                                            }}>
                                                {
                                                    loading === "creating-icon" ? <Button loading></Button>:
                                                    <Button fullWidth primary onClick={() => handleSubmit()}>Add Link</Button>
                                                }
                                            </div>
                                        </FormLayout.Group>
                                    </FormLayout>
                                </Card>
                            </div>
                            {toggle === 'image' && <div className="manage_flex_2">
                                <p
                                    style={{
                                    paddingTop: '10px',
                                    color: 'black'
                                }}>Image</p>
                                <div className="icon_uploader">
                                    <div
                                        className="icon_image_preview"
                                        style={{
                                        backgroundImage: `url(${iconImage || '/images/upload_image.png'})`
                                    }}
                                        onClick={() => openInput()}/>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="custom-file"
                                    onChange={resizeImage}
                                    hidden/>
                            </div>
    }
                        </div>
    
                        <Card sectioned>
                            <div
                                className="stylish-area border-bottom-0 no_flex"
                                style={{
                                position: 'relative'
                            }}>
                                <div className="floating-left full_width_mobile">
                                    <h5 className={widget.plan === "free"? "pro": ""}>Floating Add to Cart</h5>
                                    <p>Enables the powerful floating add to cart button.</p>
                                    <p>This appears on product pages.</p>
                                </div>
                                <div
                                    className="floating-right"
                                    style={{
                                    display: 'block'
                                }}>
                                    {
                                    !widget.plan || widget.plan === "free" && 
                                    <div className="paid">
                                        <i>Requires
                                            <b> Paid Plan</b>
                                        </i>
                                    </div>
                                    }
                                    {widget.plan === 'free'
                                        ? <Button primary onClick={() => Router.push('/pricing')}>
                                                <i>Upgrade</i>
                                            </Button>
                                        : floatingWidgetStatus
                                            ? <Button primary onClick={() => manageFloatingWidget(false)}>Enabled</Button>
                                            : <Button primary onClick={() => manageFloatingWidget(true)}>Enable Now</Button>
    }
                                </div>
                            </div>
                        </Card>
    
                        <div className="w-100 manage-links">
                            <LinkCard hostId={shopOrigin} icon={icon} widget={widget} accessToken={accessToken} />
                        </div>
    
                    </section>
                </Page>
            </div>
        )
    }else{
        return(
          <div style={{height: '500px'}}>
              <Frame>
                  <Loading />
              </Frame>
          </div>
        )
    }
    
};

export default Manage;