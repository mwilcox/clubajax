var Motion = declare(
	function(options){
		options = options || {};
	},{
		props:null,
		speed:0,
		direction:0,
		duration:0,
		begTick:0,
		endTick:0,
		currentTick:0,
		
		move: function(options){
			
			ca.mix(this, options);	
			ca.attach(ca, "onTick", this, "onMove")
			this.currentTick = ca.tick;
			this.begTick = ca.tick;
			if(this.duration){
				this.endTick = this.begTick + this.duration;
			}
		},
		onMove: function(tic){
			//console.log("tic")
		}
	}
);