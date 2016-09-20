import './footer.html'; 

Template.footer.onCreated = function(){
    console.log('footer created')
};
Template.footer.helpers({
    create: function(){

    },
    rendered: function(){

    },
    destroyed: function(){

    },
});

Template.footer.events({
    "click #foo": function(event, template){

    }
});
