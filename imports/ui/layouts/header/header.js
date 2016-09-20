import './header.html';

Template.header.onCreated = function(){
    console.log('header created')
};
Template.header.helpers({
    create: function(){

    },
    rendered: function(){

    },
    destroyed: function(){

    },
});

Template.header.events({
    "click #foo": function(event, template){

    }
});
