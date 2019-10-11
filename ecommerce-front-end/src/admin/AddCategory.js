import React, { useState } from 'react';
import Layout from '../core/Layout';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/';
import { createCategory } from './apiAdmin';
const AddCategory = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // de-structure user and info from local store
  const { user, token } = isAuthenticated();

  const handleChange = e => {
    setError('');
    setName(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    //   make request to API to create category
    createCategory(user._id, token, { name }).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setError('');
        setSuccess(true);
      }
    });
  };

  const showSuccess = () => {
    if (success) {
      return <h3 className="text-success">{name} is created</h3>;
    }
  };

  const showError = () => {
    if (error) {
      return <h3 className="text-danger">Category should be unique</h3>;
    }
  };

  const goBack = () => (
    <div className="mt-5">
      <Link className="text-warning" to="/admin/dashboard">
        Back to Dashboard
      </Link>
    </div>
  );

  const newCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted"></label>
        <input type="text" onChange={handleChange} className="form-control" value={name} autoFocus required></input>
      </div>
      <button className="btn btn-outline-primary" type="submit">
        submit
      </button>
    </form>
  );

  return (
    <Layout title="Add a New Category" description={`G'day ${user.name}, ready to add a new category? `}>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showSuccess()}
          {showError()}
          {newCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
