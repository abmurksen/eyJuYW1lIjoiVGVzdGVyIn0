var PubSub = function (_key){
   	   if (!_key) {
            this.key = {};
        }
       else {
       	 this.key = _key;
       	}
}		
PubSub.prototype.on = function(event, fn){
    if (!this.key) {
            this.key = {};
        }

        var events = this.key;
        if (!events.event) {
            events.event = [];
        }

        events.event.push(fn);
        return this;
}

PubSub.prototype.off = function(event, fn){
  if (!this.key || !this.key.event) {
            return this;
        }

        var events = this.key;
        if (!fn) {
            delete events.event;
        } else {
            var listeners = events.event;
            var index = listeners.indexOf(fn);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
        return this;
}

PubSub.prototype.emmit = function(event){
   if (!this.key || !this.key.event) {
            return;
        }
        var listeners = this.key.event.slice(0);
        var params = [].slice.call(arguments, 1);
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].apply(null, params);
        }
        return this;
}


module.exports = new PubSub();

 
