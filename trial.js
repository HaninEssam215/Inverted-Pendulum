const { abs, cos, sin, sign, unit, pi } = require("mathjs");

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

  // Compute intermediate states and derivatives using Dormand-Prince method
  var k1 = derivatives(x, theta, xdot, thetadot, force);
  var k2 = derivatives(x + (h * k1[0]) / 5, theta + (h * k1[1]) / 5, xdot + (h * k1[2]) / 5, thetadot + (h * k1[3]) / 5, force);
  var k3 = derivatives(x + (h * (3 * k1[0] + 9 * k2[0])) / 40, theta + (h * (3 * k1[1] + 9 * k2[1])) / 40, xdot + (h * (3 * k1[2] + 9 * k2[2])) / 40, thetadot + (h * (3 * k1[3] + 9 * k2[3])) / 40, force);
  var k4 = derivatives(x + (h * (44 * k1[0] - 168 * k2[0] + 160 * k3[0])) / 45, theta + (h * (44 * k1[1] - 168 * k2[1] + 160 * k3[1])) / 45, xdot + (h * (44 * k1[2] - 168 * k2[2] + 160 * k3[2])) / 45, thetadot + (h * (44 * k1[3] - 168 * k2[3] + 160 * k3[3])) / 45, force);
  var k5 = derivatives(x + (h * (19372 * k1[0] - 76080 * k2[0] + 64448 * k3[0] - 1908 * k4[0])) / 6561, theta + (h * (19372 * k1[1] - 76080 * k2[1] + 64448 * k3[1] - 1908 * k4[1])) / 6561, xdot + (h * (19372 * k1[2] - 76080 * k2[2] + 64448 * k3[2] - 1908 * k4[2])) / 6561, thetadot + (h * (19372 * k1[3] - 76080 * k2[3] + 64448 * k3[3] - 1908 * k4[3])) / 6561, force);
  var k6 = derivatives(x + (h * (9017 * k1[0] - 35568 * k2[0] + 30616 * k3[0] - 9848 * k4[0] + 3072 * k5[0])) / 22275, theta + (h * (9017 * k1[1] - 35568 * k2[1] + 30616 * k3[1] - 9848 * k4[1] + 3072 * k5[1])) / 22275, xdot + (h * (9017 * k1[2] - 35568 * k2[2] + 30616 * k3[2] - 9848 * k4[2] + 3072 * k5[2])) / 22275, thetadot + (h * (9017 * k1[3] - 35568 * k2[3] + 30616 * k3[3] - 9848 * k4[3] + 3072 * k5[3])) / 22275, force);

  // Update states using weighted averages of derivatives
  x += (h * (k1[0] * 35 + k3[0] * 500 + k4[0] * 125 + k5[0] * 875) / 384);
  theta += (h * (k1[1] * 35 + k3[1] * 500 + k4[1] * 125 + k5[1] * 875) / 384);
  xdot += (h * (k1[2] * 35 + k3[2] * 500 + k4[2] * 125 + k5[2] * 875) / 384);
  thetadot += (h * (k1[3] * 35 + k3[3] * 500 + k4[3] * 125 + k5[3] * 875) / 384);

  // Compute additional variables
  xddot = force - N - (b * xdot);
  var acc = acceleration(xdot, xddot, Kt);
  N = m * ((acc / M) - (l * thetadot * thetadot * sin(theta)) + (l * thetaddot * cos(theta)));
  P = m * ((-l * thetadot * thetadot * cos(theta)) - (l * thetaddot * sin(theta)) + g);

  return [x, xdot, theta, thetadot];
}

function derivatives(x, theta, xdot, thetadot, force) {
  var k1_xdot = xdot;
  var k1_thetadot = thetadot;
  var k1_xddot = force - N - (b * xdot);
  var k1_thetaddot = (((3 / m) / l) / l) * ((-N * l * cos(theta)) + (P * l * sin(theta)) - (d * thetadot));

  return [k1_xdot, k1_thetadot, k1_xddot, k1_thetaddot];
}

function acceleration(xdot, xddot, Kt) {
  var friction = 0;
  var y = 0;
  if (xdot !== 0) {
    friction = -1 * 3662.9 * Kt * sign(xdot);
    y = xddot + friction;
  } else {
    if (abs(xddot) < 3662.9 * Kt) {
      y = 0;
    } else {
      if (xddot === 0) {
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

for (var i = 0; i <= 15; i = i + 0.005) {
  var [position, velocity, angle, angularVelocity] = non_linear_model(10, Tsampling);
  console.log(position);
}
