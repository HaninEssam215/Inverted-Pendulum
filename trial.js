//IMPORTS
const math = require('mathjs');
const nerdamer = require('nerdamer');
const polynomial = require('polynomial');
const extractCoefficients = require('./Extract_Coefficients.js');

function place(A, M, desiredPoles){

/***********1. Get the eigenvalues***********/
  const result = math.eigs(A);
  const eigenvalues = result.values;
  var eigenvaluesArray = eigenvalues.toArray();


  //Determine values of a
  const polynomialform = polynomial.fromRoots(eigenvaluesArray).toString();
  //console.log(polynomialform);
var a = extractCoefficients(polynomialform);
a.shift(); // Remove the first element from the ALPHA array
a.push(0); // Add zero at the end of the ALPHA array
console.log(a);
 // var a = [11.67850000000004, -47.54758704006962, -535.9099681004082, 0];

  //Determine W matrix
  var W = math.matrix([[a[2],a[1],a[0],1],[a[1],a[0],1,0],[a[0],1,0,0],[1,0,0,0]]);

/***********2. Determine the transformation matrix***********/
    var T = math.multiply(M,W)
    T = math.inv(T);

/***********3. Get the desired characteristic equation***********/
    var desiredPolynomialForm = polynomial.fromRoots(desiredPoles).toString();
    var ALPHA = extractCoefficients(desiredPolynomialForm);
    ALPHA.shift(); // Remove the first element from the ALPHA array
    for(var i = ALPHA.length; i <= (3); i++)
    {
        ALPHA.push(0); // Add zero at the end of the ALPHA array
    }
    ALPHA = ALPHA.map(Number);
    console.log(ALPHA);
    console.log(desiredPolynomialForm);
    ALPHA = ALPHA.reverse();
    a = a.reverse()
    var ALPHA_a = math.subtract(ALPHA, a);

/***********4. Calculate the gain matrix K***********/
    var K = math.multiply(ALPHA_a, T);
    console.log('K = '+math.format(K));

}

const A = math.matrix([[0, 1, 0, 0], [0, -11.2171, -0.9238, 0.0082], [0, 0, 0, 1], [0, 54.6289,  52.2752, -0.4614]]);
const B = math.matrix([[0],[0.8371], [0], [-4.0768]]);
const AB = math.map(math.multiply(A,B), (value) => value.toFixed(3));
const A2 = math.multiply(A,A);
const A2B = math.map(math.multiply(A2,B), (value) => value.toFixed(3));
const A3 = math.multiply(A2,A);
const A3B = math.map(math.multiply(A3,B), (value) => value.toFixed(3));
var CM = math.concat(
  math.transpose(B), 
  math.transpose(AB), 
  math.transpose(A2B), 
  math.transpose(A3B), 
  0
);
CM = math.transpose(CM);
//console.log(math.format(CM));

place(A,CM,[5,0.2,0.3,0.4]);

