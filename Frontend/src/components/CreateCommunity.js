import React, { useState } from 'react';
import axios from 'axios';
import { setAlert } from '../redux/actions/alert';
import { connect } from 'react-redux';

const CreateCommunity = ({ setAlert, history, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topic: '',
  });
  if (!isAuthenticated) {
    history.push('/login');
  }
  const { name, description, topic } = formData;
  const [nameErrorMsg, setNameErrorMsg] = useState('');
  const [descriptionErrorMsg, setDescriptionErrorMsg] = useState('');
  const [topicErrorMsg, setTopicErrorMsg] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.length) {
      setNameErrorMsg('Name must be provided');
      return;
    }
    if (!description.length) {
      setDescriptionErrorMsg('Description must be provided');
      return;
    }
    if (!topic.length) {
      setTopicErrorMsg('Topic must be provided');
      return;
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const body = JSON.stringify(formData);
      const res = await axios.post(
        'http://localhost:5000/create/community',
        body,
        config
      );
      history.push(`/community/${res.data.community.name}`);
    } catch (error) {
      setAlert(error.response, 'danger');
    }
  };
  return (
    <div className='container is-max-desktop mt-4 p-4'>
      <form onSubmit={handleSubmit}>
        <h2 className='title'>Create Community</h2>
        <div className='field'>
          <label htmlFor='name' className='label'>
            Name
          </label>
          <input
            className='input'
            type='text'
            name='name'
            placeholder='Enter name of community'
            value={name}
            onChange={handleChange}
          />
          {nameErrorMsg ? (
            <p className='help has-text-danger'>{nameErrorMsg}</p>
          ) : null}
        </div>

        <div className='field'>
          <label htmlFor='description' className='label'>
            Description
          </label>
          <input
            className='input'
            type='text'
            name='description'
            placeholder='Enter desciption of community'
            value={description}
            onChange={handleChange}
          />
          {descriptionErrorMsg ? (
            <p className='help has-text-danger'>{descriptionErrorMsg}</p>
          ) : null}
        </div>
        <div className='field'>
          <label htmlFor='name' className='label'>
            Topic
          </label>
          <input
            className='input'
            type='text'
            name='topic'
            placeholder='Enter topic of community'
            value={topic}
            onChange={handleChange}
          />
          {topicErrorMsg ? (
            <p className='help has-text-danger'>{topicErrorMsg}</p>
          ) : null}
        </div>
        <button className='button is-success'>Create Community</button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});
export default connect(mapStateToProps, { setAlert })(CreateCommunity);
