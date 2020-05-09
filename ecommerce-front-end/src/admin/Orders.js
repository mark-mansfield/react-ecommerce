import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth/';
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin';
import moment from 'moment';
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);

  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then(data => {
      if (data.error) {
      } else {
        setOrders(data);
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  const showInput = (key, value) => (
    <div className="input-group mb-2 mr-sm-2">
      <div className="input-group-prepend">
        <div className="input-group-text">{key}</div>
      </div>
      <input type="text" value={value} className="form-control" readOnly />
    </div>
  );

  const handleStatusChange = (e, orderId) => {
    // console.log('update order status to:', e.target.value);
    updateOrderStatus(user._id, token, orderId, e.target.value).then(data => {
      if (data.error) {
        console.log('Status update failed');
      } else {
        loadOrders();
      }
    });
  };

  const showStatus = order => {
    return (
      <div className="form-group">
        <h3 className="mark mb-4">Status: {order.status}</h3>
        <select onChange={e => handleStatusChange(e, order._id)} className="form-control">
          <option>Update Status</option>
          {statusValues.map((status, index) => {
            return (
              <option key={index} value={status}>
                {status}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return <h1 className="text text-danger display-2">Total orders: {orders.length}</h1>;
    } else {
      return <h1 className="text-danger">No Orders</h1>;
    }
  };

  return (
    <Layout title="Orders" description={`G'day ${user.name}, you can manage all the orders here`}>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showOrdersLength(orders)}

          {orders.map((o, oIndex) => {
            return (
              <div className="mt-5" key={oIndex} style={{ borderBottom: '5px solid indigo' }} key={oIndex}>
                <h2 className="mb-5">
                  <span className="bg-primary">ORDER ID: {o._id}</span>
                </h2>
                <ul className="list-group mb-2">
                  <li className="list-group-item">{showStatus(o)}</li>
                  <li className="list-group-item">Transaction ID: {o.transaction_Id}</li>
                  <li className="list-group-item">ORDER AMOUNT: {o.amount}</li>
                  <li className="list-group-item">ORDERED BY: {o.user.name}</li>
                  <li className="list-group-item">ORDERED ON: {moment(o.createdAt).fromNow()}</li>
                  <li className="list-group-item">DELIVERY ADDRESS: {o.address}</li>
                </ul>
                <h3 className="mg-4 mb-4 font-italic">Total products in the order: {o.products.length}</h3>

                {o.products.map((p, pIndex) => {
                  return (
                    <div className="mb-4" key={pIndex} style={{ padding: '20px', border: '1px solid indigo' }}>
                      {showInput('Product name', p.name)}
                      {showInput('Product price', p.price)}
                      {showInput('Product count', p.count)}
                      {showInput('Product Id', p._id)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
