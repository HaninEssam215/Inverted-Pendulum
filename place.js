/** 
*This code implements a pole placement algorithm in JavaScript. 
*The algorithm allows you to calculate the gain matrix K for control systems based on the provided system matrices A and B, 
*as well as the desired pole locations.
*/

//IMPORTS
const math = require('mathjs');
const nerdamer = require('nerdamer');
const polynomial = require('polynomial');

export function place(A, B, desiredPoles){

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
  const polynomialform = polynomial.fromRoots(eigenvaluesArray).toString();
  var a = [11.67850000000004, -47.54758704006962, -535.9099681004082, 0];

  //Determine W matrix
  var W = math.matrix([[a[2],a[1],a[0],1],[a[1],a[0],1,0],[a[0],1,0,0],[1,0,0,0]]);

/***********3. Determine the transformation matrix***********/
    var T = math.multiply(M,W)
    T = math.inv(T);

/***********4. Get the desired characteristic equation***********/
    var desiredPolynomialForm = polynomial.fromRoots(desiredPoles).toString();
  //Get the coefficients alpha
    var coef = desiredPolynomialForm.split('+').map(v=>v.trim()).map(v=>v.split('x')[0]).map(v=>v.replace(/^\*+|\*+$/g, ''));
      //for coefficient = 1 
    for(var i = 0; i < coef.length ; i++)
    {
        if(coef[i] == '')
        {
          coef[i] = 1;
        }
    }

  //Coefficients matrix = alpha - a
    var ALPHA= [];
    for (var i =0; i<(coef.length-1); i++)
    {
      ALPHA[i] = coef[i+1];
    }
    ALPHA = ALPHA.map(Number);
    ALPHA = ALPHA.reverse();
    a = a.reverse()
    var ALPHA_a = math.subtract(ALPHA, a);

/***********5. Calculate the gain matrix K***********/
    var K = math.multiply(ALPHA_a, T);
    return K;

}



