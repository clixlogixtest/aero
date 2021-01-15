import React, {useEffect, useState, useContext} from 'react';
import {Page, Layout, Banner, Button, Frame, Loading} from '@shopify/polaris';
import createApp from '@shopify/app-bridge';
import {Redirect} from '@shopify/app-bridge/actions';
import {useMutation} from '@apollo/react-hooks';
import {CHARGE_PAYMENT, CANCEL_SUBSCRIPTION} from '../graphql/actions';
import Header from '../components/header.component';
import axios from 'axios';

function Pricing({shopOrigin, pricing, apiKey, host}) {
    const {SILVER, GOLD, PLATINUM, SILVER_IMPRESSION, GOLD_IMPRESSION, PLATINUM_IMPRESSION, TEST} = pricing;
    const [widget, setWidget] = useState();
    const [loading, setLoading] = useState();
    const [plan,setPlan] = useState();
    const [enabled, setEnabled] = useState();
    const [impressions,setImpressions] = useState(false);
    const [chargePayment, {data}] = useMutation(CHARGE_PAYMENT);
    const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION);

    const app = createApp({
        apiKey,
        shopOrigin: shopOrigin
    })
    const redirect = Redirect.create(app);

    // Function takes action on upgrades
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
                if(data){
                    setWidget(data);
                    setImpressions(data.impressions)
                    setPlan(data.plan)
                    setEnabled(data.enabled)
                }
            })
        if (data) {
            // Redirect to Confirmation Url
            //router.push(data.appSubscriptionCreate.confirmationUrl);
            redirect.dispatch(Redirect.Action.REMOTE,{
                url: data.appSubscriptionCreate.confirmationUrl
            });
        }
    }, [data])

    const cancelPayment = async() => {
        await axios
            .get(`/api/v1/widget/${shopOrigin}`)
            .then(result => result.data.data[0])
            .then(data => {
                cancelSubscription({
                    variables: {
                        "id": data.paymentId
                    }
                })
            })
        axios.patch(`/api/v1/widget/unsubscribe/${shopOrigin}`)
        .then(res => {
            if(res.data.status === "success"){
                alert('successfully unsubscribed');
                setTimeout(() => {
                    location.reload(true);
                }, 1000);
                setLoading(false)
            }else{
                console.log('some error occured while unsubscribing')
            }
        })
    }

    // PLATINUM PLAN DETAILS
    const upgrade = async(name, amount) => {
        const data = await chargePayment({
            variables: {
                name: name,
                lineItems: [
                    {
                        "plan": {
                            appRecurringPricingDetails: {
                                price: {
                                    amount: parseFloat(amount),
                                    currencyCode: 'USD'
                                }
                            }
                        }
                    }
                ],
                returnUrl: host,
                test: TEST === 'true' ? true : false
            }
        });
    }
    if(widget){
        return (
            <div style={{
                backgroundColor: '#F4F6F8'
            }}>
                <Header pricing={'pricing'}/>
                <Page>
                    <div className="profile_info_data">
                        <div className="child_container">
                            <div className="child">
                                <span className="plan">
                                    Active Plan
                                </span>
                                <span className="plan_name">
                                    {widget.plan}
                                </span>
                            </div>
                        </div>
                        <div className="child_container">
                            <div className="child">
                                <span className="plan">
                                    Imp/Month
                                </span>
                                <span className="plan_name">
                                    {plan === 'free'
                                        ? '500'
                                        : plan === 'silver'
                                            ? SILVER_IMPRESSION
                                            : plan === 'gold'
                                                ? GOLD_IMPRESSION
                                                : plan === 'platinum'
                                                    ? 'U/L'
                                                    : ''
    }
                                </span>
                            </div>
                        </div>
                        <div className="child_container">
                            <div className="child">
                                <span className="plan">
                                    Imp/Left
                                </span>
                                <span className="plan_name">
                                    {plan === 'platinum'
                                        ? 'U/L'
                                        : impressions
    }
                                </span>
                            </div>
                        </div>
                        <div className="child_container">
                            <div className="child">
                                <span className="plan">
                                    Status
                                </span>
                                <span className="plan_name">
                                    {enabled
                                        ? 'ON'
                                        : 'OFF'
    }
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="banner_info"
                        style={{
                        paddingTop: '0px',
                        marginBottom: '30px'
                    }}>
                        <Banner
                            title="Aero Premium"
                            action={{
                            content: 'learn more',
                            onAction: () => window.open('https://www.launchtip.com/apps/aero/', '_blank')
                        }}
                            secondaryAction={{
                            content: 'Contact Customer Support',
                            onAction: () => window.open('https://www.launchtip.com/get-in-touch/', '_blank')
                        }}
                            status="info">
                            <p
                                style={{
                                fontSize: '14px',
                                lineHeight: '21px'
                            }}>Upgrade
                                Your Plan And Enjoy Aero Premium Features. Any Subscription Upgrade/Downgrade
                                will Automatically Unsubscribe Old Subscription.</p>
                        </Banner>
                    </div>
                    <Layout>
                        <Layout.Section>
                            <div className="pricing">
                                <div className="pricing_card">
                                    <div className="top">
                                        Free
                                    </div>
                                    <div className="middle">
                                        <span className="sign">$</span>
                                        <span className="dollar">0</span>
                                        <span className="cent">.00</span>
                                        <span className="month">/MON</span>
                                    </div>
                                    <div className="bottom">
                                        <ul>
                                            <li>500 Impressions</li>
                                            <li>2 Free Links Creation</li>
                                            <li>Technical Support</li>
                                            <li>Customization</li>
                                        </ul>
                                    </div>
                                    <div className="footer">
                                        {
                                            widget.plan === "free" ?
                                            <Button disabled onClick={() => alert("you are already subscribed to free plan")}>
                                            Current
                                            </Button>:
                                            loading === "free" ?
                                            <Button loading></Button>:
                                            <Button onClick={() => {setLoading("free");cancelPayment()}}>
                                            Free
                                            </Button>
                                        }
                                    </div>
                                </div>
    
                                <div className="pricing_card">
                                    <div className="top">
                                        Silver
                                    </div>
                                    <div className="middle">
                                        <span className="sign">$</span>
                                        <span className="dollar">{SILVER.split('.')[0]}</span>
                                        <span className="cent">.{SILVER.split('.')[1]}</span>
                                        <span className="month">/MON</span>
                                    </div>
                                    <div className="bottom">
                                        <ul>
                                            <li>{SILVER_IMPRESSION} Impressions</li>
                                            <li>Unlimited Links Creation</li>
                                            <li>Advance Technical Support</li>
                                            <li>Floating Add To Cart</li>
                                        </ul>
                                    </div>
                                    <div className="footer">
                                        {
                                            widget.plan === "silver" ?
                                            <Button disabled>Current</Button>
                                            : 
                                            loading === "silver" ?
                                            <Button loading></Button> :
                                            <Button onClick={() => {setLoading("silver");upgrade("silver", SILVER)}}>
                                                Select Plan
                                            </Button>
                                        }
                                    </div>
                                </div>
    
                                <div className="pricing_card">
                                    <div className="top">
                                        Gold
                                    </div>
                                    <div className="middle">
                                        <span className="sign">$</span>
                                        <span className="dollar">{GOLD.split('.')[0]}</span>
                                        <span className="cent">.{GOLD.split('.')[1]}</span>
                                        <span className="month">/MON</span>
                                    </div>
                                    <div className="bottom">
                                        <ul>
                                            <li>{GOLD_IMPRESSION} Impressions</li>
                                            <li>Unlimited Links Creation</li>
                                            <li>Technical + Call Support</li>
                                            <li>Floating Add To Cart</li>
                                        </ul>
                                    </div>
                                    <div className="footer">
                                        {
                                            widget.plan === "gold" ?
                                            <Button disabled>Current</Button>
                                            :
                                            loading === "gold" ?
                                            <Button loading></Button> :
                                            <Button onClick={() => {setLoading("gold");upgrade("gold", GOLD)}}>
                                                Select Plan
                                            </Button>
                                        }
                                    </div>
                                </div>
    
                                <div className="pricing_card">
                                    <div className="top">
                                        Platinum
                                    </div>
                                    <div className="middle">
                                        <span className="sign">$</span>
                                        <span className="dollar">{PLATINUM.split('.')[0]}</span>
                                        <span className="cent">.{PLATINUM.split('.')[1]}</span>
                                        <span className="month">/MON</span>
                                    </div>
                                    <div className="bottom">
                                        <ul>
                                            <li>{PLATINUM_IMPRESSION} Impressions</li>
                                            <li>Unlimited Links Creation</li>
                                            <li>Technical + Call Support</li>
                                            <li>Floating Add To Cart</li>
                                        </ul>
                                    </div>
                                    <div className="footer">
                                        {
                                            widget.plan === "platinum" ?
                                            <Button disabled>Current</Button>
                                            :
                                            loading === "platinum" ?
                                            <Button loading></Button> :
                                            <Button onClick={() => {setLoading("platinum");upgrade("platinum", PLATINUM)}}>
                                                Select Plan
                                            </Button>
                                        }
                                    </div>
                                </div>
    
                            </div>
                        </Layout.Section>
                    </Layout>
                    <div className="from_launchtip" onClick={() => window.open('https://apps.shopify.com/partners/resquared', '_blank')}>
                        <p><span>?</span>Apps From <span className="tip">Launchtip</span></p>
                    </div>
                </Page>
            </div>
        );
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

export default Pricing;