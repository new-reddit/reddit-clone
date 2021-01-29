import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CreateCommunity = ({ history }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  });
  const communityName = useParams().name;
  const { title, body } = formData;
  const [titleErrorMsg, setTitleErrorMsg] = useState('');
  const [bodyErrorMsg, setBodyErrorMsg] = useState('');
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
    console.log(res.data);
    history.push(`/community/${communityName}`);
  };
  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit}>
        <h2>Create Post</h2>
        <label htmlFor='name'>Title</label>
        <input
          type='text'
          name='title'
          placeholder='Enter post title'
          value={title}
          onChange={handleChange}
        />
        {titleErrorMsg ? <span className='error'>{titleErrorMsg}</span> : null}
        <label htmlFor='body'>Body</label>
        <textarea
          name='body'
          cols='10'
          rows='5'
          placeholder='Enter the post'
          value={body}
          onChange={handleChange}
        />
        {bodyErrorMsg ? <span className='error'>{bodyErrorMsg}</span> : null}
        <button>Create Post</button>
      </form>
    </div>
  );
};

export default CreateCommunity;
