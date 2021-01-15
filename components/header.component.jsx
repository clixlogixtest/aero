import react, {useState} from 'react';
import {Button, Popover, ActionList, Page} from '@shopify/polaris';
import Router from 'next/router';

function Header({dashboard, manage, settings, pricing, submit}) {
    const [popoverActive,
        setPopoverActive] = useState(false);
    const togglePopoverActive = () => {
        setPopoverActive(!popoverActive)
    }
    const activator = (
        <Button onClick={togglePopoverActive} disclosure>
            More actions
        </Button>
    );
    return (
        <div className="header_border">
            <Page>
                <div className="navigation_header">
                    <div className="navigation_header_left">
                        {!dashboard && <button className="slim_button" onClick={() => Router.push(`/`)}>
                            Dashboard
                        </button>
}
                        {!manage && <button className="slim_button" onClick={() => Router.push(`/manage`)}>
                            Manage Links
                        </button>
}
                        {!settings && <button className="slim_button" onClick={() => Router.push(`/settings`)}>
                            Settings
                        </button>
}
                        {!pricing && <button className="slim_button" onClick={() => Router.push(`/pricing`)}>
                            Upgrade Plan
                        </button>
}
                    </div>
                    <div className="mobile_header_left">
                        <Popover
                            active={popoverActive}
                            activator={activator}
                            onClose={togglePopoverActive}>
                            {dashboard && <ActionList
                                items={[
                                {
                                    content: 'Manage',
                                    onAction: () => Router.push('/manage')
                                }, {
                                    content: 'Settings',
                                    onAction: () => Router.push('/settings')
                                }, {
                                    content: 'Upgrade',
                                    onAction: () => Router.push('/pricing')
                                }
                            ]}/>
}
                            {settings && <ActionList
                                items={[
                                {
                                    content: 'Dashboard',
                                    onAction: () => Router.push('/')
                                }, {
                                    content: 'Manage',
                                    onAction: () => Router.push('/manage')
                                }
                            ]}/>
}
                            {manage && <ActionList
                                items={[
                                {
                                    content: 'Dashboard',
                                    onAction: () => Router.push('/')
                                }, {
                                    content: 'Settings',
                                    onAction: () => Router.push('/settings')
                                }
                            ]}/>
}
                            {pricing && <ActionList
                                items={[
                                {
                                    content: 'Dashboard',
                                    onAction: () => Router.push('/')
                                }, {
                                    content: 'Manage',
                                    onAction: () => Router.push('/manage')
                                }, {
                                    content: 'Settings',
                                    onAction: () => Router.push('/settings')
                                }
                            ]}/>
}
                        </Popover>
                    </div>
                    {!settings && <div className="navigation_header_right">
                        <Button
                            primary
                            onClick={() => window.open('https://www.launchtip.com/get-in-touch/', '_blank')}>Contact Support</Button>
                    </div>
}
                    {settings && <div
                        className="navigation_header_right"
                        style={{
                        paddingRight: '15px'
                    }}>
                        <Button primary onClick={() => submit()} className="slim_button">Save</Button>
                    </div>
}
                </div>

            </Page>

        </div>
    )
}

export default Header;