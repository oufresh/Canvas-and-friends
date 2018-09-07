import * as mathjs from 'mathjs';
/**
 * k 0 tx 
0 k ty 
0 0 1

math.matrix([[k, 0, tx],[0,k,ty],[0,0,1]])

// create matrices
math.matrix()                           // Matrix, size [0]
math.matrix([0, 1, 2])                  // Matrix, size [3]
math.matrix([[0, 1], [2, 3], [4, 5]])   // Matrix, size [3, 2]

 */
export const identityMatrix = mathjs.matrix([[1,0,0],[0,1,0],[0,0,1]]);