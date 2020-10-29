[0] == ![0]
// false
[0] == ![0]
// true

// Breakdown of
{} + {}
// '[object Object][object Object]'
/** 
 * when an object is coerced it tries to get a primitive out of .valueOf(),
 * otherwise it returns the .toString()
 */
{}.valueOf()
// {}
{}.toString()
// '[object Object]'

// Breakdown of
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
 


[].valueOf()
// []
// since it returned a non-primitize we fall back to returning the .toString()
[].toString()
// ''

+({}.toString())
// NaN
0 == '0'
// true
0 == +'0'
// true
'0' == 0
// true
(0).toString()
// '0'