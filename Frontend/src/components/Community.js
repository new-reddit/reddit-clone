import React from 'react';
import { Link } from 'react-router-dom';

const Community = ({ community }) => {
  return (
    <div className='tile is-parent is-4'>
      <div className='box tile is-child has-background-grey-light'>
        <Link className='is-size-3' to={`/community/${community.name}`}>
          {community.title}
        </Link>
        <p>{community.description}</p>
      </div>
    </div>
  );
};

export default Community;
