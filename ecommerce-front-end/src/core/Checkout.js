import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBraintreeClientToken, processPayment, createOrder } from './apiCore';
import { emptyCart } from './cartHelpers';
import { isAuthenticated } from '../auth';
import DropIn from 'braintree-web-drop-in-react';

const Checkout = ({ products, setRun = f => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: '',
    instance: {},
    address: ''
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then(data => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    getToken(userId, token);
  }, []);

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };

  let deliveryAddress = data.address;

  const buy = () => {
    setData({ loading: true });
    // send nonce to server
    // nonce = data.instance.requestPaymentMethod
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then(data => {
        // console.log(data);
        nonce = data.nonce;

        // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
        // and also total to be charged
        // console.log('send nonce and total to process', nonce, getTotal(products));
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products)
        };

        processPayment(userId, token, paymentData)
          .then(response => {
            // create order
            const createOrderData = {
              products: products,
              transaction_Id: response.transaction.id,
              amount: response.transaction.amount,
              address: deliveryAddress
            };
            createOrder(userId, token, createOrderData);
            setData({ ...data, success: response.success });
            emptyCart(() => {
              setRun(!run); // update parent state
              console.log('payment success and empty cart');
              setData({ loading: false });
            });
          })
          .catch(error => {
            console.log(error);
            setData({ loading: false });
          });
      })
      .catch(error => {
        // console.log('DropIn error', error);
        setData({ ...data, error: error.message });
      });
  };

  const showLoading = loading =>
    loading && (
      <div className="alert alert-info">
        <h2>Processing ....</h2>
      </div>
    );

  const showSuccess = success => (
    <div className="alert alert-danger" style={{ display: success ? '' : 'none' }}>
      {success}
      Thanks! Your payment was successful!
    </div>
  );

  const showError = error => (
    <div className="alert alert-info" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );

  const handleAddress = e => {
    setData({ ...data, address: e.target.value });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: '' })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="gorm-group mb-3">
            <label className="text-muted">Delivery Address:</label>
            <textarea
              onChange={handleAddress}
              value={data.address}
              placeholder="Type your delivery address here"
              className="form-control"
            ></textarea>
          </div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: 'vault'
              }
            }}
            onInstance={instance => (data.instance = instance)}
          />
          <button onClick={buy} className="btn btn-success btn-block">
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  return (
    <div>
      <h2>Total: ${getTotal(products)}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
