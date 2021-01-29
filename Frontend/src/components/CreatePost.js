import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const CreateCommunity = ({ history, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  });
  const communityName = useParams().name;
  const { title, body } = formData;
  const [titleErrorMsg, setTitleErrorMsg] = useState('');
  const [bodyErrorMsg, setBodyErrorMsg] = useState('');
  if (!isAuthenticated) {
    return <Redirect to='/login' />;
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.length) {
      setTitleErrorMsg('Title must be provided');
      return;
    }
    if (!body.length) {
      setBodyErrorMsg('Body must be provided');
      return;
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const post = JSON.stringify({
      post_body: body,
      title: title,
    });
    const res = await axios.post(
      `http://localhost:5000/create/post/community/${communityName}`,
      post,
      config
    );
    history.push(`/community/${communityName}`);
  };
  return (
    <div className='container is-max-desktop mt-4 p-4'>
      <form onSubmit={handleSubmit}>
        <h2 className='title'>Create Post</h2>
        <div className='field'>
          <label htmlFor='name' className='label'>
            Title
          </label>
          <input
            className='input'
            type='text'
            name='title'
            placeholder='Enter post title'
            value={title}
            onChange={handleChange}
          />
          {titleErrorMsg ? (
            <p className='help has-text-danger'>{titleErrorMsg}</p>
          ) : null}
        </div>
        <div className='field'>
          <label htmlFor='body' className='label'>
            Body
          </label>
          <textarea
            className='textarea'
            name='body'
            cols='10'
            rows='5'
            placeholder='Enter the post'
            value={body}
            onChange={handleChange}
          />
          {bodyErrorMsg ? (
            <p className='help has-text-danger'>{bodyErrorMsg}</p>
          ) : null}
        </div>
        <button className='button is-success'>Create Post</button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});
export default connect(mapStateToProps)(CreateCommunity);
