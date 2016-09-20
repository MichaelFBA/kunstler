import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Artwork = new Mongo.Collection('artwork');

Meteor.methods({
    'artwork.insert'(text) {
        check(text, String);

        // Make sure the user is logged in before inserting a task
        // if (! this.userId) {
        //   throw new Meteor.Error('not-authorized');
        // }

        return Artwork.insert({
            createdAt: new Date(),
        });
    },
    'artwork.update'(id, pointData) {
        check(id, String);

        // Make sure the user is logged in before inserting a task
        // if (! this.userId) {
        //   throw new Meteor.Error('not-authorized');
        // }

        return Artwork.update(
            { _id: id },
            { $push: { data: pointData } }
        );
    },
})


//Publications
if (Meteor.isServer) {

    Meteor.publish('artwork', function(id) {
      return Artwork.find({_id: id });
    });

}
