import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Community from './Community';
import axios from 'axios';

function AllCommunities() {
  const userName = useParams().name;
  const [showCreateCommnity, setShowCreateCommunity] = useState(false);
  const [communities, setCommunities] = useState([]);
  useEffect(async () => {
    const res = await axios.get(
      `http://localhost:5000/u/${userName}/communities`
    );
    if (userName === localStorage.getItem('userName')) {
      setShowCreateCommunity(true);
    }
    setCommunities(res.data.communities);
  }, [userName]);
  return (
    <div className='container'>
      <div className='tile is-ancestor is-flex is-flex-wrap-wrap'>
        {communities.length
          ? communities.map((community) => (
              <Community key={community.id} community={community} />
            ))
          : 'You did not join any communities  yet!'}
      </div>
      {showCreateCommnity ? (
        <Link className='button is-success' to='/create-community'>
          create community
        </Link>
      ) : (
        ''
      )}
    </div>
  );
}

export default AllCommunities;
