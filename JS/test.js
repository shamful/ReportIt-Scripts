function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

// Call this function to toggle browser fullscreen view
function fullscreenToggle(){
    if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

$(document).ready( function(){
    // Insert attribution toggle button
    $('body').append('<a id="attrToggle" style="position:absolute;left:0px;top:150px;width:50px;height:50px;background-color:#222;color:#fff;text-align:center;cursor:pointer">i</a>');
    // Add ordnance survey back in to attribution div - Shouldn't need this when RpeortIt has scripts functionality
    $('#OpenLayers_Control_Attribution_15').append(', © OS license number 1234567');
    // Toggle attribution click event
    $('#attrToggle').click( function(){
        $('#OpenLayers_Control_Attribution_15').toggle();
    });

    // Insert Map Stats div
    $('body').append('<div title="Map Event Stats" id="mapStats" class="shrunk" style="transition:all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);word-wrap:break-word;position:absolute;top:70px;z-index:9992;left:60px;height:20px;width:100px;padding:15px;border:0px;background-color:#2f2f2f;color:#D7D7D7;overflow:hidden"></div>');
    $('#mapStats').append('<div>Click Me</div>');
    $('#mapStats').append('<ul id="statsList" style="padding:0px">');
    // Shrink / expand Map Stats on click
    $('#mapStats').click( function(){
      if( $(this).hasClass('shrunk') ){
        $(this).removeClass('shrunk').animate({
          'width':'320px',
          'top':'0px',
          'height':'100%',
          'left':'0px'
        });
      } else {
        $(this).addClass('shrunk').animate({
          'width':'100px',
          'height':'20px',
          'top':'50px',
          'left':'60px'
        });
      }
    });

    // Insert user navigation history text Area
    $('body').append('<textarea title="Map Navigation History in geoJson" id="navHistoryLog" class="shrunk" style="outline:0px;transition:all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);overflow:auto;position:absolute;top:70px;right:0px;padding:15px;border:0px;background-color:#2f2f2f;color:#D7D7D7;width:200px;height:30px;z-index:9999">Hi :) \n\nRefresh the page if you see this text </textarea>');
    // Shrink / expand navigation history div
    $('#navHistoryLog').click( function(){
      if( $(this).hasClass('shrunk') ){
        $(this).removeClass('shrunk').animate({
          'width':'300px',
          'top':'0px',
          'height':'100%'
        });
      } else {
        $(this).addClass('shrunk').animate({
          'width':'200px',
          'height':'30px',
          'top':'50px'
        });
      }
    });

    // placeholder in search input box
    $('#SearchBox').attr('placeholder','Search by Post Code');

    // Add sub titles to legend table
    // Store legend row selector
    var legendRows = $('div#LayerSwitcher + div table tr');
    // Insert rows to table for sub titles
    legendRows.eq(0).before('<tr><td class="subtitle individualSpaces" colspan="3"><b>Individual Spaces</b></td></tr>');
    legendRows.eq(1).after('<tr><td class="subtitle clusterPoints" colspan="3"><b>Parking Blocks</b></td></tr>');
    // Group table rows using class and hide class if required
    // individual spaces
    legendRows.eq(0).addClass('individualSpaces');
    legendRows.eq(1).addClass('individualSpaces');
    $('.individualSpaces').hide();

    // cluster / block points
    legendRows.eq(2).addClass('clusterPoints');
    legendRows.eq(3).addClass('clusterPoints');
    $('.clusterPoints').hide();

    // Hide legend when filter on click of
    $('.MapToolDiv:nth-child(2), #DialogCloseDiv').click( function(){
        // toggle legend display
        $('div#LayerSwitcher + div').toggle();

        setTimeout(function(){
          $('#DialogContentDiv button:eq(1), #DialogContentDiv button:eq(2)').click( function(){
            $('div#LayerSwitcher + div').show();
          });
        }, 200);
    });

    // Toggle browser's F11 fullscreen mode when SOMETHING clicked - NEED A BUTTON ************************************
    $('.subtitle').click(fullscreenToggle);

    // Setup notice div
    $('body').append('<div id="zoomInNotice" class="notice">Zoom in to see individual spaces</div>');
    $('#zoomInNotice').css({
        'background-color': '#007229',
        'color': '#fff',
        'position': 'absolute',
        'left':'50px',
        'top':'0px',
        'padding':'13px',
        'font-size':'12pt',
        'width':'300px',
        'height':'25px',
        'display':'none'
    });
    // Notice 2 - unavailable spaces for residnets of estate or BB holders
    $('body').append('<div id="residentBBNotice" class="notice" >If you are a resident of this estate or a Blue Badge holder, it may be possible to allocate you a space. Alternatively, you can join the waiting list. <br/><span><a class="bubbleBtn" id="contactOffice" href="" target="_new">Contact the Area Housing Office</a></span></div>');
    $('#residentBBNotice').css({
        'background-color': '#007229',
        'color': '#fff',
        'position': 'absolute',
        'left':'50px',
        'top':'0px',
        'padding':'13px',
        'font-size':'12pt',
        'line-height':'2em',
        'display':'none'
    });
});

// Hide / Show legend items base on map zoom level
// Need to see if we can make this dynamic by some means
function updateLegend(currentZoom){
  // Hard coded to match HASS Parking layer zoom visibility
  if(currentZoom <= 11){
      $('.clusterPoints').fadeOut(200);
      $('.individualSpaces').fadeOut(200);
  }
  if(currentZoom >= 12 && currentZoom <= 15){
      $('.individualSpaces').fadeOut(200, function(){
        $('.clusterPoints').fadeIn(200);
      });
  }
  if(currentZoom >= 16){
      $('.clusterPoints').fadeOut(200, function(){
        $('.individualSpaces').fadeIn(200);
      });
      $('#zoomInNotice').fadeOut(200);
  }
}

// Get user location and add marker
// Need to restyle marker
function getUserLocation(){
  // Recenter on user position
  navigator.geolocation.getCurrentPosition(function(position) {
    var markers1 = new OpenLayers.Layer.Markers("Markers");
          var lonLat = new OpenLayers.LonLat(position.coords.longitude,
                                  position.coords.latitude)
                    .transform("EPSG:4326", "EPSG:900913");
          markers1.addMarker(new OpenLayers.Marker(lonLat));
          Map1.addLayer(markers1);
          Map1.setCenter(lonLat, 14);
      });
}

function updateMapStats(){
  //Create and populate map stats object
  var mapStats = [];
  mapStats.push({"Map Center": Map1.getCenter()});
  mapStats.push({"Map Size": Map1.getCurrentSize()});
  mapStats.push({"Map Extent": Map1.getExtent()});
  mapStats.push({"Zoom Level": Map1.getZoom()});

  // Remove any li with data before new li data is inserted
  $('ul#statsList ul').remove();
  $('ul#statsList li').remove();
  // Iterate through object
  for (var key in mapStats) {
     if (mapStats.hasOwnProperty(key)) {
         var obj = mapStats[key];
          for (var prop in obj) {
            // important check that this is objects own property
            // not from prototype prop inherited
            if(obj.hasOwnProperty(prop)){
              $('ul#statsList').append('<li>'+prop+'</li> <ul><li>'+obj[prop]+'</li></ul>');
            }
         }
      }
  }

// Map stats
  for(var i=0; i<5; i++){
    try{
        $('ul#statsList').append('<li>'+Map1.layers[i].name+'</li> <ul><li>'+Map1.layers[i].features.length+'</li></ul>');
    } catch(err){}
  }
}

function updateNavHistoryLog(){
  var currentZoom = Map1.getZoom();
  var currentLatLon = Map1.getCenter().transform("EPSG:900913","EPSG:4326");
  var currentUrl = window.location.href.split('?');

  updateLegend(currentZoom);

  // Fix zoomlevel for parameters
  // Seems like zoom levels in reportit params are one off .. why???
  currentZoom += 1;
  // TEMP FIX - URL params don't work with zoomlevel 19 - perhaps something to do with above issue
  if(currentZoom === 19){currentZoom = 18}

  // get current date and time
  var nowDate = new Date();
  var nowTime = nowDate.getHours()+':'+nowDate.getMinutes()+":"+nowDate.getSeconds();
  nowDate = nowDate.getDate()+"/"+nowDate.getMonth()+"/"+nowDate.getFullYear();

  // Update URL with params on map move
  var mapState = {
      // split incident name from incidnet layer as it will be reformed
      // using jquery params below
      Incident    :getURLParameter('Incident'),
      Latitude    :currentLatLon["lat"],
      Longitude   :currentLatLon["lon"],
      // Not sure why I have to add one to the zoom level for it to work with Shane's url params
      ZoomLevel   :currentZoom,
      "Date"      :nowDate,
      "Time"      :nowTime
  };

  // geojson features object to be pushed to full geojson object = mapNavHistory
  var mapHistoryFeatures = {
        "type": "Feature",
        "properties": {
          "Incident": getURLParameter('Incident'),
          "ZoomLevel": currentZoom,
          "Date": nowDate,
          "Time": nowTime
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            currentLatLon["lon"],
            currentLatLon["lat"]
          ]
        }
      }

  // jQuery function turns object into url parameters string bar=foo&foo=bar
  var mapStateParams = $.param(mapState);

  // Save user navigation history in object
  mapNavHistory.features.push(mapHistoryFeatures);

  // Update URL with parameters
  window.history.pushState("Hass Parking", "Hass Parking", currentUrl[0]+'?'+mapStateParams);
  $('#navHistoryLog').val(JSON.stringify(mapNavHistory));

  // Keep scroll at bottom in history log textarea os that user can see latest entries
  var scrollHeight = $('#navHistoryLog').attr('scrollHeight');
  $('#navHistoryLog').scrollTop( scrollHeight );
}




// Zoom in notice - display every N seconds
setInterval(function(){
    if( Map1.getZoom() <= 15 ){
        $('#zoomInNotice').fadeIn().delay(5000).fadeOut();
    }
}, 20000);

// TIMEOUT THEN RUN THE FOLLLOWING - GIVES TIME FOR Map1 Openlayers object to initialise - ASK CADLINE ABOUT THIS****
setTimeout(function(){
    // Update legend items after Map1 object has loaded
    updateLegend(Map1.getZoom());

    // Setup geoJson object
    window.mapNavHistory = {
        "type": "FeatureCollection",
        "features": []
      };

    // Run on map load and add event listener for map move or zoom
    updateNavHistoryLog();
    Map1.events.register('move', Map1, function(){
      updateNavHistoryLog();
    });
    // Map events stats
    updateMapStats();
    Map1.events.register('move', Map1, function(){
      updateMapStats();
    });

}, 1000);
