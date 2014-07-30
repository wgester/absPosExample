/**
 * Scrollview Debug Environment
 * ------------
 */
define(function(require, exports, module) {
    var Engine = require("famous/core/Engine");
    var Surface = require("famous/core/Surface");
    var Modifier = require('famous/core/Modifier');
    var ScrollContainer = require("famous/views/ScrollContainer");
    var GridLayout = require('famous/views/GridLayout');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    // parameters
    var numSurfaces = 200
    var surfaceSize = 200;
    var paginated = false;
    var scrollviewDirection = 1;
    var skipAhead = 5;

    var headerSize = 50;
    var footerSize = 70;

    ////////////////////////////////////
    // SCROLLVIEW CONTENT
    ////////////////////////////////////

    var surfaces = [];

    var scrollContainer = new ScrollContainer({
        container : {
            properties : {border : '1px solid black'}
        },
        scrollview : {
            direction : scrollviewDirection,
            paginated: paginated,
            groupScroll: true,
            speedLimit: 10
        }
    });

    // make global
    window.scrollview = scrollContainer.scrollview;

    scrollContainer.sequenceFrom(surfaces);

    for (var i = 0, surface; i < numSurfaces; i++) {
        surface = new Surface({
            content: "Surface: " + i,
            size: [undefined, 200],
            properties: {
                background: "hsla(" + (i * 360 / 40) + ", 100%, 50%, 0.8)",
                border: '1px solid white',
                lineHeight: surfaceSize + "px",
                textAlign: "center",
                fontSize : '50px'
            }
        });

        surfaces.push(surface);
    }

    var direction = 0;
    scrollview.on('pageChange', function(data){
        direction = data.direction;
    });


    ////////////////////////////////////
    // NAV FOOTER
    ////////////////////////////////////

    var footerNode = new GridLayout({
        dimensions : [4, 1]
    });

    var prevSurface = new Surface({
        content : 'prev',
        properties : {
            background : 'rgb(100,100,100)',
            color : 'white',
            textAlign : 'center',
            fontSize : '24px',
            border : '1px solid black',
            lineHeight : footerSize + 'px',
            cursor : 'pointer'
        }
    });

    var nextSurface = new Surface({
        content : 'next',
        properties : {
            background : 'rgb(100,100,100)',
            color : 'white',
            textAlign : 'center',
            fontSize : '24px',
            border : '1px solid black',
            lineHeight : footerSize + 'px',
            cursor : 'pointer'
        }
    });

    var skipPrevSurface = new Surface({
        content : 'prev ' + skipAhead,
        properties : {
            background : 'rgb(100,100,100)',
            color : 'white',
            textAlign : 'center',
            fontSize : '24px',
            border : '1px solid black',
            lineHeight : footerSize + 'px',
            cursor : 'pointer'
        }
    });

    var skipNextSurface = new Surface({
        content : 'next ' + skipAhead,
        properties : {
            background : 'rgb(100,100,100)',
            color : 'white',
            textAlign : 'center',
            fontSize : '24px',
            border : '1px solid black',
            lineHeight : footerSize + 'px',
            cursor : 'pointer'
        }
    });

    footerNode.sequenceFrom([skipPrevSurface, prevSurface, nextSurface, skipNextSurface]);

    var _event = ('ontouchstart' in window) ? 'touchend' : 'mouseup';

    prevSurface.on(_event, function(){
        scrollview.goToPreviousPage();
    });

    nextSurface.on(_event, function(){
        scrollview.goToNextPage();
    });

    skipPrevSurface.on(_event, function(){
        var index = scrollview._node.index;
        scrollview.goToPage(index - skipAhead);
    });

    skipNextSurface.on(_event, function(){
        var index = scrollview._node.index;
        scrollview.goToPage(index + skipAhead);
    });


    ////////////////////////////////////
    // STATS HEADER
    ////////////////////////////////////

    var stats = {
        index : function() { return scrollview._node.index; },
        vel : function() { return scrollview.getVelocity().toFixed(2); },
        absPos : function() { return Math.round(scrollview.getAbsolutePosition()); },
        spring : function() { return scrollview._springState; },
        dir : function() { return direction }
    };

    var statSurfaces = [];
    for (var key in stats) {
        statSurfaces.push(
            new Surface({
                content : key + ': ' + stats[key](),
                properties : {
                    background : 'rgb(100,100,100)',
                    color : 'white',
                    textAlign : 'center',
                    fontSize : '18px',
                    lineHeight : headerSize + 'px',
                    border : '1px solid black'
                }
            })
        );
    }

    var statsLayout = new GridLayout({
        dimensions : [statSurfaces.length, 1]
    });

    statsLayout.sequenceFrom(statSurfaces);


    ////////////////////////////////////
    // LAYOUT
    ////////////////////////////////////

    var layout = new HeaderFooterLayout({
        headerSize : headerSize,
        footerSize : footerSize
    });

    layout.header.set(statsLayout);
    layout.content.add(scrollContainer);
    layout.footer.set(footerNode);

    var counter = 0;
    Engine.on('prerender', function(){
        if (counter % 5 === 0){
            var i = 0;
            for (var key in stats) {
                statSurfaces[i].setContent(key + ': ' + stats[key]());
                i++;
            }
            counter = 0;
        }
        counter++
    });

    scrollview.on('settle', function(){
        console.log('settled');
    });

    var mainContext = Engine.createContext();
    mainContext.add(layout);
});
