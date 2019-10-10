import React, { useState } from 'react';
import Layout from '../core/Layout';
import { signIn, authenticate } from '../auth';
import { Redirect } from 'react-router-dom';
const Signin = () => {
  const [values, setValues] = useState({
    email: 'johnny@gmail.com',
    password: '123456',
    error: '',
    loading: false,
    redirectToReferrer: false
  });

  const { email, password, loading, error, redirectToReferrer } = values;

  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = e => {
    e.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signIn({ email: email, password: password }).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => setValues({ ...values, redirectToReferrer: true }));
      }
    });
  };

  const signUpForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input onChange={handleChange('email')} type="email" className="form-control" value={email} />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input onChange={handleChange('password')} type="password" className="form-control" value={password} />
      </div>
      <button onClick={clickSubmit} className="btn btn-primary" type="submit">
        Submit
      </button>
    </form>
  );

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-info">
        <h2>Loading....</h2>
      </div>
    );

  const redirectUser = () => {
    if (redirectToReferrer) {
      return <Redirect to="/" />;
    }
  };

  return (
    <Layout
      title="Signup"
      description="Sign up to Node React E-commerce App"
      className="container col-md-8 offset-md-2"
    >
      <p> u: johnny@gmail.com</p>
      <p> p: 123456</p>
      {showLoading()}
      {showError()}
      {signUpForm()}
      {redirectUser()}
    </Layout>
  );
};

export default Signin;
