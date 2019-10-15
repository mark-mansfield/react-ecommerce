import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from './apiCore';
import Layout from './Layout';
import Search from './Search';
import Card from './Card';
import { isAuthenticated } from '../auth';

const Checkout = ({ products }) => {
  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <button className="btn btn-success">Checkout</button>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sing in to checkout</button>
      </Link>
    );
  };

  return (
    <div>
      <h2>Total: ${getTotal(products)}</h2>
      {showCheckout()}
    </div>
  );
};

export default Checkout;
