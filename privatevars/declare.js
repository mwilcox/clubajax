declare = function(){
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

	var secured = o.secured || null;
	delete o.secured;	

	if(a.length){
		a.unshift(f);
		a.push(secured);
		return declare.extend.apply(this, a); // Function
	}else{
		var _f = function(){
			declare.mix.call(this, o, arguments[0], _f, secured);
			f.prototype.constructor.apply(this, arguments);
		}
		_f.prototype = f.prototype;	
	}

	return _f; // Function
};

declare.mix = function(obj, props, f, secured){


	//Secured Code Copies the initial object for each new object and any method prefixed with 'secure'
	//gets passed the its secured object as the first parameter.
	if (secured) {
		var securedCopy = {};
		for (var prop in secured) securedCopy[prop] = secured[prop];
		for (var n in obj){
			if (typeof obj[n] == 'function' && /^secure /.test(n)) {
				(function(n){
					var func = obj[n];
					this[n.replace(/^.*\s+/, '')] = function(){
						return func.apply(this, [securedCopy].concat(Array.prototype.slice.call(arguments)));
					};
				}).call(this, n);
			}
		}
	}

	for(var nm in props){
		if(obj[nm] !== undefined){
			obj[nm] = props[nm];
			//previous line should probably be:
			//this[nm] = props[nm];
		}else if(declare.learn){
			console.error(nm + " is not a valid parameter");
		}else{
			var upper = nm.charAt(0).toUpperCase() + nm.substring(1);
			var o = f.prototype;
			//also all setters and getters being put onto 'o' should probably be put on 'this' also
			//because the next time I create an object I might not pass it the same properties, but the getters and setters are still there.


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
	var secured = a.pop();
	var main = a.pop();
	
	if(arguments.length<2){ console.error("oo.extend; not enough arguments"); }
	
	// f is the actual constructor that gets fired
	var f = function (){
		declare.mix.call(this, f.prototype, arguments[0], f, secured);
		
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
