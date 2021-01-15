import {Button, Card, Layout} from '@shopify/polaris';
import Router from 'next/router';

function Homepagecard(props) {
    const {
        title,
        description,
        info,
        path,
        site,
        buttonName,
        buttonType
    } = props;
    return (
        <Layout.AnnotatedSection title={title} description={description}>
            <Card sectioned>
                <div className="form-style margin0">
                    <label className="margin0 bold-text info-text">{info}</label>
                    {buttonType
                        ? <Button primary onClick={() => Router.push(`/${path}`)}>{buttonName}</Button>
                        : <Button
                            onClick={() => {
                            if (path) {
                                Router.push(`/${path}`)
                            } else {
                                window.open(`${site}`, '_blank')
                            }
                        }}>{buttonName}</Button>
}
                </div>
            </Card>
        </Layout.AnnotatedSection>
    )
}

export default Homepagecard;
