var Node = declare(
	Style,
	function(options){
		options = options || {};
		
		if(document.body){
			this.render(options);
		}else{
			ca.attach(window, "load", this, function(){
				this.render(options);
			});
		}
	},{
		parent:null,
		id:"",
		nodeType:"div",
		
		render: function(options){
			ca.mix(this, options);
			
			this.parent = this.parent || document.body;
			if(!this.domNode){
				this.domNode = document.createElement(this.nodeType);
				this.domNode.id = this.id;
				this.parent.appendChild(this.domNode);
			}
			
		}
	}
);