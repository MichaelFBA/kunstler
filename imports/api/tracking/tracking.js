import { Meteor } from 'meteor/meteor';
import {drawSpline} from "/imports/api/tracking/splines.js";

export function init(id) {

    var video = document.getElementById('video');
    // var canvas = document.getElementById('canvas');
    // var context = canvas.getContext('2d');
    var drawSegments = [
        []
    ];
    var segment = 0;
    tracking.ColorTracker.registerColor('red', function(r, g, b) {
        if (r > 70 && r < 100 && g < 25 && b < 80) {
            return true;
        }
        return false;
    });

    var tracker = new tracking.ColorTracker(['red', 'cyan']);

    tracking.track('#video', tracker, {
        camera: true
    });
    tracker.on('track', function(event) {
        if (event.data.length === 0 && drawSegments[segment].length > 0) {
            segment++;
            if (!drawSegments[segment]) {
                drawSegments[segment] = [];
            }
        }
        if(event.data.length !== 0){
            Meteor.call('artwork.update', id ,event.data)
            console.log(event.data);
        }
        event.data.forEach(function(rect) {
            if (rect.color === 'red') {
                // draw(rect);
            } else if (rect.color === 'cyan') {
                // erase(rect);
            }
        });
    });

    // function draw(rect) {
    //     drawSegments[segment].push(rect.x + rect.width / 2, rect.y + rect.height / 2);
    // }
    //
    // function erase(rect) {
    //     context.clearRect(rect.x, rect.y, rect.width, rect.height);
    // }
    //
    // function isInsideRect(x, y, rect) {
    //     return rect.x <= x && x <= rect.x + rect.width &&
    //         rect.y <= y && y <= rect.y + rect.height;
    // }
    // (function loop() {
    //     for (var i = 0, len = drawSegments.length; i < len; i++) {
    //         drawSpline(context, drawSegments[i], 0.5, false);
    //     }
    //     drawSegments = [drawSegments[drawSegments.length - 1]];
    //     segment = 0;
    //     requestAnimationFrame(loop);
    // }());

}
