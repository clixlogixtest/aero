import {useEffect, useContext} from 'react';
import Router, { useRouter } from "next/router";
import { Context as AppBridgeContext } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { RoutePropagator as ShopifyRoutePropagator } from "@shopify/react-shopify-app-route-propagator";

const RoutePropagator = () => {
  const router = useRouter(); 
  const { route } = router;
  const appBridge = React.useContext(AppBridgeContext);

  // Subscribe to appBridge changes - captures appBridge urls 
  // and sends them to Next.js router. Use useEffect hook to 
  // load once when component mounted
  useEffect(() => {
    appBridge.subscribe(Redirect.ActionType.APP, ({ path }) => {
      Router.push(path);
    });
  }, []);

  return appBridge && route ? (
    <ShopifyRoutePropagator location={route} app={appBridge} />
  ) : null;
}

export default RoutePropagator;