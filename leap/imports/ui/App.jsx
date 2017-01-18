import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Addresses } from '../api/addresses.js';
 
import Address from './Address.jsx';
 
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      inputValidationMessage: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const addressInput = ReactDOM.findDOMNode(this.refs.addressInput).value.trim();
    const latInput = ReactDOM.findDOMNode(this.refs.latInput).value.trim();
    const lngInput = ReactDOM.findDOMNode(this.refs.lngInput).value.trim();
    const radiusInput = ReactDOM.findDOMNode(this.refs.radiusInput).value.trim();
    console.log('addressInput: ',addressInput);
    if(addressInput || (latInput && lngInput)){
      this.setState({
        inputValidationMessage: '',
      });

      Meteor.call('addresses.calcDistance', addressInput, latInput, lngInput, radiusInput);
    } else {
      this.setState({
        inputValidationMessage: 'need address dude',
      });
      //TODO: clear previous output results
    }
    // Clear form
    ReactDOM.findDOMNode(this.refs.addressInput).value = '';
    ReactDOM.findDOMNode(this.refs.latInput).value = '';
    ReactDOM.findDOMNode(this.refs.lngInput).value = '';
    ReactDOM.findDOMNode(this.refs.radiusInput).value = '';
  }

  // validateForm() {
  //   // Find the text field via the React ref
  //   const addressInput = ReactDOM.findDOMNode(this.refs.addressInput).value.trim();
  //   console.log('addressInput: ',addressInput);
  //   if(!addressInput){
  //     this.setState({
  //       inputValidationMessage: 'need address dude',
  //     });
  //   } else {
  //     this.setState({
  //       inputValidationMessage: '',
  //     });
  //   }
  // }

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
            <input type = "text" name = "latInput" placeholder="latitude in render" ref="latInput" />
            <input type = "text" name = "lngInput" placeholder="longitude" ref="lngInput" />
            <input type = "text" name = "radiusInput" placeholder="radius (in miles)*" ref="radiusInput" required />
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