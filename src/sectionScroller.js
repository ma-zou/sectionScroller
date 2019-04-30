function sectionScroller(options) {
    var _self = this;
    
    _self.options = {
        container: 'sectionWrapper',
        init: true,
        transitionDuration: 600,
        timingFunction: 'easeInQuad',
        startAt: 0,
        scrollOffset: 0
    }

    _self.options = J.merge(_self.options, options);

    _self.container = document.getElementById(_self.options.container);
    _self.elements = _self.container.children
    _self.current = _self.options.startAt;
    _self.amount = _self.elements.length - 1;
    _self.keycodes = {
        up: [38, 33],
        down: [34, 40]
    };

    var handler = function(event) {
        var beforeSection = (_self.current === _self.amount && window.pageYOffset > _self.container.scrollHeight) || (_self.current === 0 && window.pageYOffset < _self.container.offsetTop),
            afterSection = (_self.current === _self.amount && window.pageYOffset > _self.container.scrollHeight) || (_self.current === 0 && window.pageYOffset < _self.container.offsetTop),
            windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight,
            sectionHeight = Math.max(_self.currentElement.offsetHeight, _self.currentElement.clientHeight, _self.currentElement.scrollHeight),
            delta = 0;
        
        if(event.type === "keydown") {
            if (_self.keycodes.up.indexOf(event.keyCode) !== -1) {
                delta = -100;
            } else if (_self.keycodes.down.indexOf(event.keyCode) !== -1) {
                delta = 100;
            } else {
                return;
            }
        } else {
            delta = event.deltaY;  
        }
        if(_self.scrolling) return;
        
        if(delta > 0) { // down
            if(beforeSection) {
                return
            } else {
                if(sectionHeight > windowHeight && window.pageYOffset < _self.currentElement.offsetTop + sectionHeight - windowHeight) {
                    return;
                } else {
                    event.preventDefault();
                    _self.scrolling = true;
                    _self.moveNext();
                    scrollTimeout();
                }
            }
        } else { // up
            if(afterSection) {
                return;
            } else {
                if(sectionHeight > windowHeight && window.pageYOffset > _self.currentElement.offsetTop) {
                    return;
                } else {
                    event.preventDefault();
                    _self.movePrevious();
                    _self.scrolling = true;
                    scrollTimeout();
                }
            }
        }
    }
    var scrollTimeout = function() {
        setTimeout(function() {
            _self.scrolling = false
        }, _self.options.transitionDuration);
    }
    var scrolling = function (target, callback) {
        var easings = {
            linear: function(t) {
                return t;
            },
            easeInQuad: function(t) {
                return t * t;
            },
            easeOutQuad: function(t) {
                return t * (2 - t);
            },
            easeInOutQuad: function(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            },
            easeInCubic: function(t) {
                return t * t * t;
            },
            easeOutCubic: function(t) {
                return (--t) * t * t + 1;
            },
            easeInOutCubic: function(t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            },
            easeInQuart: function(t) {
                return t * t * t * t;
            },
            easeOutQuart: function(t) {
                return 1 - (--t) * t * t * t;
            },
            easeInOutQuart: function(t) {
                return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
            },
            easeInQuint: function(t) {
                return t * t * t * t * t;
            },
            easeOutQuint: function(t) {
                return 1 + (--t) * t * t * t * t;
            },
            easeInOutQuint: function(t) {
                return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
            }
        };
        
        var start = window.pageYOffset,
            destination = document.querySelector('[data-section="'+target+'"]'),
            startTime = 'now' in window.performance ? performance.now() : new Date().getTime(),
            documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
            windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight,
            destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop,
            scrollOffset = (typeof _self.options.scrollOffset == 'number') ? _self.options.scrollOffset : document.querySelector(_self.options.scrollOffset).clientHeight,
            destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset) - scrollOffset;

        if ('requestAnimationFrame' in window === false) {
            window.animatedScroll(0, destinationOffsetToScroll);
            if (callback) {
                _self.currentElement = destination;
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
                    _self.currentElement = destination;
                    _self.current = target;
                }
                return;
            }
        
            requestAnimationFrame(animatedScroll);
        }
    
        animatedScroll();
    }
    var setClasses = function(next) {
        var nextElm = document.querySelector('[data-section="'+next+'"]'),
            currentElm = document.querySelector('[data-section="'+_self.current+'"]');

        nextElm.classList.add('scrollingIn');
        currentElm.classList.add('scrollingOut');
        
        setTimeout(function() {
            nextElm.classList.add('active');
            currentElm.classList.remove('active');
            setTimeout(function() {
                nextElm.classList.remove('scrollingIn');
                currentElm.classList.remove('scrollingOut');
            }, (_self.options.transitionDuration / 2));
        }, (_self.options.transitionDuration / 2));
    }
    var positionObserver = function() {
        var scrollOffset = (typeof _self.options.scrollOffset == 'number') ? _self.options.scrollOffset : document.querySelector(_self.options.scrollOffset).clientHeight
        for (var i = 0; i < _self.elements.length; i++) {
            if(_self.elements[i].offsetTop > window.pageYOffset + scrollOffset) break;
            else _self.current = i;
        }
    }
    _self.init = function() {
        var i = 0;
        window.addEventListener('mousewheel', handler, {passive: false});
        window.addEventListener('wheel', handler, {passive: false});
        document.addEventListener('keydown', handler);

        positionObserver();

        [].forEach.call(_self.elements, function(element) {
            if(i === _self.current) {
                element.classList.add('active');
                _self.currentElement = element;
            }
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
        setClasses(target);
        scrolling(target, true);
    }
    _self.moveNext = function() {  
        if(_self.current === _self.amount) return;
        var target = _self.current + 1;
        setClasses(target);
        scrolling(target, true);
    }  
    _self.movePrevious = function() {
        if(_self.current === 0) return;
        var target = _self.current - 1;
        setClasses(target);
        scrolling(target, true);
    }  
    _self.update = function(options) {
        _self.options = J.merge(_self.options, options);
    };

    if(_self.options.init) _self.init();
}