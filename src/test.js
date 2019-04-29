/**
 * @desc J Library with handy helper functions
 * @version 1.0.0
 * @author Dominik Kressler
 * @author Malte Zoudlik
*/
var J = function()
{
    return this
};
J.prototype.merge = function(obj1, obj2)
{
    var obj3 = {};
    
    for (var attrname in obj1)
        obj3[attrname] = obj1[attrname];
    
    for (var attrname in obj2)
        obj3[attrname] = obj2[attrname];
    
    return obj3;
};
J.prototype.isOnScreen = function(node)
{
    if (typeof node != 'object') return true;

    var bounding = node.getBoundingClientRect();
    
    var isOnScreen = (
        bounding.top + bounding.height >= 0 
        && bounding.left + bounding.width >= 0 
        && bounding.right - bounding.width <= (window.innerWidth || document.documentElement.clientWidth) 
        && bounding.bottom - bounding.height <= (window.innerHeight || document.documentElement.clientHeight)
    );

    if(isOnScreen) {
        node.classList.add('lazyLoaded');
        node.classList.add('isOnScreen');
    }
    else node.classList.remove('isOnScreen');

    return isOnScreen;
};
J.prototype.isNodeElement = function(element) {
    return element instanceof Element || element instanceof HTMLDocument; 
};
J.prototype.deepValue = function(obj, path) {
    for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
        if(obj[path[i]] == null || typeof obj[path[i]] == "undefined") obj = '';
        else obj = obj[path[i]];
    };
    return obj;
};
J = new J();