import React,{useState, useMemo, useEffect} from 'react';
import axios from 'axios';
import {Page,Frame,Button, Loading,RadioButton,Card,Layout,Banner,FormLayout, TextField, Select} from '@shopify/polaris'; 
import Colorbox from '../components/colorBox.component';
import Widget from '../components/widget.component';
import SettingsMessengerArea from '../components/messenger.component';
import Header from '../components/header.component';

function AnnotatedLayout({shopOrigin, host}) {
    // DEFINE STATES
    const[aeroStatus, setAeroStatus] = useState(false);
    const[loadin, setLoadin] = useState(false);
    const[globalAeroSettings, setGloabalAeroSettings] = useState()
    const[widgetPosition, setWidgetPosition] = useState('')
    const[widgetShape, setWidgetShape] = useState('')
    const[widgetButtonColor, setWidgetButtonColor] = useState('')
    const[widgetMb, setWidgetMb] = useState()
    const[widgetMr, setWidgetMr] = useState()
    const[labelFc, setLabelFc] = useState('')
    const[labelBc, setLabelBc] = useState('')
    const[label, setLabel] = useState('')
    const[Facebook, setFacebook] = useState()
    const[Whatsapp, setWhatsapp] = useState()
    const[Slack, setSlack] = useState()
    const[Drift, setDrift] = useState()
    const[customCSS, setCustomCSS] = useState('')
    const[fetched, setFetched] = useState(false)
    const[plan, setPlan] = useState();
    const[widget, setWidget] = useState();
    const[mBanner, setMbanner] = useState(true);
    const[tBanner, setTbanner] = useState(true);

    // SET STATE VALUES
    useEffect(()=>{
      axios.get(`/api/v1/widget/${shopOrigin}`)
        .then(res=>{
          if(res.data && res.data.data) return res.data.data[0]
          return null
        })
        .then(data =>{
          if(data){
            setAeroStatus(data.enabled)
            setWidget(data)
            setWidgetPosition(data.widgetPosition)
            setWidgetShape(data.widgetShape)
            setWidgetButtonColor(data.widgetButtonColor)
            setWidgetMb(data.widgetMb)
            setWidgetMr(data.widgetMr)
            setLabelFc(data.labelFc)
            setLabelBc(data.labelBc)
            setLabel(data.label)
            setGloabalAeroSettings(data.globalAeroSettings)
            setFacebook(data.Facebook)
            setSlack(data.Slack)
            setDrift(data.Drift)
            setWhatsapp(data.Whatsapp)
            setCustomCSS(data.customCSS)
            setPlan(data.plan)
            setFetched(true)
          }
        }).catch(err => {
          console.log("some error has occured")
          console.log(err)
        });
    },[]);

    // ENABLE AERO ============================================
    const enableScript = async() =>{
      // 1 CREATE SCRIPT IN DATABASE
      const url = '/api/v1/widget';
      const object = {
        hostId: shopOrigin,
        enabled: true
      }
      axios.post(url, object)
          .then(result => {
            setAeroStatus(true);
            setLoadin(false);
          })
          .catch(error => {
            console.log("some error has occured")
          });
    }

    // DISABLE AERO =============================
    const disableScript = () =>{
      // 1 DISABLE SCRIPT IN DATABASE
      const url = '/api/v1/widget';
      const object = {hostId: shopOrigin, enabled: false}
      axios.patch(url, object)
          .then(result => {
            setAeroStatus(false);
            setLoadin(false);
          })
          .catch(error => {
            console.log("some error has occured")
          });
    }
    // SUBMIT STATE VALUES TO BACKEND
    const submitWidgetProperties = () => {
      if(customCSS && customCSS.includes('script')){
        alert('invalid characters detected in custom css tab')
        return
      }
      const object ={
        hostId: shopOrigin,
        globalAeroSettings,
        widgetPosition,
        widgetShape,
        widgetButtonColor,
        widgetMb,
        widgetMr,
        labelFc,
        labelBc,
        label,
        customCSS
      }
      const url = '/api/v1/widget';
      axios.patch(url, object)
            .then(result => alert('changes saved'))
            .catch(error => console.log("some error has occured"))
    }
     
      // WIDGET POSITION OPTIONS
      const positionOptions = [
        {label: 'Custom', value: 'custom'},
        {label: 'Bottom Right', value: 'bottom-right'},
        {label: 'Bottom Left', value: 'bottom-left'},
      ];
      const shapeOptions = [
        {label: 'Circle', value: 'circle'},
        {label: 'Square', value: 'square'},
        {label: 'Squircle', value: 'squircle'}
      ];

      // RENDER COMPONENT
      if(fetched){
        return (
          <div style={{backgroundColor:'#F4F6F8'}}>
            <Header settings={'settings'} submit={submitWidgetProperties} />
          <section className="m-0">
            <Page>
            <div className="banner_info" style={{paddingTop: '2px', marginBottom:'28px'}}>
            {
              tBanner &&
              <Banner
              title={`Manage Aero Widget`}
              onDismiss={() => setTbanner(false)}
              action={{content: 'Learn More', onAction: () => window.open('https://www.launchtip.com/apps/aero/', '_blank')}}
              status="info"
              >
                <p style={{fontSize:'14px', lineHeight:'21px'}}>Enable Global Aero Settings to Alter Aero Floating Widget Appearance across your store. Aero Floating Widget Will Appear on All Pages.</p>
              </Banner>
            }
            </div>
            <Layout className="polories-layout">
            
              <Layout.AnnotatedSection
                title="Global Visibility"
                description="Manage Aero's Visibility"
              >
                <Card sectioned>
                    <div className="form-style margin0">
                      <label className="margin0 bold-text">
                        {`Aero is currently ${aeroStatus? "active" : "inactive"} across your store.`}
                      </label>
                      {
                loadin? 
                  <Button loading />
                 :
                aeroStatus? 
                  <Button primary
                  onClick={() => {setLoadin(true);disableScript()}}>
                    Aero Enabled
                  </Button>
                :<Button destructive
                  onClick={() => {setLoadin(true);enableScript()}}>
                    Aero Disabled
                  </Button>
              }
                    </div>
                </Card>
              </Layout.AnnotatedSection>
  
              
                <Layout.AnnotatedSection
                title="Global Display Settings"
                description="Customize the postion and style of Aero in relation to your store"
                >
                <Card title="Floating Widget" sectioned>
                  <FormLayout>
                    <FormLayout.Group condensed>
                      <Colorbox title={"Button Color"} name={"widgetButtonColor"} value={widgetButtonColor} handle={setWidgetButtonColor} />
                        <TextField type="number" inputMode="numeric" maxLength="3" max="80" value={`${widgetMr}`} label="Margin Right" onChange={(value) => setWidgetMr(value)} />
                        <TextField type="number" inputMode="decimal" maxLength="3" value={`${widgetMb}`} label="Margin Bottom" onChange={(value) => setWidgetMb(value)} />
                      </FormLayout.Group>
                      <FormLayout.Group condensed>
                        <Select label="Position" options={positionOptions} value={widgetPosition}
                        onChange={(value)=> setWidgetPosition(value)} />
                        <Select label="Shape" options={shapeOptions} value={widgetShape}
                        onChange={(value)=> setWidgetShape(value)} />
                        <div/>
                      </FormLayout.Group>
                      <TextField
                          label="Custom Css"
                          maxLength="300"
                          placeholder="Example: border-radius: 25px; background-color: #F7F7F7; width:100px; height:100px; border: 2px solid #00000; ---- No Opening Closing Bracket required"
                          value={customCSS}
                          onChange={(value) => setCustomCSS(value)}
                          multiline={4}
                      />
                    </FormLayout>
                    </Card>
  
                    <Card title="Widget Label" sectioned>
                      <FormLayout>
                        <FormLayout>
                          <div style={{display:'flex', justifyContent:'space-between', maxWidth:'200px'}}>
                          <RadioButton
                            label="Turn On"
                            checked={label === 'labelOn' ? true: false}
                            onChange={()=> setLabel('labelOn')}
                          />
                          <RadioButton
                            label="Turn Off"
                            checked={label === 'labelOff'? true: false}
                            onChange={()=> setLabel('labelOff')}
                          />
                          </div>
                        </FormLayout>
                        {
                          label==='labelOn' && 
                          <FormLayout.Group condensed>
                            <Colorbox title={"Color"} name={"labelFc"} value={labelFc} handle={setLabelFc}/>
                            <Colorbox title={"Background"} name={"labelBc"} value={labelBc} handle={setLabelBc}/> 
                          </FormLayout.Group>
                        }
                        
                        </FormLayout>
                    </Card>
              </Layout.AnnotatedSection>
              
  
              <div className="banner_info" style={{padding: "10px",paddingTop: '8px', paddingBottom:"0", marginBottom:'3px', marginTop:'30px', borderTop:'1.5px solid #ddd', width:'100%'}}>
                {
                  mBanner && <Banner
                  title={`Manage integrations for Aero`}
                  status="info"
                  onDismiss={() => setMbanner(false)}
                  >
                    <p style={{fontSize:'14px', lineHeight:'21px'}}>With Aero Messenger Integration, convert customer queries into sales. Aero supports multiple popular chats including Facebook, WhatsApp, Drift and Slack.</p>
                  </Banner>
                }
              </div>
              <SettingsMessengerArea
                Facebook={Facebook}
                Slack={Slack}
                Drift={Drift}
                Whatsapp={Whatsapp}
                setFacebook={setFacebook}
                setSlack={setSlack}
                setDrift={setDrift}
                setWhatsapp={setWhatsapp}
                hostId={shopOrigin}
                widget={widget}
              />
  
              </Layout>
  
            </Page>
          </section>
          
          <Widget 
            bottom={widgetMb} 
            right={widgetMr} 
            position={widgetPosition}
            shape={widgetShape}
            background={widgetButtonColor}
            label={label}
            labelCl={labelFc}
            labelBc={labelBc}
            facebook={Facebook}
            whatsapp={Whatsapp}
            slack={Slack}
            drift={Drift}
            plan={plan}
            widget={widget}
            hostId={shopOrigin}
            settingsPage="true"
          />
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

  }
  
  export default AnnotatedLayout;