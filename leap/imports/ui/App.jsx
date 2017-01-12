import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Addresses } from '../api/addresses.js';
 
import Address from './Address.jsx';
 
// App component - represents the whole app
class App extends Component {
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const latInput = ReactDOM.findDOMNode(this.refs.latInput).value.trim();
    const lngInput = ReactDOM.findDOMNode(this.refs.lngInput).value.trim();
    const radiusInput = ReactDOM.findDOMNode(this.refs.radiusInput).value.trim();

    Meteor.call('addresses.calcDistance', latInput, lngInput, radiusInput);
    //NEED TO RUN THE FORMULA TO CALCULATE DISTANCE BETWEEN THIS POINT AND EACH POINT IN JSON
    //NEED TO SET DEFAULT OF DISPLAYING ADDRESSES IN DB TO FALSE
    //FOR ALL ADDRESSES THAT HAVE A DISTANCE SMALLER THAN THE RADIUSINPUT, FLAG DISPLAYADDRESS TO TRUE
    //ONLY DISPLAY ADDRESSES THAT HAVE DISPLAYADDRESS === TRUE
    // Addresses.insert({
    //   latInput,
    //   createdAt: new Date(), // current time
    // });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.latInput).value = '';
    ReactDOM.findDOMNode(this.refs.lngInput).value = '';
    ReactDOM.findDOMNode(this.refs.radiusInput).value = '';
  }

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
  
          <form className="new-location" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="latInput"
              placeholder="Latitude"
            />
            <input
              type="text"
              ref="lngInput"
              placeholder="Longitude"
            />
            <input
              type="text"
              ref="radiusInput"
              placeholder="Radius (in miles)"
            />
          </form>
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