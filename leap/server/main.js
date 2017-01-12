import { Meteor } from 'meteor/meteor';
import { Addresses } from '../imports/api/addresses.js';

Meteor.startup(() => {
  // code to run on server at startup
  
  //clear Addresses collection
  Addresses.remove({});

  //import addresses.json file & add shouldDisplay field with value of false to each address
  let data = JSON.parse(Assets.getText("addresses.json"));
  if (Addresses.find().count() === 0) {
  	data.forEach(function(address){
  		Addresses.insert(address);
  	});
  	Addresses.update({}, {$set: {'shouldDisplay':false}}, {multi: true});
  }
});

