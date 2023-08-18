import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({ amount, currency, onSuccess, onError }) => {
  return (
    <PayPalScriptProvider options={{ 'client-id': 'AVlXZQRzI3oeuYaUla-9uRhL7N_sKyVKNB7psJjyS3_YIC0XHDidmt3Y2znsPQD-y8Ep_XCHU8paTy28' , 'disableFunding': 'credit'}}>
      <PayPalButtons
        style={{ 
            layout: 'horizontal',
            tagline: false,
         }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                  currency,
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          // This function is called when the user approves the payment
          // You can handle the success here and perform any actions needed
          onSuccess(data);
        }}
        onError={err => {
          // This function is called when an error occurs during the payment process
          // You can handle the error here and show an appropriate message to the user
          onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
