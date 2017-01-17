import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Addresses } from '../api/addresses.js';
 
import Address from './Address.jsx';
 
// App component - represents the whole app
class App extends Component {

  renderAddresses() {
    let filteredAddresses = this.props.addresses;

    filteredAddresses = filteredAddresses.filter(address => address.shouldDisplay);

    return filteredAddresses.map((address) => {
      return (
        <Address key={address._id} address={address} />
      );
    });
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>leap</h1>
        </header>
          <p>Enter a radius and your choice of an address or latitude/longitude coordinates below to see a list of addresses within the radius.</p>

        <ul>
          {this.renderAddresses()}
        </ul>
      </div>
    );
  }
}
 
App.propTypes = {
  addresses: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  Meteor.subscribe('addresses');
  
  return {
    addresses: Addresses.find({}).fetch(),
  };
}, App);