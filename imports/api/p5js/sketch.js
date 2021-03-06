import { Artwork } from '/imports/api/artwork/artwork.js';
import p5 from '/node_modules/p5/lib/p5.min.js'

export function sketch(id) {

	new p5(function(p) {
		// All the paths
		var paths = [];
		// Are we painting?
		var painting = false;
		// How long until the next circle
		var next = 0;
		// Where are we now and where were we?
		var current;
		var previous;
		var art;

		p.setup = function() {
			var container = p.createCanvas(720, 400);
			current = p.createVector(0, 0);
			previous = p.createVector(0, 0);
		};

		p.draw = function() {


			p.background(200);

			// If it's time for a new point
			if (p.millis() > next && painting) {
				art = Artwork.findOne({_id: id}) || {};
				console.log('art', art);
				// Grab mouse position
				current.x = p.mouseX;
				current.y = p.mouseY;

				// New particle's force is based on mouse movement
				var force = p5.Vector.sub(current, previous);
				force.mult(0.05);

				// Add new particle
				paths[paths.length - 1].add(current, force);

				// Schedule next circle
				next = p.millis() + p.random(100);

				// Store mouse values
				previous.x = current.x;
				previous.y = current.y;
			}

			// Draw all paths
			for (var i = 0; i < paths.length; i++) {
				paths[i].update();
				paths[i].display();
			}
		}

		// Start it up
		p.mousePressed = function() {
			next = 0;
			painting = true;
			previous.x = p.mouseX;
			previous.y = p.mouseY;
			paths.push(new Path());
		}

		// Stop
		p.mouseReleased = function() {
			painting = false;
		}

		// A Path is a list of particles
		Path = function() {
			this.particles = [];
			this.hue = p.random(100);
		}

		Path.prototype.add = function(position, force) {
			// Add a new particle with a position, force, and hue
			this.particles.push(new Particle(position, force, this.hue));
		}

		// Display plath
		Path.prototype.update = function() {
			for (var i = 0; i < this.particles.length; i++) {
				this.particles[i].update();
			}
		}

		// Display plath
		Path.prototype.display = function() {

			// Loop through backwards
			for (var i = this.particles.length - 1; i >= 0; i--) {
				// If we shold remove it
				if (this.particles[i].lifespan <= 0) {
					this.particles.splice(i, 1);
					// Otherwise, display it
				} else {
					this.particles[i].display(this.particles[i + 1]);
				}
			}

		}

		// Particles along the path
		Particle = function(position, force, hue) {
			this.position = p.createVector(position.x, position.y);
			this.velocity = p.createVector(force.x, force.y);
			this.drag = 0.95;
			this.lifespan = 255;
		}

		Particle.prototype.update = function() {
			// Move it
			this.position.add(this.velocity);
			// Slow it down
			this.velocity.mult(this.drag);
			// Fade it out
			this.lifespan--;
		}

		// Draw particle and connect it with a line
		// Draw a line to another
		Particle.prototype.display = function(other) {
			p.stroke(0, this.lifespan);
			p.fill(0, this.lifespan / 2);
			p.ellipse(this.position.x, this.position.y, 8, 8);
			// If we need to draw a line
			if (other) {
				p.line(this.position.x, this.position.y, other.position.x, other.position.y);
			}
		}
	}, document.getElementById('sketch'));
}
