import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Community from './Community';

function AllCommunities() {
  const [communities, setCommunities] = useState([]);
  useEffect(async () => {
    const res = await axios.get('http://localhost:5000/communities');
    setCommunities(res.data.communities);
  }, []);
  return (
    <div className='container'>
      <div className='communities'>
        {communities.map((community) => (
          <Community key={community.id} community={community} />
        ))}
      </div>
    </div>
  );
}

export default AllCommunities;
