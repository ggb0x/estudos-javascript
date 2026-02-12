/* Objetivo: fazer um código que:
    imprimir todos os números de 1 a 100.
        se num % 3 = frizz
        se num % 5 = buzz
*/

for (let num = 1; num <= 100 ; num++) {
    if (num % 3 === 0) {
        console.log("frizz")        
    } else if (num % 5 === 0) {
        console.log("buzz")
    } else {
        console.log(num)
    }
}