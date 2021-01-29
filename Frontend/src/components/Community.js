import React from 'react';
import { Link } from 'react-router-dom';

const Community = ({ community }) => {
  return (
    <div className='community'>
      <Link className='community-title' to={`/community/${community.name}`}>
        {community.title}
      </Link>
      <p>{community.description}</p>
    </div>
  );
};

export default Community;
