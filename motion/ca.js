(function(){
	// summary:
	//		This is a shortened version of the clubajax library.
	//		This only handles a few convenience functions, but
	//		it has two othe things. The first is an attach/detach
	//		system which allows you to bind to anything, including
	//		dom events and functions. This is only lightly tested,
	//		it seems to work well, but I've yet to test it in IE
	//		for memory leaks. The detach seems to work though (which
	//		is the hard part). The second is the "watch" method. This
	//		logs individual variables and a label - variables that
	//		are expected to change often, say like mouse-x or window
	//		resize properties. This will attach a textarea in the upper
	//		right and contnually monitor the changes.
	//
	var _uidcount = 0;
	var _handles = {};
	var watched = {};
	var watchNode;
	
	window.ca = {
		
		watch: function(name, value){
			var build = function(){
				watchNode = document.createElement("textarea");
				watchNode.style.position = "absolute";
				watchNode.style.width = "350px;"
				watchNode.style.top = "10px";
				watchNode.style.right = "10px";
				watchNode.setAttribute("cols", 50)
				document.body.appendChild(watchNode);
			}
			if(!watchNode){
				if(!document.body){
					ca.attach(window, "load", "build");
					return;
				}else{
					build();
				}
			}
			watchNode.style.display = "";
			watched[name] = value;
			var lines=[];
			for(var n in watched){
				if(n==""){
					lines.push(watched[n]);
				}else{
					lines.push(n+": "+watched[n]);
				}
			}
			watchNode.setAttribute("rows", lines.length)
			watchNode.value = lines.join("\n");
			
		},
	
		attach: function(obj, strEvt, context, method){
			
			// get obj byId if necessary
			obj = typeof(obj)=="string" ? this.byId(obj) : obj;
			
			//
			if(arguments.length == 3){
				// there's no context given. Set it to the window.
				method = context;
				context = window;
			}
			
			// check if method is a string pointer,
			// and if so, get the actual method
			var f = typeof(method)=="string" ? context[method] : method;
			
			var handle = this.uid("handle");
			if(obj.addEventListener){
				// obj has addEventListener, which means it is a DOM or BOM
				
				// we need a reference to our function so we can detach it
				var func = function(){
					f.apply(context, arguments);
				};
				obj.addEventListener(strEvt, func, false);
				
				_handles[handle] = {
					obj:obj,
					strEvt: strEvt,
					func:func
				};
				
				
			}else if(obj.attachEvent){
				// obj has attachEvent, which means it is a DOM or BOM
				// and is IE! Who cares!
			
			}else{
				// obj has no listeners which makes it a plain old object (POO)
				// hijack the function
				// copy function to a new name, and make a new function with the
				// old name that calls the old function first, then the attached
				// function.
				var _old = obj[strEvt];
				obj[strEvt] = function(){
					// use apply to pass any arguments to both the old and new
					// functions.
					_old.apply(context, arguments);
					f.apply(context, arguments);
			
				}
				
				// save the object and function for restoration when detached.
				_handles[handle] = {
					obj:obj,
					strEvt: strEvt,
					old:_old
				};
			}
			return handle;
		},
		
		detach: function(handle, useDelete){
			var o = _handles[handle];
			
			if(o.old){
				// "hijack" event listener.
				// Restore method to what it was previously.
				//console.log("DET:", handle, o.old, o.obj.prop)
				
				//console.log("F:", o.obj[o.strEvt].toString())
				//console.log("O:", o.old.toString())
				
				o.obj[o.strEvt] = o.old;
			}else if(o.obj.removeEventListener){
				// standard event listener. Call the same args using
				// remove.
				console.log("DET REM EVT")
				o.obj.removeEventListener(o.strEvt, o.func, false);
			}else if(o.obj.dettachEvent){
				console.log("DET IE")
				// IE! This doesn't even work!!
			}else{
				// "hijack" event listener.
				// Restore method to what it was previously.
				console.log("DET:", handle, o.old, o.obj.prop)
				
				o.obj[o.strEvt] = o.old;	
			}
		},
		
		byId: function(id){
			return document.getElementById(id);
		},
		uid: function(type){
			return (type || "id") + _uidcount++;	
		},
		mix: function(o1, o2){
			for(var nm in o2){
				if(o1[nm]!==undefined){
					o1[nm] = o2[nm];
				}
			}
		},
		copy: function(obj){
			// NOTE: only makes shallow copies of objects
			var o = {};
			for(var nm in obj){
				o[nm] = obj[nm];
			}
			return o;
		},
		
		tick:0,
		onTick: function(context, method, detach){
			var f = typeof(method)=="string" ? context[method] : method;
			if(context.tickId){
				//detach
				delete obs[context.tickId]
				delete context.tickId;
				return;
			}
			context.tickId = this.uid();
			obs[context.tickId] = {f:f, o:context};
			
		}
		
	}
	var isOn = true;
	
	var obs = {};
	ca.attach(window, "load", function(){
		ca.attach(document.body, "click", function(){
			console.log("toggle");	
			isOn = !isOn
		})
		
		var count = 0;
		var v = setInterval(function(){
			if(isOn){
				for(var nm in obs){
					obs[nm].f.call(obs[nm].o, count);
				}
				count++;
				if(count>150){
					//clearInterval(v);
				}
			}
		}, 30);
	});
})();
