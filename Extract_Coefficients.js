function extractCoefficients(polynomialString) {
    const coefficients = [];
  
    // Remove whitespace and split the polynomial string by the '+' or '-' signs
    const terms = polynomialString.replace(/\s/g, '').split(/(?=[+\-])/);
  
    // Iterate over the terms array
    for (let term of terms) {
      // Extract the coefficient and check the sign
      const match = term.match(/^([+\-])?(\d+(?:\.\d+)?)?/);
      const sign = match[1] === '-' ? -1 : 1;
      const coefficient = match[2] ? Number(match[2]) : 1;
  
      // Add the coefficient with its sign to the result array
      coefficients.push(sign * coefficient);
    }
  
    return coefficients;
  }
  
  // Example usage
 // const polynomialString = 'x^4+11.67850000000004x^3-47.54758704006962x^2-535.9099681004082x';
 // const coefficients = extractCoefficients(polynomialString);
  
 // console.log(coefficients);
  
  module.exports = extractCoefficients;
  