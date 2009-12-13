var PropertyMotion = declare(
	function(options, obj){
		this.obj = obj;
		this.setup(options);
	},{
		prop:null,
		position:0,
		speed:0,
		duration:0,
		
		begTick:0,
		endTick:0,
		currentTick:0,
		handle:null,
		
		setup: function(options){
			ca.mix(this, options);	
			ca.onTick(this, "move");
			
			this.begTick = ca.tick;
			if(this.duration){
				this.endTick = this.begTick + this.duration;
			}
		},
		
		next: function(){
			
		},
		
		move: function(tic){
			
			if(this.duration && tic > this.duration){
				ca.onTick(this, "move");
				return;
			}
			
			if(this.hadHit){
				this.speed *= -1;
				this.hadHit = false;
			}
			
			var org = this.obj.defaults[this.prop];
			
			if(org + this.speed < 0){
				this.speed *= -1;
			}
			
			if(this.prop == "left" && org+this.speed+ parseInt(this.obj.defaults.width) > document.body.clientWidth){
				this.speed *= -1;
			}
			
			if(this.prop == "top" && org+this.speed + parseInt(this.obj.defaults.height) > document.body.clientHeight){
				this.speed *= -1;
			}
			
			this.onMove(this.prop,  this.speed, tic);
		},
		
		hadHit:false,
		hits: function(){
			this.hadHit = true;
			console.log("HIT", this.obj.id, this.prop)
		},
		
		onMove: function(key, value, tic){
			// stub
		}
	}
);