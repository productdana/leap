import { Meteor } from 'meteor/meteor';
import { Addresses } from '../imports/api/addresses.js';

Meteor.startup(() => {
  // code to run on server at startup
  console.log(Addresses.find());
  var data = JSON.parse(Assets.getText("addresses.json"));
  if (Addresses.find().count() === 0) {
  	data.forEach(function(address){
  		Addresses.insert(address);
  	});
  	Addresses.update({}, {$addToSet: {'shouldDisplay':true}}, {multi: true});
  }
});

