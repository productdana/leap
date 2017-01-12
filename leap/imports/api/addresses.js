import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Addresses = new Mongo.Collection('addresses');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('addresses', function addressesPublication() {
    return Addresses.find();
  });
}

Meteor.methods({

  'addresses.calcDistance': function(latInput, lngInput, radiusInput){
  	// check(latInput, Number);
  	// check(lngInput, Number);
  	// check(radiusInput, Number);
  	// check(addressId, String);

    if(!latInput || !lngInput || !radiusInput){
      throw new Meteor.Error("need all inputs");
    }

    //apply the bottom to every document in the Addresses collection
    var addressCollection = Addresses.find({}).fetch();
    addressCollection.forEach(function(address){
      console.log('inside Addresses.find');
      // var address = Addresses.findOne(AddressId);
      var latFromDB = address.latitude;
      var lngFromDB = address.longitude;
      console.log('latfromDb:', latFromDB);

      //convert degrees to radians
      var latInputInRadians = latInput * (Math.PI / 180);
      var lngInputInRadians = lngInput * (Math.PI / 180);
      var latFromDBInRadians = latFromDB * (Math.PI / 180);
      var lngFromDBInRadians = lngFromDB * (Math.PI / 180);
      console.log('latInputInRadians:',latInputInRadians, 'lngInputInRadians:',lngInputInRadians, 'latFromDBInRadians:',latFromDBInRadians, 'lngFromDBInRadians:', lngFromDBInRadians);

      var deltaLambda = Math.abs(lngInputInRadians - lngFromDBInRadians);
      console.log('deltaLambda', deltaLambda);
      var centralAngle = Math.acos(Math.sin(latInputInRadians) * Math.sin(latFromDBInRadians) + Math.cos(latInputInRadians) + Math.cos(latFromDBInRadians) * Math.cos(deltaLambda));
      console.log('centralAngle:', centralAngle);
      var radiusOfEarth = 3959; //3,959 miles
      var distance = radiusOfEarth * centralAngle;

      console.log('distance:', distance, 'radiusInput:', radiusInput);
      if (distance > radiusInput){
        console.log('this address is outside the radius bounds');
        Addresses.update({latitude: latFromDB, longitude: lngFromDB}, {$set: {'shouldDisplay': false}});  //how to select specific document?
      }
    });

  },
});

if (Meteor.isClient) {
  Template.inputForm.events({
    'submit form': function(event){
      event.preventDefault();
      console.log('form submitted!');
      const latInput = event.target.latInput.value;
      const lngInput = event.target.lngInput.value;
      const radiusInput = event.target.radiusInput.value;
      console.log('inputs are:', latInput, lngInput, radiusInput);
      // const latInput = ReactDOM.findDOMNode(this.refs.latInput).value.trim();
      // const lngInput = ReactDOM.findDOMNode(this.refs.lngInput).value.trim();
      // const radiusInput = ReactDOM.findDOMNode(this.refs.radiusInput).value.trim();

      Meteor.call('addresses.calcDistance', latInput, lngInput, radiusInput);
      
      // Clear form
      // ReactDOM.findDOMNode(this.refs.latInput).value = '';
      // ReactDOM.findDOMNode(this.refs.lngInput).value = '';
      // ReactDOM.findDOMNode(this.refs.radiusInput).value = '';
      // console.log('after clearing inputs are:', latInput, lngInput, radiusInput);
    }
  });
}