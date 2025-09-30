function printPattern(){
    let rows = 5;
    let letters = "ABCDE";

    let maxWidth = (rows * 2)-1;

    for(let i = 0; i < rows; i++){
        let char = letters[i];
        let repeat = rows - i;
        let line = (char + " ").repeat(repeat).trim();
        

        let left = Math.floor(maxWidth - line.length)/2;
        let right = maxWidth - line.length - left;

        console.log(" ".repeat(left) + line + " ".repeat(right));
    }
}
printPattern();