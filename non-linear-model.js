const { abs, cos, sin, sign } = require("mathjs");


var x = 0;
var xdot = 0;
var xddot = 0;
var theta = 0.18;
var thetadot = 0;
var thetaddot = 0;
var N = 0;
var P = 0;
var b = 13.4;
var l = 0.154;
var m = 0.15;
var d = 0.002;
var M = 1.1571;
var Kt = 0.00185121;
var g = 9.81;

function non_linear_model(force, Tsampling) {
    var h = Tsampling;

    // Compute derivatives at the current state
    var k1_xdot = xdot;
    var k1_thetadot = thetadot;
    var k1_xddot = force - N - (b * xdot);
    var k1_thetaddot =
        (((3 / m )/ l) / l) *( (-N * l * cos(theta)) + (P * l * sin(theta)) - (d * thetadot));

    // Compute intermediate states
    var xdot_intermediate = xdot + (h / 2) * k1_xddot;
    var thetadot_intermediate = thetadot + (h / 2) * k1_thetaddot;

    // Compute derivatives at the intermediate states
    var k2_xdot = xdot_intermediate;
    var k2_thetadot = thetadot_intermediate;
    var k2_xddot = force - N - (b * xdot_intermediate);
    var k2_thetaddot =
    (((3 / m )/ l) / l) *( (-N * l * cos(theta)) + (P * l * sin(theta)) - (d * thetadot));

    // Update states using weighted averages of derivatives
    x += h * (k1_xdot + k2_xdot) / 2;
    theta += h * (k1_thetadot + k2_thetadot) / 2;
    xdot += h * (k1_xddot + k2_xddot) / 2;
    thetadot += h * (k1_thetaddot + k2_thetaddot) / 2;

    // Compute additional variables
    xddot = force - N - (b * xdot);
    var acc = acceleration(xdot, xddot, Kt);
    N = m * ((acc / M) - (l * thetadot * thetadot * sin(theta)) + (l * thetaddot * cos(theta)));
    P = m * ((-l * thetadot * thetadot * cos(theta) )- (l * thetaddot * sin(theta) )+ g);

    return [x, xdot, theta, thetadot];
}

function acceleration(xdot, xddot, Kt) {
    var friction = 0;
    var y = 0;
    if (xdot != 0) {
        friction = -1 * 3662.9 * Kt * sign(xdot);
        y = xddot + friction;
    } else {
        if (abs(xddot) < 3662.9 * Kt) {
            y = 0;
        } else {
            if (xddot == 0) {
                y = 0;
            } else {
                y = xddot + sign(xddot) * -1 * 3662.9 * Kt;
            }
        }
    }
    return y;
}

var Tsampling = 0.005; // Sampling time or step size
var numSteps = 15 / Tsampling;

for (var i = 0; i <= 15; i = i+0.005) {
    var [position, velocity, angle, angularVelocity] = non_linear_model(50, Tsampling);
   // console.log('x: ' + position + ', xdot: ' + velocity + ', theta: ' + angle + ', thetadot: ' + angularVelocity);
   console.log(angularVelocity);
}


  




