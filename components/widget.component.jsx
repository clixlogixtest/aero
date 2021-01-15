import React, {useState, useMemo} from 'react';
import axios from 'axios';
import ReactCSS from 'reactcss';

function Widget(props) {
    const hostId = props.hostId;
    // SET DEFAULT STATE
    const [fetched,
        setFetched] = useState(false)
    const [right,
        setRight] = useState()
    const [bottom,
        setBottom] = useState()
    const [background,
        setBackground] = useState()
    const [labelCl,
        setlabelCl] = useState()
    const [labelBc,
        setLabelBc] = useState()
    const [widgetShape,
        setWidgetShape] = useState()
    const [widgetPosition,
        setWidgetPosition] = useState()
    const [facebook,
        setFacebook] = useState()
    const [whatsapp,
        setWhatsapp] = useState()
    const [slack,
        setSlack] = useState()
    const [drift,
        setDrift] = useState()
    const [labe,
        setLabel] = useState()
    const [icons,
        setIcons] = useState()
    const [plan,
        setPlan] = useState()
    

    // CHECK FOR PROPS IF YES REPLACE STATE VALUES WITH PROPS FOR SETTINGS PAGE
    const label = props.label || labe
    const fb = props.facebook || facebook
    const wp = props.whatsapp || whatsapp
    const dft = props.drift || drift
    const slk = props.slack || slack

    // EXECUTES IF WIDGET SHAPE AVAILABLE && IS OTHER THAN CUSTOM
    let radius;
    const shape = props.shape || widgetShape;
    if (shape === 'square') {
        radius = '2'
    } else if (shape === 'squircle') {
        radius = '25'
    } else {
        radius = '190'
    }

    // EXECUTES IF WIDGET POSITION AVAILABLE AND IS OTHER THAN CUSTOM
    let customRight = 2;
    let customBottom = 12;
    const position = props.position || widgetPosition;
    if (position === 'bottom-right') {
        customRight = '2'
        customBottom = '5'
    } else if (position === 'bottom-left') {
        customRight = '90'
        customBottom = '5'
    } else {
        customRight = props.right || right
        customBottom = props.bottom || bottom
    }

    // FETCH WIDGET VALUES AND SET FETCHED TO TRUE TO RENDER WIDGET
    useMemo(() => {
        if (hostId && !props.settingsPage) {
            axios
                .get(`/api/v1/widget/${hostId}`)
                .then(res => {
                    if(res.data && res.data.data && res.data.data.length >0){
                        return res.data.data[0]
                    }
                })
                .then(data => {
                    if(data){
                    setRight(data.widgetMr)
                    setBottom(data.widgetMb)
                    setWidgetPosition(data.widgetPosition)
                    setWidgetShape(data.widgetShape)
                    setBackground(data.widgetButtonColor)
                    setLabel(data.label)
                    setLabelBc(data.labelBc)
                    setlabelCl(data.labelFc)
                    setFacebook(data.Facebook)
                    setDrift(data.Drift)
                    setSlack(data.Slack)
                    setWhatsapp(data.Whatsapp)
                    setFetched(true)
                    setPlan(data.plan)
                    }
                }).catch(err => console.log("some error has occured"))
        }
        const url = `/api/v1/icon/${hostId}`
        axios
            .get(url)
            .then(res => {
                let icons = res.data.icons
                icons = icons.sort(function(a, b) { 
                    return a.order - b.order
                });
                setIcons(icons);
                setFetched(true)
            })
            .catch(err => console.log("some error has occured"))
    }, [hostId])

    // DEFINE CUSTOM CSS
    const styles = ReactCSS({
        'default': {
            buttonCover: {
                position: 'fixed',
                right: `${customRight || props.right || 2}%`,
                bottom: `${customBottom || customBottom || 12}%`,
                cursor: 'pointer'
            },
            toggleBtn: {
                backgroundColor: `${props.background || background || '#1d3c3f'}`,
                fontSize: '60px',
                color: '#fff',
                fontWeight: '100',
                position: 'relative',
                borderRadius: `${radius}px`
            },
            label: {
                color: `${props.labelCl || labelCl || '#ffffff'}`,
                background: `${props.labelBc || labelBc || '#778E8E'}`
            }
        }
    });

    // WORKAROUND ON WIDGET CLICK
    const handleClick = () => {
        const elem = document.getElementById('toggle-btn');
        const iconContainer = document.getElementById('social-icons');
        iconContainer
            .classList
            .toggle('auto-hw')
        elem
            .classList
            .toggle('rotate-button');
    }

    // RENDER WIDGET IF FETCHED IS TRUE
    if (fetched) {
        return (
            <div id="button-cover" className="button-cover" style={styles.buttonCover}>
                <div className="test"></div>
                <div className="social-icons" id="social-icons">
                    {icons && icons.map((icon, i) => {
                        if(plan === "free" && i > 1) return
                        return (icon.enabled && <div className="image-name mb-3" key={i}>
                            <a target="_blank" href={`${icon.iconHref}`} className="fb-xfbml-parse-ignore">
                                {label === 'labelOn' && <div className="drop-shadow">
                                    <label style={styles.label} className="mb-0 mr-3 messenger-label">{icon.iconLabel}</label>
                                </div>
}
                                {icon.type === 'image'
                                    ? <img
                                            style={{
                                            backgroundColor: `${icon.background}`
                                        }}
                                            src={icon.iconImage}/>
                                    : <div className="font_icon">
                                        <div
                                            className="floating_icon"
                                            style={{
                                            backgroundColor: `${icon.background}`,
                                            color: `${icon.color}`
                                        }}>
                                            <i className={icon.iconLinkName}></i>
                                        </div>
                                    </div>
}
                            </a>
                        </div>)
                    })
}
                    {slk && <div className="image-name mb-3">
                        <a href={`https://slack.com/app_redirect?channel=${slk}`} target="_blank">
                            {label === 'labelOn' && <div className="drop-shadow">
                                <label style={styles.label} className="mb-0 mr-3 messenger-label">Slack</label>
                            </div>
}
                            <img src="images/slack.png"/>
                        </a>
                    </div>
}
                    {dft && <div className="image-name mb-3">
                            {label === 'labelOn' && <div className="drop-shadow">
                                <label onClick={()=> alert("can be tested on website only")} style={styles.label} className="mb-0 mr-3 messenger-label">Drift</label>
                            </div>
}
                            <img onClick={()=> alert("can be tested on website only")} src="images/drift.png"/>
                    </div>
}
                    {wp && <div className="image-name mb-3">
                        <a
                            className="drop-shadow"
                            href={`https://api.whatsapp.com/send?phone=+${wp}&text=Hi%20we%20need%20help%20regarding%20something`}
                            target="_blank">
                            {label === 'labelOn' && <div className="drop-shadow">
                                <label style={styles.label} className="mb-0 mr-3 messenger-label">WhatsApp</label>
                            </div>
}
                            <img src="images/whatsapp.png"/>
                        </a>
                    </div>
}
                    {fb && <div className="image-name mb-3">
                        <a target="_blank" href={`http://m.me/${fb}`} className="fb-xfbml-parse-ignore">
                            {label === 'labelOn' && <div className="drop-shadow">
                                <label style={styles.label} className="mb-0 mr-3 messenger-label">Messenger</label>
                            </div>
}
                            <img src="images/fb.svg"/>
                        </a>
                    </div>
}

                </div>

                <div
                    className="widget_button"
                    onClick={() => {
                    handleClick()
                }}>
                    <div
                        className="toggle-btn button-icon"
                        id="toggle-btn"
                        style={props.customCSS || styles.toggleBtn}/>
                </div>
            </div>

        )
    } else {
        // IF FETCHED IS FALSE RENDER NOTHING
        return <div></div>
    }
}

//EXPORT WIDGET
export default Widget;
