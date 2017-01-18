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

  'addresses.calcDistance': function(addressInput, latInput, lngInput, radiusInput){
  	
    check(+latInput, Number);
  	check(+lngInput, Number);
  	check(+radiusInput, Number);

    
    //TODO: need to display error messages for input validation to UI - choice between address or lat/lng
    // console.log('!latInput:', !latInput);
    // if(!latInput || !lngInput || !radiusInput){
      
    //   this.setState({
    //     inputValidationMessage: 'need inputs dude',
    //   });

    // } else {

      //reset all shouldDisplay values to false
      Addresses.update({}, {$set: {'shouldDisplay':false}}, {multi: true});

      //TODO: if address was provided, convert that to a lat/lng

      //apply the bottom to every document in the Addresses collection
      let addressCollection = Addresses.find({}).fetch();
      addressCollection.forEach(function(address){

        let latFromDB = address.latitude;
        let lngFromDB = address.longitude;

        //convert degrees to radians
        let latInputInRadians = latInput * (Math.PI / 180);
        let lngInputInRadians = lngInput * (Math.PI / 180);
        let latFromDBInRadians = latFromDB * (Math.PI / 180);
        let lngFromDBInRadians = lngFromDB * (Math.PI / 180);

        let deltaLambda = Math.abs(lngInputInRadians - lngFromDBInRadians);
        
        //Math.acos returns NAN if its parameter is outside the range -1 to 1
        let centralAngle = Math.acos(((Math.sin(latInputInRadians) * Math.sin(latFromDBInRadians))) + (Math.cos(latInputInRadians) * Math.cos(latFromDBInRadians) * Math.cos(deltaLambda)));
        let radiusOfEarth = 3959; //3,959 miles
        let distance = radiusOfEarth * centralAngle;

        if (distance < radiusInput){
          Addresses.update({latitude: latFromDB, longitude: lngFromDB}, {$set: {'shouldDisplay': true}});
        }
      });
    // }


  },
});

if (Meteor.isClient) {
  Template.inputForm.events({
    'submit form': function(event){
      event.preventDefault();

      let addressInput = event.target.addressInput.value || '';
      let latInput = event.target.latInput.value;
      let lngInput = event.target.lngInput.value;
      let radiusInput = event.target.radiusInput.value;

      Meteor.call('addresses.calcDistance', addressInput, latInput, lngInput, radiusInput);
      
      // Clear form
      event.target.addressInput.value = '';
      event.target.latInput.value = '';
      event.target.lngInput.value = '';
      event.target.radiusInput.value = '';
    }
  });
}