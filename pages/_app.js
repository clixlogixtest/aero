import App from 'next/app';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';
import ClientRouter from '../components/router.component';
import Cookies from 'js-cookie';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import translations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/dist/styles.css';
import '../public/style.css';
import '../public/widget.css';

const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include',
  },
});

class MyApp extends App {

  render() {
    const { Component, pageProps } = this.props;
    const config = {
      host: HOST, 
      apiKey: API_KEY, 
      shopOrigin: Cookies.get("shopOrigin"), 
      accessToken: Cookies.get("accessToken"),
      forceRedirect: true,
      pricing: PRICING
    };

    return (
      <React.Fragment>
        <Head>
          <title>Aero App</title>
          <meta charSet="utf-8" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"/>
        </Head>
        <Provider config={config}>
          <AppProvider i18n={translations}>
            <ClientRouter/>
            <ApolloProvider client={client}>
              <Component 
              {...pageProps} 
              shopOrigin={config.shopOrigin} 
              host={config.host} 
              accessToken={config.accessToken} 
              pricing={config.pricing}
              apiKey={config.apiKey}
            />
            </ApolloProvider>
          </AppProvider>
        </Provider>
      </React.Fragment>
    );
  }
}

export default MyApp;