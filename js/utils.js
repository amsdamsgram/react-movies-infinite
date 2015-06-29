/**
 * Created by idams on 6/26/15.
 */

'use strict';

var Utils = {};

Utils.throttle = function(callback,context,timeout){
    if( this.throttle.locked ) return;

    callback.call(context);

    this.throttle.locked = true;

    var self = this;

    window.setTimeout(function(){
        self.throttle.locked = false;
    }, timeout);
}
export default Utils;