const { cos, sin } = require("mathjs");


var x = 0;
var xdot = 0;
var xddot = 0;
var theta = 0.18;
var thetadot = 0;
var thetaddot = 0;
var x_T_1 = 0;
var th_T_1 = 0.18;
var N = 0;
var P = 0;
var b = 11.6;
var l = 0.33;
var m = 0.2138;
var d = 0.008;
var M = 1.64;
var Kt = 0.16;
var g = 9.81;
N_term = 0;
P_term =0;
N_term_T_1=0;
P_term_T_1=0;
N_term_T_2=0;
P_term_T_2=0;





function non_linear_model(force, Tsampling) {
  var h = Tsampling;
  var dXd = (x - x_T_1)/h;
  var dThd = (theta - th_T_1)/h;
  var Ndd = (N_term - 2*N_term_T_1 + N_term_T_2)/h/h;
  var Pdd = (P_term - 2*P_term_T_1 + P_term_T_2)/h/h;
    // Compute derivatives at the current state
  N = m * Ndd;
  P = m * (Pdd + g);
  var BDZ = (force - N - (b * dXd));
  var ADZ = DeadZone(dXd,BDZ);
  xddot = ADZ/M;
  x_T_1 = x;
  xdot += h * xddot;
  x += h * xdot;
  dXd = (x - x_T_1)/h;
  thetaddot =
     (((3 / m) / l) / l) * ((-N * l * cos(theta)) + (P * l * sin(theta)) - (d * dThd));

    // Update states using weighted averages of derivatives
 
  th_T_2 = th_T_1;
  th_T_1 = theta;
  thetadot += h * thetaddot;
  theta += h * thetadot;

  N_term_T_2 = N_term_T_1;
  N_term_T_1 = N_term;
  P_term_T_2 = P_term_T_1;
  P_term_T_1 = P_term;
  N_term = x + l*sin(theta);
  P_term = l*cos(theta);
  
  return [x, xdot, theta, thetadot];
}

function DeadZone(dXd,BDZ) {
  var fr =0;
  if(dXd<-0.01)
  {
   fr = 35.4115*Kt; 
    return BDZ + fr;
  }
  else if(dXd>0.01)
  {
    fr = -35.4115*Kt; 
    return BDZ + fr;
  }
  else
  {
    if((BDZ <= 35.4115*Kt) && (BDZ >= -35.4115*Kt))
    {
      return 0;
    }
    else
    {
      if(BDZ > 35.4115*Kt)
      {
        return BDZ - 35.4115*Kt;
      }
      else
      {
        return BDZ + 35.4115*Kt;
      }
    }
  }
}

var Tsampling = 0.005; // Sampling time or step size

for (var i = 0; i <= 60; i = i+0.005) {
    var [position, velocity, angle, angularVelocity] = non_linear_model(50, Tsampling);
   // console.log('x: ' + position + ', xdot: ' + velocity + ', theta: ' + angle + ', thetadot: ' + angularVelocity);
   console.log(position);
}