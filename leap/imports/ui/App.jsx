import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Addresses } from '../api/addresses.js';
import Address from './Address.jsx';
import { HTTP } from 'meteor/http';
import  apiKey  from '../../apiKey.js';
// App component - represents the whole app
class App extends Component {
  constructor() {
    super();
 
    this.state = {
      inputValidationMessage: '',
      latitude: '',
      longitude: '',
      radius: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getLatLng = this.getLatLng.bind(this);
  }
  
  handleSubmit(event) {
    event.preventDefault();

    //clear previous list of address results (if any)
    Meteor.call('addresses.clearDisplays');

    //clear from state
    this.setState({
      latitude: '',
      longitude: '',
      radius: '',
    });

    // Find the text field via the React ref
    const addressInput = ReactDOM.findDOMNode(this.refs.addressInput).value.trim();
    const latInput = ReactDOM.findDOMNode(this.refs.latInput).value.trim();
    const lngInput = ReactDOM.findDOMNode(this.refs.lngInput).value.trim();
    const radiusInput = ReactDOM.findDOMNode(this.refs.radiusInput).value.trim();

    //set state based on input fields
    this.setState({
      latitude: latInput,
      longitude: lngInput,
      radius: radiusInput,
    });

    //validate input fields
    if(addressInput && latInput && lngInput){
      this.setState({
        inputValidationMessage: 'Please only enter one of the two: address or latitude/longitude coordinates',
      });
    } else if(addressInput || (latInput && lngInput)){
      this.setState({
        inputValidationMessage: '',
      });

      //if address is provided, get lat/lng coordinates
      if(addressInput) {
        this.getLatLng(addressInput);
      }
    
      Meteor.call('addresses.calcDistance', this.state.latitude, this.state.longitude, this.state.radius);

      // Clear form
      ReactDOM.findDOMNode(this.refs.addressInput).value = '';
      ReactDOM.findDOMNode(this.refs.latInput).value = '';
      ReactDOM.findDOMNode(this.refs.lngInput).value = '';
      ReactDOM.findDOMNode(this.refs.radiusInput).value = '';
    } else if(latInput || lngInput){
      this.setState({
        inputValidationMessage: 'Please enter both a latitude and longitude',
      });
    } else {
      this.setState({
        inputValidationMessage: 'Please enter one of the following: 1) an address or 2) a latitude and longitude',
      });
    } 
  }

  getLatLng(address) {
    let parsedAddress = address.split(' ');
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    //key stored in private file
    let apiKey1 = apiKey.key;
    for (let i = 0; i < parsedAddress.length; i++) {
      if (i === 0) {
        url += `${parsedAddress[i]}`;
      } else {
        url += `+${parsedAddress[i]}`;
      }
    }
    url += `&key=${apiKey1}`;
    
    HTTP.get(url, {}, (err, res) => {
      if (err) {
        throw new Error('Error reaching out to Google Maps API');
      }

      let data = res.data.results;
      let latInput = data[0].geometry.location.lat;
      let lngInput = data[0].geometry.location.lng;
      this.setState({
        latitude: latInput,
        longitude: lngInput,
      });

      Meteor.call('addresses.calcDistance', this.state.latitude, this.state.longitude, this.state.radius);
    });
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
        <p>Enter a radius and your choice of an address or latitude/longitude coordinates below to see a list of addresses within the radius.</p>
        <div id="formValidation">{this.state.inputValidationMessage}</div>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input type = "text" name = "addressInput" placeholder="address" className="addressInput" ref="addressInput" />
            <br />
            <input type = "text" name = "latInput" placeholder="latitude" ref="latInput" />
            <input type = "text" name = "lngInput" placeholder="longitude" ref="lngInput" />
            <input type = "text" name = "radiusInput" placeholder="radius (in miles)" ref="radiusInput" required />
            <br />
            <input type = "submit" value = "submit" className="submitButton" />
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