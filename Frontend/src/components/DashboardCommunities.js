import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Community from './Community';
import axios from 'axios';

function AllCommunities() {
  const [communities, setCommunities] = useState([]);
  useEffect(async () => {
    const res = await axios.get(
      `http://localhost:5000/u/${localStorage.getItem('userName')}/communities`
    );
    setCommunities(res.data.communities);
  }, []);
  return (
    <div className='container'>
      <div className='communities'>
        {communities.length > 0
          ? communities.map((community) => (
              <Community key={community.id} community={community} />
            ))
          : 'You did not join any communities  yet!'}
      </div>
      <Link className='create-community' to='/create-community'>
        create community
      </Link>
    </div>
  );
}

export default AllCommunities;
