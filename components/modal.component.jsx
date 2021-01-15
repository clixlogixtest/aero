import React, {useState, useEffect} from 'react';
import {Modal, TextField} from '@shopify/polaris';
import axios from 'axios';

function ModalConnect({
    open,
    type,
    closeModal,
    value,
    hostId,
    handler
}) {

    // ============= PROPS GUIDE ======================================== open
    // : Opens the windowModal if true type      : Eg. Facebook, Slack etc. For
    // Dynamic Data Representation and Submit Functionality closeModel: Turns open
    // value to false, closes modal value     : Value of href (points to redirect
    // URL) hostId    : Domain Eg. antcommerce.myshopify.com handler   : Coming From
    // Settings Page i.e setFacebook, setSlack etc. set value to facebook etc in
    // settings page and as a result also rerender page DEFINE STATE
    // =====================================================
    const [textFieldValue,
        setTextFieldValue] = useState('');

    // SET TEXT FIELD VALUE =============================================
    useEffect(() => {
        setTextFieldValue(value)
    }, [value])

    // HANDLE TEXT FIELD CHANGE =========================================
    const handleTextFieldChange = (value) => {
        setTextFieldValue(value)
    }

    // HANDLE CONNECT FUNCTIONALIY ON SUBMIT ============================
    const submitValue = async() => {
        const object = {
            hostId,
            [type]: textFieldValue
        }
        const url = '/api/v1/widget';
        await axios
            .patch(url, object)
            .then(result => {
                handler(textFieldValue)
            })
            .catch(error => {
                console.log("some error has occured")
            })
        setTextFieldValue('')
        closeModal()
    }

    // MANAGE DISCONNECT FUNCTIONALITY ON SUBMIT ==========================
    const resetValue = () => {
        const object = {
            hostId,
            [type]: ''
        }
        const url = '/api/v1/widget';
        axios
            .patch(url, object)
            .then(result => {
                handler('')
            })
            .catch(error => {
              handler(null)
            })
        setTextFieldValue('')
        closeModal()
    }

    // RENDER COMPONENT WITH ABOVE VALUES ====================================
    return (
        <div style={{
            height: '500px'
        }} className="floating-modal">
            <Modal
                open={open}
                onClose={closeModal}
                primaryAction={{
                content: `${value
                    ? 'Connected'
                    : 'Connect'}`,
                onAction: submitValue
            }}
                secondaryActions={{
                content: `${ 'Disconnect'}`,
                onAction: resetValue
            }}>
                <Modal.Section>
                    <TextField
                        label={type === "Facebook"
                        ? "Enter Facebook Page Name"
                        : type === "Slack"
                            ? "Enter Slack ID"
                            : type === "Drift"
                                ? "Enter Drift ID"
                                : type === "Whatsapp"
                                    ? "Enter Whatsapp Number"
                                    : null}
                        type="text"
                        value={textFieldValue}
                        onChange={handleTextFieldChange}
                        helpText={type === "Facebook"
                        ? "Example Facebook Page Name: phonepuff"
                        : type === "Slack"
                            ? "Example Slack Channel Name: aero-testing"
                            : type === "Drift"
                                ? "Example Drift Id: fdtw7az4h6zv (Works for Testing)"
                                : type === "Whatsapp"
                                    ? "Example WhatsApp No: 918931028818 (International Version)"
                                    : null}/>
                </Modal.Section>
            </Modal>
        </div>

    );
}

export default ModalConnect;