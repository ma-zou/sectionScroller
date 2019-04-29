function sectionScroller(options) {
    var _self = this;
    
    _self.options = {
        container: 'sectionWrapper',
        init: true,
        transitionDuration: 600,
        timingFunction: 'easeInQuad',
        startAt: 0
    }

    _self.options = J.merge(_self.options, options);

    _self.container = document.getElementById(_self.options.container);
    _self.elements = _self.container.children
    _self.current = _self.options.startAt;
    _self.amount = _self.elements.length - 1;

    var handler = function(event) {
        var delta = Math.sign(event.deltaY);   

        event.preventDefault();
        if(_self.scrolling) return;

        if(delta > 0) {
            _self.scrolling = true;
            _self.moveNext();
            scrollTimeout();
        } else {
            _self.movePrevious();
            _self.scrolling = true;
            scrollTimeout();
        }
    }
    var scrollTimeout = function() {
        setTimeout(function() {
            _self.scrolling = false
        }, _self.options.transitionDuration);
    }
    var scrolling = function (target, callback) {
        var easings = {
            linear(t) {
                return t;
            },
            easeInQuad(t) {
                return t * t;
            },
            easeOutQuad(t) {
                return t * (2 - t);
            },
            easeInOutQuad(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            },
            easeInCubic(t) {
                return t * t * t;
            },
            easeOutCubic(t) {
                return (--t) * t * t + 1;
            },
            easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            },
            easeInQuart(t) {
                return t * t * t * t;
            },
            easeOutQuart(t) {
                return 1 - (--t) * t * t * t;
            },
            easeInOutQuart(t) {
                return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
            },
            easeInQuint(t) {
                return t * t * t * t * t;
            },
            easeOutQuint(t) {
                return 1 + (--t) * t * t * t * t;
            },
            easeInOutQuint(t) {
                return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
            }
        };
        
        var start = window.pageYOffset,
            destination = document.querySelector('section[data-section="'+target+'"]'),
            startTime = 'now' in window.performance ? performance.now() : new Date().getTime(),
            documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
            windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight,
            destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop,
            destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
    
        if ('requestAnimationFrame' in window === false) {
            window.animatedScroll(0, destinationOffsetToScroll);
            if (callback) {
                _self.current = target;
            }
            return;
        }
    
        function animatedScroll() {
            var now = 'now' in window.performance ? performance.now() : new Date().getTime(),
                time = Math.min(1, ((now - startTime) / _self.options.transitionDuration)),
                timeFunction = easings[_self.options.timingFunction](time);
            
            window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
        
            if (window.pageYOffset === destinationOffsetToScroll) {
                if (callback) {
                    _self.current = target;
                }
                return;
            }
        
            requestAnimationFrame(animatedScroll);
        }
    
        animatedScroll();
    }
    _self.init = function() {
        var i = 0;
        window.addEventListener('mousewheel', handler, {passive: false});

        [].forEach.call(_self.elements, function(element) {
            element.setAttribute('data-section', i);
            i++;
        });
    }
    _self.moveTo = function(targetId) {
        if(targetId > 0 && targetId < _self.amount) {
            var target = targetId;
        } else {
            return;
        }
        scrolling(target, true);
    }
    _self.moveNext = function() {  
        if(_self.current === _self.amount) return;
        var target = _self.current + 1;
        scrolling(target, true);
    }  
    _self.movePrevious = function() {
        if(_self.current === 0) return;
        var target = _self.current - 1;
        
        scrolling(target, true);
    }  

    if(_self.options.init) _self.init();
}

window.onload = function() {
    var scroller = new sectionScroller();
}