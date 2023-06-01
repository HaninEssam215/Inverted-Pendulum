/** 
*This code implements a pole placement algorithm in JavaScript. 
*The algorithm allows you to calculate the gain matrix K for control systems based on the provided system matrices A and B, 
*as well as the desired pole locations.
*/

//IMPORTS
const math = require('mathjs');
const nerdamer = require('nerdamer');
const polynomial = require('polynomial');
const extractCoefficients = require('./Extract_Coefficients.js');

function place(A, B, desiredPoles){

/***********1. Check Controllability***********/
const AB = math.map(math.multiply(A,B), (value) => value.toFixed(3));
const A2 = math.multiply(A,A);
const A2B = math.map(math.multiply(A2,B), (value) => value.toFixed(3));
const A3 = math.multiply(A2,A);
const A3B = math.map(math.multiply(A3,B), (value) => value.toFixed(3));
var M = math.concat(
  math.transpose(B), 
  math.transpose(AB), 
  math.transpose(A2B), 
  math.transpose(A3B), 
  0
);
M = math.transpose(M);

/***********2. Get the eigenvalues***********/
  const result = math.eigs(A);
  const eigenvalues = result.values;
  var eigenvaluesArray = eigenvalues.toArray();


  //Determine values of a
  const polynomialForm = polynomial.fromRoots(eigenvaluesArray).toString();
  var a = extractCoefficients(polynomialForm);
  a.shift(); // Remove the first element from the array
  for(var i = a.length; i <= (3); i++)
  {
      a.push(0); // Add zero at the end of the  array
  }
  //var a = [11.67850000000004, -47.54758704006962, -535.9099681004082, 0];

  //Determine W matrix
  var W = math.matrix([[a[2],a[1],a[0],1],[a[1],a[0],1,0],[a[0],1,0,0],[1,0,0,0]]);

/***********3. Determine the transformation matrix***********/
    var T = math.multiply(M,W)
    T = math.inv(T);

/***********4. Get the desired characteristic equation***********/
    var desiredPolynomialForm = polynomial.fromRoots(desiredPoles).toString();
  //Get the coefficients alpha
    var ALPHA = extractCoefficients(desiredPolynomialForm);
    ALPHA.shift(); // Remove the first element from the ALPHA array
    for(var i = ALPHA.length; i <= (3); i++)
    {
        ALPHA.push(0); // Add zero at the end of the ALPHA array
    }
    ALPHA = ALPHA.map(Number);
    ALPHA = ALPHA.reverse();
    a = a.reverse()
    var ALPHA_a = math.subtract(ALPHA, a);
   // var ALPHA_a = math.subtract(a.reverse(), ALPHA.reverse()); // Fix the order of subtraction

/***********5. Calculate the gain matrix K***********/
    var K = math.multiply(ALPHA_a, T);
    return K;

}

const A = math.matrix([[0, 1, 0, 0], [0, -11.2171, -0.9238, 0.0082], [0, 0, 0, 1], [0, 54.6289,  52.2752, -0.4614]]);
const B = math.matrix([[0],[0.8371], [0], [-4.0768]]);
var k = place(A,B,[9,0.2,0.3,0.4]);
console.log(k.format());

module.exports = place;
