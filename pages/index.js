import React,{useState,useMemo, useEffect} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Button,Layout, Page, ButtonGroup, Card, Banner,Frame, Loading,Toast} from '@shopify/polaris';
import Widget from '../components/widget.component';
import Header from '../components/header.component';
import HomepageCard from '../components/homepageCards.component';
import axios from 'axios';
import {GET_SCRIPT_TAG, CREATE_SCRIPT_TAG, DELETE_SCRIPT_TAGS, SHOP_EMAIL} from '../graphql/actions';
import Router  from 'next/router';

function Overview({shopOrigin, host, pricing}) {
      const {SILVER_IMPRESSION, GOLD_IMPRESSION} = pricing;
      //====== DEFAULT STATE FOR COMPONENT =============================
      const[aeroStatus, setAeroStatus] = useState(false);
      const[scriptData, setScriptData] = useState(null);
      const[loadin, setLoadin] = useState(false);
      const[loadi, setLoadi] = useState(false);
      const[widget, setWidget] = useState()

      //====== MUTATION AND QUERY =======================================
      const {loading, error, data} = useQuery(GET_SCRIPT_TAG);
      const mail = useQuery(SHOP_EMAIL);
      const[createScript] = useMutation(CREATE_SCRIPT_TAG);
      const[deleteScript] = useMutation(DELETE_SCRIPT_TAGS);

      //=== FETCH WIDGET SCRIPT TAGS AND SET TO STATE ===========================
      useMemo(()=>{
        if(shopOrigin && !widget){
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
                setAeroStatus(data.enabled)
            }).catch(error => {
              console.log("some error has occured")
            })
        }
        if(data && data.scriptTags.edges && data.scriptTags.edges.length > 0){
          setScriptData(data.scriptTags.edges[0].node.id);
          setLoadi(false)
        }else{
          setScriptData(null);
          setLoadi(false)
        }
      },[data])

      // Add Mailling address only If no Email found
      useEffect(()=>{
        if(widget && !widget.hostEmail && mail.data){
           // ADD MAIL IF NO MAIL EXSTS
          const url = '/api/v1/widget';
          const object = {
            hostId: shopOrigin,
            hostEmail: mail.data.shop.email
          }
          axios.patch(url, object)
            .then(result => null)
            .catch(error => {
              console.log("some error has occured")
            })
        }
      },[mail.data, widget])


      // ENABLE AERO ============================================
      const enableScript = async() =>{
        const url = '/api/v1/widget';
        const object = {hostId: shopOrigin, enabled: true}
        axios.patch(url, object)
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
        const url = '/api/v1/widget';
        const object = {hostId: shopOrigin, enabled: false}
        axios.patch(url, object)
            .then(result => {
              setLoadin(false)
              setAeroStatus(false)
            })
            .catch(error => {
              console.log("some error has occured")
        });
      }

      // Function will Fresh Installl Aero on new Themes =========
      const freshInstall = () =>{
        // + DEFAULT PARAMETERS
        const object = {hostId: shopOrigin}
        const url = `/api/v1/widget`
        const deleteUrl = `/api/v1/widget/${shopOrigin}`

        // 2 DELETE FROM SHOPIFY
        if(scriptData){
          deleteScript({
            variables: {
              id: scriptData
            }
          })
        }
        // 3 CREATE NEW IN SHOPIFY
        createScript({
          variables:{
            input:{
              src:`${host}/aero.js`, 
              displayScope:"ALL"
              },
            },
            refetchQueries: [{ query: GET_SCRIPT_TAG }]
        });
      }

      //===== RENDER COMPONENT WITH ABOVE DATA =======================================
      if(widget){
        return (
          <div style={{backgroundColor:'#F4F6F8'}}>
            <Header dashboard={'dashboard'} />
            <Page>
              <div className="banner_info" style={{paddingTop: '8px'}}>
              <Banner
                title={`Current Plan: ${widget.plan.charAt(0).toUpperCase() + widget.plan.slice(1)}`}
                action={{content: 'View Status', onAction: () => Router.push('/pricing')}}
                secondaryAction={{content: 'Learn more About Pricing', onAction: () => window.open('https://www.launchtip.com/apps/aero/', '_blank')}}
                status="info"
              >
                <p>{`With Aero's Current Plan You Will Be Getting 
                ${widget.plan ==='free'? '500': widget.plan === 'silver'? SILVER_IMPRESSION : widget.plan ==='gold'? GOLD_IMPRESSION : widget.plan ==='platinum'? 'Unlimited': null} 
                Monthly Impressions and ${widget.plan === 'free'? '2': 'Unlimited'} Free Link Creations`}.</p>
              </Banner>
              </div>
              
              <div className="intro_container" style={{margin: '24px 0'}}>
              <Card>
              <div className="aero_intro" style={{display:'flex', padding:'16px'}}>
                <img src={'/images/aero-v2.png'} alt="logo" 
                style={{width:'90px', height:'90px', marginRight:'11px', borderRadius:'3px', boxShadow:'0 0 0 1px rgba(63,63,68,.05),0 1px 3px 0 rgba(63,63,68,.15)'}}/>
                <div className="heading-para">
                    <h1 style={{fontWeight:'600', fontSize:'22px', marginBottom:'10px'}}>Aero</h1>
                    <p style={{fontSize:'13px', lineHeight:'21px'}}>With Aero You can get your customers to the right places quicker and alleviate some of the pain while navigating. <br/> You can create links to important pages, promote specific products/collections and much more.</p>
                </div>
              </div>
              <div style={{display:'flex', padding:'16px', paddingTop:'0'}}>
              {
                  loading || loadin? 
                  <ButtonGroup>
                    <Button loading />
                    <Button onClick={()=> window.open('https://www.launchtip.com/apps/aero/', '_blank')}>
                      Learn More
                    </Button>
                  </ButtonGroup> :
                  aeroStatus? 
                  <ButtonGroup>
                    <Button primary
                    onClick={() => {setLoadin(true);disableScript()}}>
                      Aero Enabled
                    </Button>
                    <Button secondary className="slim_button" onClick={()=> window.open('https://www.launchtip.com/apps/aero/', '_blank')}>
                      Learn More
                    </Button>
                  </ButtonGroup>:
                  <ButtonGroup>
                    <Button destructive
                    onClick={() => {setLoadin(true);enableScript()}}>
                      Aero Disabled
                    </Button>
                    <Button secondary onClick={()=> window.open('https://www.launchtip.com/apps/aero/', '_blank')}>
                      Learn More
                    </Button>
                  </ButtonGroup>
                }
              </div>
              </Card>
              </div>
  
              <Layout className="polories-layout">
  
                <HomepageCard 
                title="Manage"
                description="Create And Manage Button Links"
                info="Create And Manage Button Links For Your Store"
                path="manage"
                buttonName="Manage"
                />
                <HomepageCard 
                title="Settings"
                description="Aero Settings"
                info="Control Aero's Appearance And Global Settings Including Visibility."
                path="settings"
                buttonName="Settings"
                />
                <Layout.AnnotatedSection
                title={'Installation'}
                description={"Check Current Theme For Aero"}
                >
                    <Card sectioned>
                        <div className="form-style margin0">
                        <label className="margin0 bold-text info-text">Just Switched Theme or Experiencing Issues With Aero? Click The Sync Button To Check And Reinstall.</label>
                           {
                             loadi? <Button loading /> :
                             <Button primary onClick={()=> {setLoadi(true);freshInstall()}}>Sync</  Button>
                           }
                        </div>
                    </Card>
                </Layout.AnnotatedSection>
                <HomepageCard 
                title="Knowledge Base"
                description="View Support Documents"
                info="Want To Learn More About Aero And How It Works? Visit The Knowledge Base."
                buttonName="View"
                site="https://www.launchtip.com/apps/aero/"
                />
  
                <HomepageCard 
                title="Request Support"
                description="Get Quick Support"
                info="Still having issues? Contact Customer Support."
                buttonName="Support"
                site="https://www.launchtip.com/get-in-touch/"
                />
  
              </Layout>
              <div className="from_launchtip" onClick={() => window.open('https://apps.shopify.com/partners/resquared', '_blank')}>
                <p><span>?</span>Apps From <span className="tip">Launchtip</span></p>
              </div>
            </Page>
            <Widget hostId={shopOrigin} />
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
  
  export default Overview;