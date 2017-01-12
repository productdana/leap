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

  'addresses.calcDistance'(latInput, lngInput, radiusInput){
  	check(latInput, Number);
  	check(lngInput, Number);
  	check(radiusInput, Number);
  	check(addressId, String);

    if(!latInput || !lngInput || !radiusInput){
      throw new Meteor.Error("need all inputs");
    }

    //apply the bottom to every document in the Addresses collection

    const address = Addresses.findOne(AddressId);
    var latFromDB = address.latitude;
    var lngFromDB = address.longitude;
    console.log('latfromDb:', latFromDB);

    //convert degrees to radians
    var latInputInRadians = latInput * (Math.PI / 180);
    var lngInputInRadians = lngInput * (Math.PI / 180);
    var latFromDBInRadians = latFromDB * (Math.PI / 180);
    var lngFromDBInRadians = lngFromDB * (Math.PI / 180);

    var deltaLambda = Math.abs(lngInputInRadians - lngFromDBInRadians);

    var centralAngle = Math.acos(Math.sin(latInputInRadians) * Math.sin(latFromDBInRadians) + Math.cos(latInputInRadians) + Math.cos(latFromDBInRadians) * Math.cos(deltaLambda));
    var radiusOfEarth = 3959;	//3,959 miles
    var distance = radiusOfEarth * centralAngle;

    console.log('distance:', distance, 'radiusInput:', radiusInput);
    if (distance > radiusInput){
    	Addresses.update(addressId, {$set: {'shouldDisplay': false}});	//how to select specific document?
    }
  },
});