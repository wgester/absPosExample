/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/surface');
    var CollectionManager = require('famous/core/CollectionManager');

    var surfaces = [];
    for (var i = 1; i < 11; i++) {
        var surface = new Surface({
            size = [i * 10, i * 10]
        });
        surfaces.push(surface);
    }
    
    var cm = new CollectionManager();
    cm.sequenceFrom(surfaces);

    window.cm = cm;


});
