declare = function(){
	
	// declare vars.
	// 	f will be out constructor,
	//	o is the object/prototype
	// 	a shortcut for arguments
	var f, o, a = arguments;
	
	// Have to have at least a function and an object. (this could be fixed)
	if(a.length<2){ console.error("oo.declare; not enough arguments")}
	
	// A trick to convert the broken arguments object into
	// an array
	a = Array.prototype.slice.call(arguments);
	
	// last slot is our object - remove it
	o = a.pop();
	
	// now the last slot is our function - remove it
	f = a.pop();
	
	/*
	 causes sub class constructors to not fire
	f.prototype = o;
	*/
	for(var n in o){
		f.prototype[n] = o[n]; // should this be the proto?
	}
	
	if(a.length){
		// we have some classes to inherit from.
		// We removed our function and object from the list,
		// and the remaining slots are our inherited classes
		
		// add our constructor back into the array, in front 
		a.unshift(f);
		
		// extend the class
		f = this.extend.apply(this, a); // apply used because of "a" (arguments)
	}
	
	return f; // Function
};



extend = function(){
	// a: 	 shortcut for arguments
	// main: the first arg which should be our constructor	
	var a = arguments, main = a[0];
	
	// must have a constructor and something to extend
	if(a.length<2){ console.error("declare.extend; not enough arguments")}
	
	// f is the actual "constructor" that gets fired
	var f = function (){
		// loop through all subs, starting after main
		// the parent should be first in the list
		// note skipping the first or main constructor. It fires last. 
		for(var i=1;i<a.length;i++){
			a[i].prototype.constructor.apply(this, arguments);
		}
		
		// main fires last
		main.prototype.constructor.apply(this, arguments);
		
	}
	
	// access all prototypes - note skipping 1st again
	for(var i=1;i<a.length;i++){
		// and mix their props and methods into our constructor
		for(var n in a[i].prototype){
			f.prototype[n] = a[i].prototype[n];
		}
	}
	
	// now mix in the prototype from our main constructor
	// important to do this last as it's properties should
	// override all others
	for(var n in main.prototype){
		f.prototype[n] = main.prototype[n];
	}
	
	// return our constructor
	return f; // Function
}