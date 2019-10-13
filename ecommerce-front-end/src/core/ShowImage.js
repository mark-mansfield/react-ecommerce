import React from 'react';
import { API } from '../config';

const ShowImage = ({ item, url }) => (
  <div className="product-img">
    <img
      className="mb-3"
      src={`${API}/${url}/photo/${item._id}`}
      alt={item.name}
      style={{
        maxheight: '100%',
        maxWidth: '100%'
      }}
    />
  </div>
);

export default ShowImage;
