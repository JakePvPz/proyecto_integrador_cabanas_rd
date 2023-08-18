import React, { Fragment } from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import "./StripeBtn.css";

const StripeBtn = ({ amount, roomIds, roomNumbers, hotelId }) => {
  const publishableKey =
    "pk_test_51Nc8uQB0hIhj6XwY6GyEG1O2bs0pOLdON245PC5ThYx8VYyQusQQyWvmgo6anPJ1DPBW18OTV6A6ztgNmOHm30zw003hFRBkP6";

  const onToken = (token) => {
    const body = {
      amount,
      token: token,
      roomIds,
      roomNumbers,
      hotelId,
    };
    axios
      .post("/transactions", body)
      .then((response) => {
        console.log(response);
        alert("Payment Success ID# " + response.data.transaction_id);
      })
      .catch((error) => {
        console.log("Payment Error: ", error);
        alert("Payment Error");
      });
  };
  return (
    <StripeCheckout
      label="Reserve Now"
      name="Cabañas RD"
      description="Reserve your room now"
      panelLabel="Pay Now"
      amount={amount}
      token={onToken}
      stripeKey={publishableKey}
      billingAddress={true}
    >
      <button className="reserveBtn" disabled={amount / 100 === 0}>
        Reserva Ahora (${amount / 100})
      </button>
    </StripeCheckout>
  );
};
export default StripeBtn;
