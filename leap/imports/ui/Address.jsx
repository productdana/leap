import React, { Component, PropTypes } from 'react';
 
// Task component - represents a single todo item
export default class Address extends Component {
  render() {
    return (
      <li>{this.props.address.street_number} {this.props.address.route}, {this.props.address.locality}, {this.props.address.administrativeArea}, {this.props.address.postalCode}, {this.props.address.country} </li>
    );
  }
}
 
Address.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  address: PropTypes.object.isRequired,
};