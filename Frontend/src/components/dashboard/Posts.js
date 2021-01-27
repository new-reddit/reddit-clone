import React from 'react';
import Post from '../Post';
import { connect } from 'react-redux';

const Posts = ({ posts }) => {
  return (
    <div className='posts'>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  posts: state.user.profile.posts,
});

export default connect(mapStateToProps)(Posts);
