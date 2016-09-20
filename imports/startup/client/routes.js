import {
	FlowRouter
} from 'meteor/kadira:flow-router';
import {
	BlazeLayout
} from 'meteor/kadira:blaze-layout';

//Layouts
import '../../ui/layouts/header/header.js';
import '../../ui/layouts/footer/footer.js';

//Pages
import '../../ui/pages/home/home.js';
import '../../ui/pages/canvas/canvas.js';
import '../../ui/pages/p5sketch/p5sketch.js';

BlazeLayout.setRoot('body');

//Home
FlowRouter.route('/', {
	action: function(params, queryParams) {
		BlazeLayout.render('main', {
            header: "header",
            content: "home",
            footer: "footer",
        });
	}
});

//Blog
FlowRouter.route('/canvas/:id', {
	action: function(params, queryParams) {
        BlazeLayout.render('main', {
            header: "header",
            content: "p5sketch",
            footer: "footer",
        });
	}
});

//404
FlowRouter.notFound = {
	action: function() {
		BlazeLayout.render('notFound');
	}
};
