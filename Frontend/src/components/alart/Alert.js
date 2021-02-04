import React from 'react';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
  return (
    <div className='container is-max-desktop p-4'>
      {alerts !== null &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <div key={alert.id} className='notification is-danger'>
            {alert.msg.data}
          </div>
        ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});
export default connect(mapStateToProps)(Alert);
