import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart } from './cartHelpers';
import Layout from './Layout';
import Card from './Card';
import Checkout from './Checkout';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setItems(getCart());
  }, [run]);

  const showItems = items => {
    return (
      <div>
        <h2>Your cart has {items.length} items</h2>
        <hr />
        {items.map((p, i) => (
          <Card
            key={i}
            product={p}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            setRun={setRun}
            run={run}
          />
        ))}
      </div>
    );
  };

  const noItemsMessage = () => (
    <div>
      <h2> Your cart is empty</h2>
      <Link to="/shop">Continue shopping</Link>
    </div>
  );

  return (
    <Layout
      title="Shopping Cart"
      description="mange your cart items, add, remove, checkout or continue shopping"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-6">{items.length > 0 ? showItems(items) : noItemsMessage()}</div>

        <div className="col-6">
          <h2 className="mb-4">Your Cart summary</h2>
          <hr />
          <Checkout  setRun={setRun} products={items} />
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
