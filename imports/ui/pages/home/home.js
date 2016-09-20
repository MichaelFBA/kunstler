import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './home.html';

Template.home.events({
	"click #create-canvas": function(event, template) {
        var id = Meteor.call('artwork.insert', 'bla', function(error, result){
            if(result){
                FlowRouter.go('/canvas/' + result);
            }
        });
	}
});
