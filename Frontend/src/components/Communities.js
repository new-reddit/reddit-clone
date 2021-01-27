import React from 'react';
import { Link } from 'react-router-dom';

function Communities() {
  return (
    <div className='container'>
      <div className='communities'>
        <div className='community'>
          <Link className='community-title'>Web Development</Link>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi nobis
            optio illum est harum reiciendis.
          </p>
        </div>
        <div className='community'>
          <Link className='community-title'>Web Development</Link>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi nobis
            optio illum est harum reiciendis.
          </p>
        </div>
        <div className='community'>
          <Link className='community-title'>Web Development</Link>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi nobis
            optio illum est harum reiciendis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Communities;
