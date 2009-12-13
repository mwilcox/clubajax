
declare = function(){
	// summary:
		//		Creates a constructor Function from a
		//		Function, and collection of methods, and
		//		more Functions that are extended.
		// description:
		//		Similar in look and feel to Dojo declare as
		//		far as order and number of arguments, although
		//		constructed a little closer to prototypical
		//		inheritance. All arguments passed into the
		//		constructor are passed into all sub constructors.
		// arguments:
		//		Function, [Object|Function....]
		//			The first argument is always the base
		//			constructor. The last argument is always
		//			an object of methods (or empty object) to
		//			be mixed in (in the future would like to
		//			make that object optional). Remaining
		//			arguments are other constructors mixed in
		//			using extend() (See below).
		// example:
		//		|	MyFunction = dojox.drawing.util.oo.declare(
		//		|		MyOtherFunction,
		//		|		YetAnotherFunction,
		//		|		function(options){
		//		|			// This is the main constructor. It will fire last.
		//		|			// The other constructors will fire before this.
		//		|		},
		//		|		{
		//		|			customType:"equation", // mixed in property
		//		|			doThing: function(){   // mixed in method
		//		|					
		//		|			}
		//		|		}	
		//		|	);
		//		|
		//		|	var f = new MyFunction();
		//
		//
		// first arg - required
		//		constructor Function
		// second arg(s) - optional
		// 		mixin constructors
		// last arg - optional
		//		mixin object property bag
	
	var f, o, a = arguments;
	
	a = Array.prototype.slice.call(arguments);
	if(a.length == 1){ 
		f = a.pop();
		o = {};	
	}else{
		o = a.pop();
		f = a.pop();
	}
	
	f.prototype = o;
	// for(var n in o){ f.prototype[n] = o[n]; }
	
	if(a.length){
		a.unshift(f);
		return declare.extend.apply(this, a); // Function
	}else{
		var _f = function(){
			declare.mix.call(this, o, arguments[0], _f);
			f.prototype.constructor.apply(this, arguments);
		}
		_f.prototype = f.prototype;	
	}
	
	return _f; // Function
};

//
// Use a common object to track all instances, such as zindex for dialogs	
//
declare.mix = function(obj, props, f){
	for(var nm in props){
		if(obj[nm] !== undefined){
			obj[nm] = props[nm];
		}else if(declare.learn){
			console.error(nm + " is not a valid parameter");
		}else{
			var upper = nm.charAt(0).toUpperCase() + nm.substring(1)
			var o = this;//f.prototype;
			
			(function(){
				var argName = nm;
				var arg = props[nm];
				o["get" + upper] = function(){
					return typeof(arg)=="function" ? arg.apply(this) : arg;
				};
				
				o["set" + upper] = function(val){
					if(typeof(arg)=="function"){
						console.error("'" + argName + "' is only a getter.");	
					}else{
						arg = val;
					}
				};
				
			})();
		}
	}
}

declare.extend = function(){
	
	var a = Array.prototype.slice.call(arguments);
	var main = a.pop();
	
	if(arguments.length<2){ console.error("oo.extend; not enough arguments"); }
	
	// f is the actual constructor that gets fired
	var f = function (){
		declare.mix.call(this, f.prototype, arguments[0], f);
		
		// loop through all subs, starting after main
		for(var i=0;i<a.length;i++){
			a[i].prototype.constructor.apply(this, arguments);
		}
		// main should fire last
		main.prototype.constructor.apply(this, arguments);
		
	}
	for(var i=0;i<a.length;i++){
		for(var n in a[i].prototype){
			f.prototype[n] = a[i].prototype[n];
		}
	}
		
	for(var n in main.prototype){
		f.prototype[n] = main.prototype[n];
	}
	return f; // Function
}