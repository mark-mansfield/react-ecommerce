import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/';
import { createProduct, getCategories } from './apiAdmin';
const AddProduct = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    shipping: '',
    quantity: '',
    photo: '',
    loading: false,
    error: '',
    createdProduct: '',
    redirectToProfile: false,
    formData: ''
  });

  // de-structure user and info from local store
  const { user, token } = isAuthenticated();
  const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    photo,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData
  } = values;

  // load categories and set form Data

  const init = () => {
    getCategories().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data, formData: new FormData() });
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = name => e => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setValues({ ...values, error: '', loading: true });
    createProduct(user._id, token, formData).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: '',
          description: '',
          photo: '',
          price: '',
          quantity: '',
          loading: false,
          createdProduct: data.name
        });
      }
    });
  };

  const showSuccess = () => {
    return (
      <h3 className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>
        {createdProduct} is created
      </h3>
    );
  };

  const showError = () => {
    return (
      <h3 className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
        {error}
      </h3>
    );
  };

  const showLoading = () => loading && <h3 className="alert alert-info">Loading.....</h3>;

  const goBack = () => (
    <div className="mt-5">
      <Link className="text-warning" to="/admin/dashboard">
        Back to Dashboard
      </Link>
    </div>
  );

  const newProductForm = () => (
    <form className="mb-3" onSubmit={handleSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input className="form-control" onChange={handleChange('photo')} type="file" name="photo" accept="image/*" />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input className="form-control" type="text" value={name} onChange={handleChange('name')} />
      </div>

      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea className="form-control" value={description} onChange={handleChange('description')} />
      </div>

      <div className="form-group">
        <label className="text-muted">Price</label>
        <input className="form-control" type="number" value={price} min="0" onChange={handleChange('price')} />
      </div>

      <div className="form-group">
        <label className="text-muted">Category</label>
        <select className="form-control" value={category} onChange={handleChange('category')}>
          <option>Please select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Shipping</label>
        <select className="form-control" value={shipping} onChange={handleChange('shipping')}>
          <option>Please select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input className="form-control" type="number" min="0" value={quantity} onChange={handleChange('quantity')} />
      </div>

      <button className="btn btn-outline-primary" type="submit">
        Create Product
      </button>
    </form>
  );

  return (
    <Layout title="Add a New Product" description={`G'day ${user.name}, ready to add a new product? `}>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showSuccess()}
          {showError()}
          {showLoading()}
          {newProductForm()}
          {goBack()}
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
