var Style = declare(
	
	function(options){
		options = options || {};
		this.defaults = ca.copy(this.defaults);
		
		if(options.random){
			var color = function(){
				var rand = function(){
					var r = Math.random() 
					var hex = Math.ceil(r*255)
					return hex.toString(16)
				}
				return "#" + rand()+rand()+rand();
			}
			
			options.id = ca.uid();
			var min = 20, max = 200;
			var r = Math.random();
			var sz = Math.ceil((max-min)*r);
			
			options.backgroundColor = color();
			options.width = sz;
			options.height = sz;
			
			var bw = document.body.clientWidth;
			var bh = document.body.clientHeight;
			
			options.top = sz + Math.ceil(Math.random()*(bh-sz*2))
			options.left = sz + Math.ceil(Math.random()*(bw-sz*2))
			
			console.log("LEFT:", options.left)
			
		}
		ca.attach(this, "render", this, function(){
			this.style(options);
			var maxs = 10;
			if(options.random){
				this.move([
					{
						prop:"top",
						speed: -maxs + Math.ceil(Math.random()*maxs*2)
					},
					{
						prop:"left",
						speed: -maxs + Math.ceil(Math.random()*maxs*2)
					}
				])
			}
		});
		this.propMap = {};
	},
	{
		defaults:{
			
			position:"absolute",
			top:	0,
			left:	0,
			width:	100,
			height:	100,
			backgroundColor:"#ffffff",
			color:"#000000",
			border:0
			//border:"1px solid #ccc"
		
		},
		exprt: function(){
			return {
				x:this.defaults.left,
				y:this.defaults.top,
				w:this.defaults.width,
				h:this.defaults.height,
				cx: this.defaults.left + this.defaults.width / 2,
				cy: this.defaults.top + this.defaults.height / 2
			}
		},
		
		path: function(){
			
		},
		
		suffix: function(nm){
			return ["top","left","width","height"].indexOf(nm) > -1 ? "px" : "";
		},
		
		style: function(options){
			ca.mix(this.defaults, options)
			for(var nm in this.defaults){
				this.domNode.style[nm] = this.defaults[nm] + this.suffix(nm);
			}
			
			this.domNode.style.WebkitBorderRadius = this.defaults.width/2 + "px"
			this.domNode.style.MozBorderRadius = this.defaults.width/2 + "px"
		},
		
		applyStyle: function(key, value, tic){
			this.defaults[key] = parseInt(this.defaults[key]) + value;
			this.domNode.style[key] = this.defaults[key] + "px";
		},
		
		hits: function(prop){
			this.propMap.top.hits();
			this.propMap.left.hits();
		},
		
		move: function(options){
			options = options.push ? options : [options];
			for(var i=0;i<options.length;i++){
				var p = new PropertyMotion(options[i], this);
				this.propMap[options[i].prop] = p;
				ca.attach(p, "onMove", this, "applyStyle");
			}
		}
	}
	
)