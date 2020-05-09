import React, { useState, useEffect } from 'react';
import { getCategories, List, list } from './apiCore';
import Card from './Card';

const Search = ({ searchResultsReturned }) => {
  const [data, setData] = useState({
    categories: [],
    category: '',
    search: '',
    results: [],
    searched: false
  });

  const { categories, category, search, results, searched } = data;
  const loadCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  const searchData = () => {
    if (search) {
      list({ search: search || undefined, category: category }).then(response => {
        if (response.error) {
          console.log(response.error);
        } else {
          setData({ ...data, results: response, searched: true });
        }
      });
    }
  };
  const handleChange = name => e => {
    //   set whatever field changed
    setData({ ...data, [name]: e.target.value, searched: false });
  };

  const searchSubmit = e => {
    e.preventDefault();
    searchData();
  };

  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`;
    }

    if (searched && results.length < 1) {
      return `No products found`;
    }
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <select className="btn mr-2" onChange={handleChange('category')}>
              <option value="All">All</option>
              {categories.map((c, i) => (
                <option key={i} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="search"
            className="form-control"
            onChange={handleChange('search')}
            placeholder="Search by name"
          />
        </div>
        <div className="btn input-group-append" style={{ border: 'none' }}>
          <button className="input-group-text">Search</button>
        </div>
      </span>
    </form>
  );

  const searchedProducts = (results = []) => {
    return (
      <div>
        <h2 className="mt-4 mb-4">{searchMessage(searched, results)}</h2>
        <div className="row">
          {results.map((p, i) => (
            <Card key={i} product={p} />
          ))}
        </div>
      </div>
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>
      <div className="container mb-3">{searchForm()}</div>
      <div className="container-fluid">{searchedProducts(results)}</div>
    </div>
  );
};

export default Search;
