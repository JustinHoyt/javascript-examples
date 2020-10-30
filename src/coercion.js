[] == [];
// false
/**
 * Since they are the same type it calls '===' which just checks to see if they
 * are referencing the same object
 */ 


[] == ![];
// false
/** 
 * steps breakdown 
 * follow this step by step as you go through the breakdown
 * http://ecma-international.org/ecma-262/6.0/index.html#sec-abstract-equality-comparison
 */
[] == !Boolean([]);
[] == false;
[] == Number(false);
Number([].toPrimitive('Value')) == 0;
0 == 0;
true;

[1] == ![1];
// false
[1] == !Boolean([1]);
[1] == false;
[1] == 0;
Number([].toPrimitive('Value')) == 0;
1 == 0;
// false

// Breakdown of
{} + {};
// '[object Object][object Object]'
/** 
 * toPrimitve calls valueOf, then falls back to toString if a non-primitive is
 * returned when an object is coerced it tries to get a primitive out of
 * .valueOf(), otherwise it returns the .toString()
 */
{}.toPrimitive()) == {}.toPrimitive());
// {}.valueOf();
// {}
// {}.toString();
// '[object Object]'
'[object Object]' + '[object Object]'
// '[object Object][object Object]'


// Breakdown of [] + {}
[] + {};
// '[object Object]'
[].valueOf();
// []
[].toString();
// ''
{}.valueOf();
// {}
{}.toString();
// '[object Object]'
'' + '[object Object]'
// '[object Object]'

// Breakdown of {} + []
{} + [];
// 0    (different behavior on node, but 0 is the cononical answer)
+[]; // the {} is processed as block scope, thus gets ignored as a left operand for (+)
Number([].toPrimitive('Value'));
// 0
