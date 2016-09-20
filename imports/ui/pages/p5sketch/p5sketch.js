import {sketch} from '/imports/api/p5js/sketch.js'
import './p5sketch.html'

Template.p5sketch.onCreated(function(){
    var self = this;
    self.autorun(function() {
        var id = FlowRouter.getParam('id');
        self.subscribe('artwork', id);
    });
})

Template.p5sketch.onRendered(function() {
    sketch(FlowRouter.getParam('id'));
});
