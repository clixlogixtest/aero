import React, {useState} from 'react';
import {Layout, Card, Button} from '@shopify/polaris';
import ModalConnect from './modal.component';

function SettingsMessengerArea(props) {

    // STATE VALUES ====================================================
    const [modalType,
        setModalType] = useState('');
    const [value,
        setModalValue] = useState('');
    const [modalState,
        setModalState] = useState(false);

    // EXTRACT PROPS ===================================================
    const {
        Facebook,
        Slack,
        Drift,
        Whatsapp,
        hostId,
        setFacebook,
        setSlack,
        setWhatsapp,
        setDrift
    } = props

    const openModal = (type, value) => {
        // 1. Set Modal Type ==========================================
        setModalType(type)
        // 2. Set Modal Value (href value of facebook, slack, etc)=====
        setModalValue(value)
        // 3. Open Modal with State Set in Step 1 and 2 ===============
        setModalState(true)
    }
    const closeModal = () => {
        // Closes Modal | This Function is Passed to Modal Comp========
        setModalState(false)
    }

    // Render Component with Above Values==============================
    return (
        <React.Fragment>
            <Layout.AnnotatedSection
                title="Integrations"
                description="Manage integrations for Aero.">
                <Card sectioned>
                    <div className="form-style margin0">
                        <div className="img-name">
                            <img className="img-connect" src="/images/drift.png"/>
                            <label
                                className="mb-0 font-weight-500"
                                style={{
                                marginLeft: '20px'
                            }}>Drift</label>
                        </div>
                        <Button type="button" submit onClick={() => openModal('Drift', Drift)}>
                            {Drift
                                ? 'connected'
                                : 'connect'}
                        </Button>
                    </div>
                </Card>

                <Card sectioned>
                    <div className="form-style margin0">
                        <div className="img-name">
                            <img className="img-connect" src="/images/fb.svg"/>
                            <label
                                className="mb-0 font-weight-500"
                                style={{
                                marginLeft: '20px'
                            }}>Messenger</label>
                        </div>
                        <Button type="button" submit onClick={() => openModal('Facebook', Facebook)}>
                            {Facebook
                                ? 'connected'
                                : 'connect'}
                        </Button>
                    </div>
                </Card>

                <Card sectioned>
                    <div className="form-style margin0">
                        <div className="img-name">
                            <img className="img-connect" src="/images/whatsapp.png"/>
                            <label
                                className="mb-0 font-weight-500"
                                style={{
                                marginLeft: '20px'
                            }}>Whatsapp</label>
                        </div>
                        <Button type="button" submit onClick={() => openModal('Whatsapp', Whatsapp)}>
                            {Whatsapp
                                ? 'connected'
                                : 'connect'}
                        </Button>
                    </div>
                </Card>
                <Card sectioned>
                    <div className="form-style margin0">
                        <div className="img-name">
                            <img className="img-connect" src="/images/slack.png"/>
                            <label
                                className="mb-0 font-weight-500"
                                style={{
                                marginLeft: '20px'
                            }}>Slack</label>
                        </div>
                        <Button type="button" submit onClick={() => openModal('Slack', Slack)}>
                            {Slack
                                ? 'connected'
                                : 'connect'}
                        </Button>
                    </div>
                </Card>
            </Layout.AnnotatedSection>

            <div style={{
                position: 'absolute'
            }}>
                <ModalConnect
                    open={modalState}
                    type={modalType}
                    handler=
                    { modalType==='Facebook'? setFacebook: modalType==='Drift'? setDrift: modalType==='Slack'? setSlack: modalType==='Whatsapp'? setWhatsapp: null }
                    value={value}
                    closeModal={closeModal}
                    hostId={hostId}/>
            </div>
            <div style={{padding:"30px"}} />
        </React.Fragment>
    )
}

export default SettingsMessengerArea;
