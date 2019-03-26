var matrix = [
    [ 1,2,3 ],
    [ 4,5,6 ],
    [ 7,8,9 ]
];

// for(let row = 0; row<matrix.length; ++row){
//     for(let column = 0; column<matrix[0].length; ++column){
//         console.log(row+" "+column);
//         console.log("looking at: "+matrix[row][column]);
//     }
// }

console.table(matrix)
function transpose(matrix) {
    for (var row = 0; row < matrix.length; row++) {
      for (var col = 0; col < row; col++) {
        const temp = matrix[row][col];
        matrix[row][col] = matrix[col][row];
        matrix[col][row] = temp;
      }
    }
  }
transpose(matrix)
console.table(matrix)
matrix.forEach(row => row.reverse());
console.table(matrix)
