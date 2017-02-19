/* Light gallery plugin with customizations for danaia-art*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgDanaia = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports !== "undefined") {
        factory();
    } else {
        var mod = {
            exports: {}
        };
        factory();
        global.LgDanaia = mod.exports;
    }
})(this, function () {
    'use strict';

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    var danaiaDefaults = {
        hash: true,
        appendCategoryTo: '.lg-toolbar'
    };
    var DanaiaCustom = function DaniaCustom(element) {
        this.el = element;
        this.core = window.lgData[this.el.getAttribute('lg-uid')];
        this.core.s = _extends({}, danaiaDefaults, this.core.s);
        if (this.core.s.hash) {
            this.oldHash = window.location.hash;
            this.oldLocation = window.location.pathname; //added to oirignal implimentation
            this.init();
        }

        return this;
    };

    DanaiaCustom.prototype.init = function () {
        var _this = this;
        var _hash;

        _this.controls();

        // Change hash value on after each slide transition
        utils.on(_this.core.el, 'onAfterSlide.lgtm', function (event) {           
           //history.pushState doesn't work for local file when document.origin == null
           if (window.location.protocol.startsWith ("file")) return;
           var p = _this.core.items[event.detail.index];
           var  loc = "/pictures/" +p.Page+ ".html";
           if (_this.core.s.category) loc+="?category="+_this.core.s.category;
           history.pushState(null, "Danaia Art - "+p.Title, loc);           
           document.title = "Danaia Art - "+p.Title;
           ga('send', 'pageview', loc);
           //original implimintation in hash plugin 
           // window.location.hash = 'lg=' + _this.core.s.galleryId + '&slide=' + event.detail.index;
        });

        // Listen hash change and change the slide according to slide value
        utils.on(window, 'hashchange.LgDanaia', function () {
            //original implimintation in hash plugin
            /*
            _hash = window.location.hash;
            var _idx = parseInt(_hash.split('&slide=')[1], 10);

            // it galleryId doesn't exist in the url close the gallery
            if (_hash.indexOf('lg=' + _this.core.s.galleryId) > -1) {
                _this.core.slide(_idx, false, false);
            } else if (_this.core.lGalleryOn) {
                _this.core.destroy();
            }*/
        });
    };

    DanaiaCustom.prototype.destroy = function () {
        if (!this.core.s.hash) {
            return;
        }

        //set site default location
        history.pushState(null, "Danaia Art", "/");        
        document.title = "Danaia Art";
        //replacement for original implimintation
        //if (this.oldLocation) {
        //   history.pushState('', document.Title, this.oldLocation);        
        //}


        ///original implimintation 
        /*
        // Reset to old hash value
        if (this.oldHash && this.oldHash.indexOf('lg=' + this.core.s.galleryId) < 0) {
            window.location.hash = this.oldHash;
        } else {
            if (history.pushState) {
                history.pushState('', document.title, window.location.pathname + window.location.search);
            } else {
                window.location.hash = '';
            }
        }
        */

        utils.off(this.core.el, '.LgDanaia');
    };

    DanaiaCustom.prototype.controls = function () {
        var _this = this;
        
        var _html = '<span class="lg-icon" id="danaia-home"></span><span id="danaia-category">'
                    +_this.core.s.title+'</span>';

        // Append autoplay controls
        _this.core.outer.querySelector(this.core.s.appendCategoryTo).insertAdjacentHTML('afterbegin', _html);

        utils.on(_this.core.outer.querySelector('#danaia-category'), 'click.lg', function () {            
            _this.core.destroy();            
        });

        utils.on(_this.core.outer.querySelector('#danaia-home'), 'click.lg', function () {            
            _this.core.destroy();            
        });

    };

    window.lgModules.danaiaCustom = DanaiaCustom;
});

},{}]},{},[1])(1)
});