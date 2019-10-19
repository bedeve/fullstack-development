---
name: Javascript
route: web-app/javascript
tags: web-app, javascript, js
---

## Variables

const: Can't mutate the content of the variable

examples 

1. 
```
const name = 'Vasilis'
name= 'Kostas'
console.log(name) //log: error
```



2. 
```
const kids = ["bob_dog" , "anonymous_cat"]
console.log("kids length", kids.length);
kids.push ["random_rat"]
console.log("kids length", kids.length);

console.log(typeof(kids))
log: object

```
let :  Can mutate the value of the variable

Examples

1. 
```
let name = 'Maria'
name = 'Nikos'
console.log(name) // Nikos
```

2.
```
let age=0
console.log(age)
age++ // age= age+1
age+=2 // age = age + 2

```
var : (deprecated). We will use the let variable instead
Var has a global/window scope so we shouldn't use it!


### Data types
#### array
Example
```
const arr1 = ["black","white","purple"]

```
##### checks
- .some() - return true/false, checks if any of an element in an array! past a test, stops to iterate when finds at least one instance
  example 
```
import React from "react";
import ReactDOM from "react-dom";
import data from "./data";

console.log(data.results);
const hasKylie = data.results.some((result, index) => {
  console.log(result.name, index);
  if (result.name.includes("Kylie")) {
    return true;
  }
  return false;
});
console.log(hasKylie);
```

- .length() - return the length if an array

- .filter()- returns a new array that includes the items that return true at the callback function.
  example 

- .includes() - checks if the input argument exists inside an array 

- Array.isArray() - check if it is an array

- .indexOf() - returns the index of a value array. Starts  from zero 

- .typeOf() - check type of variable
            -  for array and objects and null returns object 
Examples

```js
const bully = {};

if (typeof bully === "object") {
  if (Array.isArray(bully)) {
    console.log("array");
  } else if (typeof bully === null) {
    console.log(null);
    }
    else{
    console.log("object");
  }
} else {
  if (typeof bully === "string") {
    console.log("string");
  } else if (typeof bully === "number") {
    console.log("number");
  }
}
```
undefined vs null 
undefined : never defined
null : on purpose null 
```
let nothing;
console.log(nothing)// undefined
```
```
const aBasicArray = ["Vas", "Ad", "El", "Ko", "Di", "Su", "Ma", "Di"];

console.log(aBasicArray.includes("Bob"));
console.log(aBasicArray.includes("Vas"));

console.log(aBasicArray.indexOf("Di"));
```
##### methods
loops

#### object

#### string

#### number

#### null

#### undefined

## Loops
### for
### while
### Array loops

## Conditionals

## Functions

## Classes

## Programming styles

### Functional

### Object oriented