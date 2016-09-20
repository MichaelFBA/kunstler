import { Template } from 'meteor/templating';

import { Artwork } from '/imports/api/artwork/artwork.js';

import tracking from '/node_modules/tracking/build/tracking-min.js'
import {init} from "/imports/api/tracking/tracking.js";
import './canvas.html'

Template.canvas.onCreated(function(){
    var self = this;
    self.autorun(function() {
        var id = FlowRouter.getParam('id');
        self.subscribe('artwork', id);
    });
})

Template.canvas.onRendered(function(){
    init(FlowRouter.getParam('id'));
})

Template.canvas.helpers({
    canvasData: function() {
        var id = FlowRouter.getParam('id');
        var art = Artwork.findOne({_id: id}) || {};
        return art;
    }
});
