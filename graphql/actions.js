import gql from 'graphql-tag';

export const GET_TOP_5_PRODUCTS = gql `
query{
    products(first:5)
    {
      edges{
        cursor
        node {
          id
          title
          variants(first:1) {
            edges {
              node {
                id
                price
              }
            }
          }
        }
      }
    }
  }
`

export const GET_PRODUCTS_BY_ID = gql `
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

export const CREATE_SCRIPT_TAG = gql `
    mutation scriptTagCreate($input: ScriptTagInput!) {
        scriptTagCreate(input: $input) {
            scriptTag {
                id
            }
            userErrors {
                field
                message
            }
        }
    }
`;
export const GET_SUBSCRIPTIONS = gql `
    query{
    appInstallations(first:5){
      edges{
        node{
          id
          allSubscriptions(first:9) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_SCRIPT_TAG = gql `
    query{
        scriptTags(first:5){
            edges{
                node{
                    id
                    src
                    displayScope
                }
            }
        }
    }
`;

export const DELETE_SCRIPT_TAGS = gql `
    mutation scriptTagDelete($id:ID!){
        scriptTagDelete(id:$id){
            deletedScriptTagId
            userErrors{
                field
                message
            }
        }
    }
`;

export const CHARGE_PAYMENT = gql `
    mutation appSubscriptionCreate($name: String!,$test: Boolean, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!) {
        appSubscriptionCreate(name: $name, test: $test, lineItems: $lineItems, returnUrl: $returnUrl) {
        appSubscription {
            id
        }
        confirmationUrl
        userErrors {
            field
            message
        }
        }
    }
`

export const CREATE_PAYMENT = gql `
    mutation appPurchaseOneTimeCreate($name: String!, $price: MoneyInput!, $returnUrl: URL!) {
        appPurchaseOneTimeCreate(name: $name, price: $price, returnUrl: $returnUrl) {
        appPurchaseOneTime {
            id
        }
        confirmationUrl
        userErrors {
            field
            message
        }
        }
    }
`

export const CANCEL_SUBSCRIPTION = gql `
    mutation appSubscriptionCancel($id: ID!) {
        appSubscriptionCancel(id: $id) {
        appSubscription {
            id
        }
        userErrors {
            field
            message
        }
        }
    }
`

export const SHOP_EMAIL = gql `
    query{
      shop {
        email
        myshopifyDomain
      }
    }
`
export const GET_ALL_SUBSCRIPTIONS = gql`
query{
  app {
    id
    developerName
    installation {
      activeSubscriptions {
        id
        name
        currentPeriodEnd
        lineItems {
          id
        }
      }
      allSubscriptions(first:5) {
        edges {
          node {
            id
            test
          }
        }
      }
    }
  }
}
`