(function() {

	var proto = location.protocol;
	if (proto == 'file:') { proto = 'http:'; }

	//console.log(proto);

// Localize jQuery variable
var jQuery;
console.log('meems')
/******** Load jQuery if not present *********/
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.11.3') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    script_tag.setAttribute("src",
        proto + "//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
              scriptLoadHandler();
          }
      };
    } else {
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
}


/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict();
	if (typeof $ == 'undefined') { $ = jQuery; } 
    // Call our main function
    main(); 
}

function main() {

	// Load javascript
	jQuery.getScript( proto + '//code.jquery.com/ui/1.12.1/jquery-ui.js', function() {

	jQuery.getScript( proto + '//www.jarviwiki.fi/scripts/ol3/ol.js', function() {

	jQuery.getScript( proto + '//www.jarviwiki.fi/scripts/ol-ext/dist/ol-ext.min.js', function() {

	jQuery.getScript( proto + '//www.jarviwiki.fi/common/slide-to-submit/js/slide-to-submit.js', function() {

	jQuery.getScript( proto + '//www.jarviwiki.fi/scripts/ol-geocoder/ol-geocoder.js', function() {

	jQuery.getScript( proto + '//www.jarviwiki.fi/scripts/proj4js/dist/proj4.js', function() {

	jQuery.getScript( proto + '//www.jarviwiki.fi/scripts/jwol3js/jwol3.js', function() {

	jQuery.getScript( proto + '//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js', function() {

	jQuery.getScript( proto + '//www.jarviwiki.fi/scripts/tooltipster/dist/js/tooltipster.bundle.min.js', function() {
	
	jQuery.getScript( proto + '//www.jarviwiki.fi/scripts/plupload-2/plupload.full.min.js', function() {	
	
	jQuery.getScript( proto + '//www.jarviwiki.fi/scripts/plupload-2/jquery.ui.plupload/jquery.ui.plupload.min.js', function() {	

	jQuery.getScript( proto + '//www.jarviwiki.fi/scripts/plupload-2/i18n/fi.js', function() {	

        //css_link = jQuery("<link>", { rel: "stylesheet", type: "text/css", 
        //    href: "//stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" 
        //}); css_link.appendTo('head');  

        css_link = jQuery("<link>", { rel: "stylesheet", type: "text/css", 
            href: proto + "//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" 
        }); css_link.appendTo('head');  

        css_link = jQuery("<link>", { rel: "stylesheet", type: "text/css", 
            href: proto + "//www.jarviwiki.fi/scripts/ol3/ol.css" 
        }); css_link.appendTo('head');  

        css_link = jQuery("<link>", { rel: "stylesheet", type: "text/css", 
            href: proto + "//www.jarviwiki.fi/scripts/ol-ext/dist/ol-ext.min.css" 
        }); css_link.appendTo('head');  

        // Load CSS
        var css_link = jQuery("<link>", { rel: "stylesheet", type: "text/css", 
            href: proto + "////www.jarviwiki.fi/scripts/ol-geocoder/ol-geocoder.min.css" 
        }); css_link.appendTo('head');   

        // Load CSS
        var css_link = jQuery("<link>", { rel: "stylesheet", type: "text/css", 
            href: proto + "//www.jarviwiki.fi/scripts/tooltipster/dist/css/tooltipster.bundle.min.css" 
        }); css_link.appendTo('head');  
        // Load CSS
        var css_link = jQuery("<link>", { rel: "stylesheet", type: "text/css", 
            href: proto + "//www.jarviwiki.fi/scripts/tooltipster/dist/css/plugins/tooltipster/sideTip/themes/tooltipster-sideTip-light.min.css" 
        }); css_link.appendTo('head');  

        // Load CSS
        var css_link = jQuery("<link>", { rel: "stylesheet", type: "text/css", 
            href: proto + "//www.jarviwiki.fi/scripts/jwol3js/jwol3.css?ver=poid" 
        }); css_link.appendTo('head');   

        // Load CSS
        var css_link = jQuery("<link>", { rel: "stylesheet", type: "text/css", 
            href: proto + "//www.jarviwiki.fi/scripts/plupload-2/jquery.ui.plupload/css/jquery.ui.plupload.css?ver=4" 
        }); css_link.appendTo('head');  

        // Load CSS
        var css_link = jQuery("<link>", { rel: "stylesheet", type: "text/css", 
            href: proto + "//www.jarviwiki.fi/common/citobsembed.css?ver=qweerwer" 
        }); css_link.appendTo('head');    


	allLoaded();

	}); }); }); }); }); }); }); }); }); }); }); });


function allLoaded() { 

	// globals
	var memo = {};
	memo.serviceO = {};
	var imgUploader = null;
	var filesA = [];
	var postdata = {};
	var zoomMoreResolution = 50;
	var api = proto + '//rajapinnat.ymparisto.fi/api/kansalaishavainnot/1.0'; 

	function getServiceList(api) {

		jQuery.ajax({
			type: 'GET',
			url: api + '/services.json',
			dataType: 'json',
			cache: false,
			success: function(services) {

				loadCounter--;

				for (var s in services) {

					if (services[s].service_code != '' && services[s].service_code.indexOf(':') == -1) {
						memo.serviceO[services[s].service_code] = services[s];
					}

				}

				//console.log();

				if (loadCounter == 0) {
					loopThroughElements();
					setInterval(function(){ loopThroughElements(); }, 3000);
				}

			},
			error: function(err) {
				console.log(err);

				loadCounter--;

				if (loadCounter == 0) {
					loopThroughElements();
					setInterval(function(){ loopThroughElements(); }, 3000);
				}

			}
		});
	}

	var loadCounter = 2;
	//getServiceList(proto + '//api.kansalaishavainnot.fi/citobsdb/open311/v2');
	getServiceList(proto + '//rajapinnat.ymparisto.fi/api/kansalaishavainnot/1.0');
	getServiceList(proto + '//testbed.ymparisto.fi/Open311/api');

	var theMem = '';

	function loopThroughElements() {

		jQuery('.CitObsO311Widget[data-type=SingleServiceQuestionnaire]').each(function() {

			var divid = jQuery( this ).attr('id');

			// defaults
			var opts = { 
				'testing': false, 'target': jQuery(this), 'widgetType': 'SingleServiceQuestionnaire', 'tagsA': [], 'addLayers': [], 
				'showName': true, 'showDescr': true, 'showMap': true, 'showObses': false, 'annotate': [ { 'id': 'muni', 'distance': 0 }, { 'id': 'drainage', 'distance': 0 } ] , 'showQuestionnaire': true, 'mapHeight': 300, 'obsesMaxAge': 10,
				'labelAttribute': '', 'colorAttribute': '', 'obsesColors': { 'type': '', 'attribute': '' }, 'obsesLabels': { 'type': '', 'attribute': '' }, 'pointRadius': 6, 'obsesCluster': 'false',
				'allowImages': 0
			};
			
			//get attributes
			if (!!jQuery(this).attr('data-service_code')) {
				
				var attrA = (this.attributes);

				if (typeof memo.firstTime == 'undefined') { memo.firstTime = true; } else { memo.firstTime = false; }

				var changed = false;
				if (memo.firstTime) { changed = true; } 

				for (var a in attrA) {

					var an = attrA[a].name;
					var av = attrA[a].value;

					if (an == 'data-changed') {

						changed = true;
						jQuery( this ).removeAttr('data-changed');

					} else if (!!av) {

						if (an == 'data-service_code') { opts.serviceCode = av; }
						else if (an == 'data-testing') { opts.testing = (av == 'true'); }
						else if (an == 'data-type') { opts.widgetType = av; }
						else if (an == 'data-api-key') { opts.apiKey = av; }
						else if (an == 'data-show-service_name') { opts.showName = (av == 'true' || av == '1'); }
						else if (an == 'data-show-service_description') { opts.showDescr = (av == 'true' || av == '1'); }
						else if (an == 'data-show-map') { opts.showMap = (av == 'true' || av == '1'); }
						else if (an == 'data-show-obses') { opts.showObses = (av == 'true' || av == '1'); }
						//else if (an == 'data-annotate-location') { opts.annotate = av.split(', ').join(',').split(','); }
						else if (an == 'data-show-questionnaire') { opts.showQuestionnaire = (av == 'true' || av == '1'); }
						else if (an == 'data-images-count') { opts.allowImages = parseInt(av); }
						else if (an == 'data-map-height') { opts.mapHeight = av; }
						else if (an == 'data-obses-cluster') { opts.obsesCluster = (av == 'true' || av == '1'); }
						else if (an == 'data-obses-radius') { opts.pointRadius = av; }
						else if (an == 'data-obses-max_age') { opts.obsesMaxAge = av; }
						else if (an == 'data-obses-label-attribute') { opts.labelAttribute = av; }
						else if (an == 'data-obses-color-attribute') { opts.colorAttribute = av; }
						else if (an == 'data-obses-color') {
							try { 
								opts.obsesColors = JSON.parse(av.split("'").join('"')); 
							} catch(err) {  console.log(err); }
						}
						else if (an == 'data-obses-label') {
							try { 
								opts.obsesLabels = JSON.parse(av.split("'").join('"')); 
							} catch(err) { console.log(err); }							
						}

						else if (an == 'data-observation_tags') { 
							if (!!av) { 
								
								opts.tagsA = av.split(',');
								if (opts.tagsA.length < 2) { opts.tagsA = av.split(' '); }
								for (var t in opts.tagsA) { opts.tagsA[t] = '#' + opts.tagsA[t].split(',').join('').split(' ').join('').split('#').join(''); }
							}

						} else if (an.indexOf('data-map-layer') == 0) {

							try { 
								opts.addLayers.push(JSON.parse(av.split("'").join('"')));
								opts.addLayers[opts.addLayers.length-1].query = opts.addLayers[opts.addLayers.length-1].query.replace('[', "'").replace(']', "'");
								opts.addLayers[opts.addLayers.length-1].id = an;
							} catch (err) { console.log(err); }
						} else if (an.indexOf('data-annotate-location') == 0) {
							try { 
								opts.annotate = JSON.parse(av.split("'").join('"'));								
							} catch (err) { console.log(err); }
						}
					}
				}

				for (var al in opts.annotate) {

					if (opts.annotate[al].id == 'muni') {
						opts.addLayers.push( { 'id': 'muni', 'type': 'arcgisrest', 'url': '//paikkatieto.ymparisto.fi/arcgis/rest/services/LAPIO/LAPIO_Hallrajat/MapServer/0/query', 'query': "KuntaNro LIKE '%'", 'name': 'Kunnat', 'maxResolution': 100, 'zoomTo': false, 'fillColor': 'rgba(0, 0, 0, 0)', 'strokeColor': 'rgba(0, 0, 0, 0.5)', 'strokeWidth': 3, 'annotateField': 'KuntaNimi', 'annotateTag': 'KuntaNimi', 'annotateDistance': opts.annotate[al].distance } );
					} else if (opts.annotate[al].id == 'drainage') {
				 		opts.addLayers.push( { 'id': 'drainage', 'type': 'arcgisrest', 'url': '//paikkatieto.ymparisto.fi/arcgis/rest/services/INSPIRE/SYKE_Hydrografia/MapServer/4/query', 'query': "Jako3Tunnus <> ''", 'name': 'Vesist�alue', 'maxResolution': 100, 'zoomTo': false, 'fillColor': 'rgba(0, 100, 100, 0.05)', 'strokeColor': 'rgba(0, 0, 200, 0.5)', 'strokeWidth': 3, 'annotateField': 'Nimi', 'annotateTag': 'Jako3Tunnus', 'annotateDistance': opts.annotate[al].distance } );
					} else if (opts.annotate[al].id == 'lake') {
						opts.addLayers.push( { 'id': 'lake', 'type': 'arcgisrest', 'url': '//paikkatieto.ymparisto.fi/arcgis/rest/services/SYKE/SYKE_Rantaviiva/MapServer/3/query', 'query': "JarviTunnus <> ''", 'name': 'J�rvet', 'maxResolution': 100, 'zoomTo': false, 'fillColor': 'rgba(0, 0, 200, 0.1)', 'strokeColor': 'rgba(0, 0, 200, 0.5)', 'strokeWidth': 'medium', 'annotateField': 'Nimi', 'annotateDistance': opts.annotate[al].distance } );
					} else if (opts.annotate[al].id == 'vpdcoast') {
						opts.addLayers.push( { 'id': 'vpdcoast', 'type': 'arcgisrest', 'url': '//paikkatieto.ymparisto.fi/arcgis/rest/services/INSPIRE/SYKE_AlueidenHallintaJaRajoitukset1/MapServer/3/query', 'query': "VPDTunnus <> ''", 'name': 'Merialueet', 'maxResolution': 100, 'zoomTo': false, 'fillColor': 'rgba(0, 0, 200, 0.1)', 'strokeColor': 'rgba(0, 0, 200, 0.5)', 'strokeWidth': 'medium', 'annotateField': 'Nimi', 'annotateDistance': opts.annotate[al].distance } );
					}
				}
	
 				//if ((opts.widgetType + opts.serviceCode + opts.apiKey + opts.showName + opts.showDescr + opts.showMap + opts.mapHeight) != theMem) {
			if (changed) {
					theMem = (opts.widgetType + opts.serviceCode + opts.apiKey + opts.showName + opts.showDescr + opts.showMap + opts.mapHeight);
	
					var container = jQuery( this );

					container.html('<div class="citobso311_header"></div><div class="citobso311_content"></div><div class="citobso311_footer"></div>');
					container.find('.citobso311_footer').html('CitObs Open311 Widget / SYKE');

					if (typeof memo.serviceO[opts.serviceCode] != 'undefined') {
	
						if (opts.showName) { container.find('.citobso311_header').append('<h3>' + memo.serviceO[opts.serviceCode].service_name + '</h3>'); }
						if (opts.showDescr) { container.find('.citobso311_header').append('<p>' + memo.serviceO[opts.serviceCode].description + '</p>'); }

						getServiceDefinition(container.find('.citobso311_content').first(), opts.serviceCode, opts);
	
					} else {

						if (opts.showName) { container.find('.citobso311_header').append('<h3>Service unavailable</h3>'); }
						if (opts.showDescr) { container.find('.citobso311_header').append('<p>Error in service_code: ' + opts.serviceCode + '</p>'); }

						container.find('.citobso311_content').first().html('<p>The service code in this widget does not match any public service codes in CitObs Open311 API. Please ask the administrator of this web page to handle this issue.');
	
					}
				}
			}
		});
	}

	function getServiceDefinition(target, code, opts) {

		var map;
		memo.requiredA = [];
		memo.optionalA = [];
		memo.geolocatedOnce = false;

		//console.log(opts);

		api = proto + '//rajapinnat.ymparisto.fi/api/kansalaishavainnot/1.0'; //'//api.kansalaishavainnot.fi/citobsdb/open311/v2';
		if (opts.testing) { api = proto + '//testbed.ymparisto.fi/Open311/api'; }

		jQuery.ajax({

			type: 'GET',
			url: api + '/services/' + code + '.json?extension=true',
			dataType: 'json',
			cache: false,
			success: function(req) {

				//memo.coo311services[code].name = 

				var output = '<div class="citobso311_container" id="citobso311_container_' + code + '"><form id="citobso311_form">';

				if (opts.showMap) {
					output += '<div id="citobso311_input_' + code + '_map" class="citobso311_input_container citobso311_input_required citobso311_input_map " >';
					output += '<div style="position: relative; height: ' + opts.mapHeight + 'px;">';
					output += '<div style="opacity: 0; position: absolute; width: 10px; height: 10px; overflow: hidden; top: ' + (opts.mapHeight/2 - 15) + 'px;"><input style="width: 50px;" id="citobso311_input_' + code + '_lon" required ><input style="width: 50px;" id="citobso311_input_' + code + '_lat" ></div>';
					output += '<div style="height: 100%; width: 100%;" class="citobso311_map_container" id="citobso311_map_' + code + '"></div>';
					output += '</div>';
					output += '</div>';
				}

				if (opts.showQuestionnaire) {

					output += '<div class="citobso311_questionnaire_container">';
					
					if (opts.allowImages > 0) {
					
						idi = 'citobso311_input_' + code + '_img';
						var imgOut = '';
												
						imgOut += '<div id="citobso311_input_container_' + idi + '" class="citobso311_input_container">';
						imgOut += '<div class="sizer" style="width: 100%; border: 0; padding: 0; margin: 0;">';
						
						imgOut += '<a style="" class="tooltip coo311_popupbutton coo311_info" role="button" title="T&auml;ss&auml; kyselyss&auml; voit liitt&auml;&auml; vastaukseesi enint&auml;&auml;n ' + opts.allowImages.toString() + ' valokuvaa. Avaa tiedostovalitsin tai laitteen kamera alla olevalla kuvakkeella. Voit my&ouml;s raahata kuvatiedostot alueen p&auml;&auml;lle. Tuetut tiedostomuodot ovat JPEG, PNG ja GIF.">?</a>';
						
						imgOut += '<h4 class="coo311">Lis&auml;&auml; valokuva</h4>';
						
						imgOut += '<div class="imgUploader2 imgPreview imgButton plupNoImages" id="imgUploader2"><div style="clear: both;"></div></div>';
						imgOut += '<a style="width: 0; height: 0; overflow: hidden;" href="#" name="imgButton" id="imgButton"></a>';
						imgOut += '<p class="coo311" style="text-align: center; font-size: 80%; margin-top: 5px;">Huomaa, ett&auml; luovut l&auml;hett&aumlmiesi kuvien oikeuksista CC0-lisenssin mukaisesti!</p>';

						imgOut += '</div></div>';
						
						output += imgOut;
									
					}

					req.attributesA = [];
					for (var a in req.attributes) { req.attributesA.push( req.attributes[a] ); }					
					req.attributesA.sort( function ( a, b ) { return (a.order-b.order); } );

					for (var a in req.attributesA) {

						var attr = req.attributesA[a];
						var id = 'citobso311_input_' + code + '_' + attr.code;
						var valjQ = '';

						var valueHelps = '';

						if (attr.variable || attr.description != '') {

							var reqStr = '';
							output += '<div id="citobso311_input_container_' + id + '" class="citobso311_input_container';
							if (req.attributesA[a].required) { reqStr = 'required'; output += ' citobso311_input_required'; }
							if ((attr.datatype == 'info' || !attr.variable) && attr.description != '') { output += ' citobso311_input_info'; }
							output += '"><div class="sizer" style="width: 100%; border: 0; padding: 0; margin: 0;">';

							if (!!attr.datatype_description || !!attr.attribute_alert) {

								if (!!attr.datatype_description) {
									output += '<a style="" class="tooltip coo311_popupbutton coo311_info" role="button" title="' + attr.datatype_description + '">?</a>';
								}

								if (!!attr.attribute_alert) {
									output += '<a style="" class="tooltip coo311_popupbutton coo311_alert" role="button" title="' + attr.attribute_alert + '">!</a>';				
								}
							}

							if (attr.datatype != 'info' && attr.description != '') {

								output += '<h4 class="coo311">';
								if ( attr.datatype == 'number' && !!attr.datatype_definition.unit ) {
									output += '<label for="' + id + '" style="display: inline;">' + attr.description + ' (' + attr.datatype_definition.unit + ')</label>';
								} else {
									output += '<label for="' + id + '" style="display: inline;">' + attr.description + '</label>';
								}
								output += '</h4>';
								output += '<div style="clear: both;"></div>';

							}

							if (attr.datatype == 'string') {

								output += '<input type="text" id="' + id + '" class="ui-widget ui-widget-content ui-corner-all" ' + reqStr + '>';
								valjQ = '#' + id;

							} else if (attr.datatype == 'number') {

								if ( !!attr.datatype_definition.step ) { step = attr.datatype_definition.step.toString(); } else { step = ''; }
								if ( !!attr.datatype_definition.minvalue ) { min = attr.datatype_definition.minvalue.toString(); } else { min = ''; }
								if ( !!attr.datatype_definition.maxvalue ) { max = attr.datatype_definition.maxvalue.toString(); } else { max = ''; }
								//if ( !!attr.datatype_definition.unit ) { unit = attr.datatype_definition.unit; } else { unit = ''; }

								output += '<input type="number" min="' + min + '" max="' + max + '" step="' + step + '" id="' + id + '" class="ui-widget ui-widget-content ui-corner-all" ' + reqStr + '>';
								valjQ = '#' + id;

							} else if (attr.datatype == 'datetime') {

								var now = new Date();
								var nowStr = now.getFullYear() + '-' + ( '0' + (now.getMonth()+1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + 'T' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);

								output += '<input type="datetime-local" id="' + id + '" class="ui-widget ui-widget-content ui-corner-all" ' + reqStr + ' value="' + nowStr + '">';
								//output += '<input type="time" id="' + id + '" class="ui-widget ui-widget-content ui-corner-all">';
								valjQ = '#' + id;

							} else if (attr.datatype == 'text') {

								output += '<textarea style="height: 75px;" id="' + id + '" class="ui-widget ui-widget-content ui-corner-all" ' + reqStr + '></textarea>';
								valjQ = '#' + id;

							} else if (attr.datatype == 'singlevaluelist') {

								for (var v in attr.values) {
									output += '<label><input type="radio" name="' + id + '" id="' + id + '_' + attr.values[v].key + '" value="' + attr.values[v].key + '" ' + reqStr + '> ' + attr.values[v].name + '</label>';
									if (attr.values[v].value_description != null) {
										valueHelps += '<div style="display: none;" class="citobso311_helptext citobso311_hideOn_' + id + ' citobso311_showOn_' + id + '_' + attr.values[v].key + '">';
										valueHelps += '<p class="coo311">' + attr.values[v].name + ' &ndash; ' + attr.values[v].value_description + '</p>';
										if (attr.values[v].value_alert != null) {
											valueHelps += '<p class="coo311 alert">' + attr.values[v].value_alert + '</p>';									
										}
										valueHelps += '</div>';
									}
								}
								//output += valueHelps;
								valjQ = 'input[name="' + id + '"]:checked';

							} else if (attr.datatype == 'multivaluelist') {

								for (var v in attr.values) {
									output += '<label><input type="checkbox" name="' + id + '" id="' + id + '_' + attr.values[v].key + '" value="' + attr.values[v].key + '"> ' + attr.values[v].name + '</label>';
									if (attr.values[v].value_description != null) {
										valueHelps += '<div style="display: none;" class="citobso311_helptext citobso311_hideOn_' + id + '_' + attr.values[v].key + ' citobso311_showOn_' + id + '_' + attr.values[v].key + '">';
										valueHelps += '<p class="coo311">' + attr.values[v].name + ' &ndash; ' + attr.values[v].value_description + '</p>';
										if (attr.values[v].value_alert != null) {
											valueHelps += '<p class="coo311 alert">' + attr.values[v].value_alert + '</p>';									
										}
										valueHelps += '</div>';
									}
								}
								valjQ = 'input[name="' + id + '"]:checked';

							} else if ((attr.datatype == 'info' || !attr.variable) && attr.description != '') {

								output += '<p class="coo311" id="' + id + '">' + attr.description + '</p>';

							}

							output += valueHelps;

							output += '</div></div>';

							if (req.attributesA[a].required && attr.datatype != 'info') {
								memo.requiredA.push({ 'code': attr.code, 'datatype': attr.datatype, 'container': jQuery('#citobso311_input_container_' + id), 'input': valjQ });
							} else if (attr.datatype != 'info') {
								memo.optionalA.push({ 'code': attr.code, 'datatype': attr.datatype, 'container': jQuery('#citobso311_input_container_' + id), 'input': valjQ });
							}


						} else {

						}

					}
					
					//memo.coo311services = { code: reg };

					output += '<div class="citobso311_questionnaire_sendingError"></div>';

					//output += '<input id="citobso311_submit_' + id + '" type="submit">';
					output += '<div class="slide-submit"><div class="slide-submit-text">Lähetä pyyhkäisemällä</div><div class="slide-submit-thumb">»</div></div>';

				}

				output += '</form></div>';
				target.append(output);

				setTimeout(function() {

					//console.log(jQuery.fn);

					if (typeof jQuery.fn.checkboxradio != 'undefined') {
						target.find( '.citobso311_questionnaire_container input[type="checkbox"]' ).checkboxradio({icon: false});
						target.find( '.citobso311_questionnaire_container input[type="radio"]' ).checkboxradio({icon: false});
					}

					if (typeof jQuery.fn.button != 'undefined') {
						//target.find( '.citobso311_questionnaire_container input[type="submit"]' ).button();
						//target.find( '.citobso311_questionnaire_container input[type="submit"]' ).button('disable');
					}   

					target.find( '.citobso311_questionnaire_container input[type="text"]' ).css('padding', '5px');
					target.find( '.citobso311_questionnaire_container input[type="number"]' ).css('padding', '5px');
					target.find( '.citobso311_questionnaire_container input[type="date"]' ).css('padding', '5px');
					target.find( '.citobso311_questionnaire_container textarea' ).css('padding', '5px');

					if (typeof jQuery.fn.datepicker != 'undefined') {
						//console.log('datepicker');
						//jQuery( '.citobso311_questionnaire_container input[type="datetime-local"]' ).datepicker( 'fi' );
						//jQuery( '.citobso311_questionnaire_container input[type="datetime-local"]' ).datepicker( "option", "dateFormat", "yy-mm-dd hh:m");
					}

					jQuery('.citobso311_questionnaire_container .slide-submit').slideToSubmit({
						errorText: 'Tarkista pakolliset kentät!', // Shown if fields are invalid & browser doesn't have built-in tooltips
						successText: 'Lähetetään...', // Shown before submitting
						submitDelay: 500, // Delay for showing successText
						graceZone: 100 // Pixels from the right that is accepted as a full side
					});

					jQuery('.tooltip').tooltipster( { 
						theme: 'tooltipster-light', 
						maxWidth: 400,
						side: 'left',
						trigger: 'click',
						interactive: true
					} );
					
					
					var maxImages = 6;

					jQuery( document ).on({
    						dragover: function() {
    						    return false;
    						},
    						drop: function() {
    						    return false;
    						}
					});					
					
					jQuery( document ).on( 'dragover', '.imgUploader2', function(e) {
						
					        e.preventDefault(); e.stopPropagation();
					        
					        jQuery( this ).addClass('plupDragOver');
					});
						
					jQuery( document).on( 'dragenter', '.imgUploader2', function(e) {
						
					        e.preventDefault(); e.stopPropagation();

					});
						
					jQuery( document).on( 'dragleave', '.imgUploader2', function(e) {						
							
					        e.preventDefault(); e.stopPropagation();

					        jQuery( this ).removeClass('plupDragOver');
					});						
						
					jQuery( document ).on( 'drop', '.imgUploader2', function(e) {
					
						if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
						
					        	e.preventDefault(); e.stopPropagation();
					        	
					            	for (var fi=0; fi<e.originalEvent.dataTransfer.files.length; fi++) {						            		     
								if (e.originalEvent.dataTransfer.files[fi].type.indexOf('image/') == 0) {
									imgUploader.addFile(e.originalEvent.dataTransfer.files[fi]);
								}
					            	}
					            	
					            	 jQuery( this ).removeClass('plupDragOver');
					        }
					});

					jQuery( document ).on( 'click', '.imgButton', function(e) {
									
						if ( e.target == e.currentTarget ) { 

							jQuery('div.moxie-shim input[type=file]').trigger('click');
						}
					});					
					
					jQuery( document ).on( 'click', '.imgDeleter', function(e) {
					            	
						imgUploader.removeFile(jQuery(this).attr('data-plup-id'));
					});
					
					imgUploader = new plupload.Uploader({
						runtimes : 'html5,flash,silverlight,html4',
						browse_button : 'imgButton',
						//container: 'imgPreview', 
						url : '//www.jarviwiki.fi/common/citobsembed_upload.php',
						flash_swf_url : '//www.jarviwiki.fi/scripts/plupload-2/Moxie.swf',
						silverlight_xap_url : '//www.jarviwiki.fi/scripts/plupload-2/Moxie.xap',
						unique_names: true,
						//opts.allowImages,
						filters : {
							prevent_duplicates : true,
							max_file_size : '8mb',
							//mime_types : 'image/*'
							mime_types: [
								{ title : "Image files", extensions : "jpg,jpeg,gif,png" }
							]
						},
						resize: {
							width: 1440, 
							height: 1440, 
							crop: false, 
							quality: 80 
						},
						multipart_params: {
							observationtime: ''
						},

						init: {
						
							QueueChanged: function(up) {
							
								if ( up.files.length > opts.allowImages ) {
									up.splice(opts.allowImages);									
								}
							
							},
						
							FilesAdded: function(up, files) {						
								
								plupload.each(files, function(file) {
								
									deleted = true;
									for (var c in up.files) { if (file.id == up.files[c].id) { deleted = false; break; } }
									
									if (!deleted) {
								
								   		var imgContainer = jQuery('<div class="plupImgContainer" data-plup-id="' + file.id + '" style="float: left; position: relative; background-color: #fff; text-align: center; border-radius: 5px;"></div>').prependTo('.imgPreview');
										var img = jQuery( new Image() ).appendTo(imgContainer);						
						
										var preloader = new moxie.image.Image();
						
										preloader.onload = function() {
											//preloader.downsize(240, 240);
											img.prop( 'src', preloader.getAsDataURL() );
											img.css( 'position', 'relative' );
											img.css( 'max-width', '120px' );
											img.css( 'max-height', '120px' );
											img.css( 'top', '50%' );
											img.css( 'margin-top', (img.prop('height')/2*-1).toString() + 'px' );
										
											imgDeleter = jQuery('<div class="imgDeleter" data-plup-id="' + file.id + '" style="position: absolute; top: 5px; right: 5px; width: 16px; height: 16px; font-size: 16px; line-height: 14px; text-align: center; border-radius: 50%; background-color: #333; color: #fff;">&ndash;</div>').appendTo(img.parent());
										}
										preloader.load( file.getSource() );
									}							
								});
								
								jQuery( '.imgUploader2' ).removeClass('plupNoImages');
							
							},
							
							FilesRemoved: function(up, files) {
							
								plupload.each(files, function(file) {
								
									jQuery( '.plupImgContainer[data-plup-id="' + file.id + '"]').remove();
									
								});
								
								if (imgUploader.files.length == 0) {
									jQuery( '.imgUploader2' ).addClass('plupNoImages');
								}
							
							},
							
							BeforeUpload: function(up, file) {
							
								up.settings.multipart_params['observationtime'] = postdata['attribute[observationtime]'];
							
							},
		
							UploadProgress: function(up, file) {

								var p = file.percent;
								
								target.find( '.slide-submit-text' ).html( 'L&auml;hetet&auml;&auml;n... (valokuvat ' + p + ' %)');

							},

							fileUploaded: function(up, file, response) {

								var res = jQuery.parseJSON(response.response);
								
								if (res.result == 'fileUploaded') {
									filesA.push(res.fileUrl);
								}
				
							},
							
							UploadComplete: function(up, file) {

								postdata.media_url = filesA.join(', ');
								
								target.find( '.slide-submit-text' ).html( 'L&auml;hetet&auml;&auml;n...');
								
								sendObservation(target);
							
							},

							Error: function(up, err) {
		
								//console.log(err);
	
							}
						}
					});
					
					imgUploader.init();

				}, 50);
				
				if (opts.showMap) { // Make map

					var addLayers = [];
					memo.annotateLrs = [];

					for (var l in opts.addLayers) {
						if (opts.addLayers[l].type == 'arcgisrest') {
							add = {
								'id': opts.addLayers[l].id,
								'type': 'anyrest',
								'restUrl': opts.addLayers[l].url,
								'search': opts.addLayers[l].query,
								'popupFields': '',
								'outFields': [],
								'labelField': 'KuntaNimi',
								'fillColor': opts.addLayers[l].fillColor,
								'strokeWidth': opts.addLayers[l].strokeWidth,
								'strokeColor': opts.addLayers[l].strokeColor,
								'name': opts.addLayers[l].name, 
								//'attribution': '<a href="//wwwp2.ymparisto.fi/kayttoehdot.html">Ymp�rist�hallinnon paikkatietoaineistot</a>',
								'opacitySlider': true,
								'showLabels': false,
								'selectable': false,
								'zoomToExtent': false,
								'maxResolution': 50,
								'annotateField': opts.addLayers[l].annotateField,
								'annotateTag': opts.addLayers[l].annotateTag,
								'annotateDistance': parseFloat(opts.addLayers[l].annotateDistance),
								'bboxStrategy': true,
								'bbox': true,
								'displayInLayerSwitcher': false
							};
							
							addLayers.push(add);
							if (opts.addLayers[l].annotateField != '') { 
								memo.annotateLrs.push(addLayers[addLayers.length-1]); 
							//	addLayers[addLayers.length-1].outFields.push(opts.addLayers[l].annotateField);
							}
							addLayers[addLayers.length-1].popupFields = addLayers[addLayers.length-1].outFields.join(',');
						}
					}
				
					if (opts.showObses) {
						addLayers.push({ 
							'id': 'prevobses', 
							'type': 'coo311', 
							'testing': opts.testing,
							'service_code': code,
							'service_name': memo.serviceO[code].service_name,
							'days': opts.obsesMaxAge, 
							'obsesLabels': opts.obsesLabels,
							'obsesColors': opts.obsesColors,
							'pointRadius': opts.pointRadius,
							'name': 'Aiemmat havainnot', 
							'zoomToExtent': false, 
							'clustered': opts.obsesCluster,
							'selectable': true 
						});
					}

					addLayers.push({ 'id': 'geoloc', 'type': 'geoloc', 'name': 'Sijaintisi', 'show': true, 'center': true, 'zoom': 15, 'track': false });

					// do the base map with these settings
					map = ol3_jwMakeMap({ 
						'container': 'citobso311_map_' + code, 
						'base': 'mmlTausta', 
						'lon':  25.5, 
						'lat': 65, 
						'zoom': 5, 
						'layers': addLayers,
						'memo': memo
					});

					memo.geocoderCtrl = new Geocoder('nominatim', {
						provider: 'osm', //'photon', //'osm', //'mapquest',
						//key: '__some_key__',
						lang: 'fi-FI', //en-US, fr-FR
						placeholder: 'Kirjoita osoite ...',
						targetType: 'glass-button', //'text-input',
						//featureStyle: iconStyle,  
						limit: 5,
						countrycodes: 'fi', 
						autoComplete: true,
						autoCompleteMinLength: 2,
						keepOpen: false,
						preventDefault: true 
					});
					map.addControl(memo.geocoderCtrl);

					memo.geocoderCtrl.on('addresschosen', function(evt){

						//var feature = evt.feature,
						coord = evt.coordinate,
						address = evt.address,
						city = evt.address.details.city;
						if (typeof city == 'undefined') { city = evt.address.details.name; }
						
						map.setView(new ol.View({ center: coord, zoom: 16 }));
					});

					//
					map.getInteractions().forEach(function(interaction) {
  						if (interaction instanceof ol.interaction.DragPan) {
    							memo.dragPan = interaction;
  						}
  						if (interaction instanceof ol.interaction.KeyboardPan) {
    							memo.keyboardPan = interaction;
  						}  						
					}, this);				
							
					memo.lockmeCtrl = new ol.control.Toggle({
						html: '', //<i class="fa fa-hand-pointer-o"></i>',
						className: 'ol-locker',
						title: 'Sijainnin lukitus',
						active: false,
						onToggle: function(active) {
							if (active) {
								memo.mapMovedByHand = true;
								memo.dragPan.setActive(false);
								memo.keyboardPan.setActive(false);
								map.removeControl(memo.geocoderCtrl);
								if (map.getView().getResolution() < zoomMoreResolution) {
									jQuery( '.jwMapInfoText' ).html( 'Lukittu:&nbsp;' );
								} else {
									jQuery('#jwMapInfoContainer').html('<div class="jwMapInfoText">Zoomaa l&auml;hemm&auml;s ja siirr&auml; karttaa niin, ett&auml; risti osoittaa tarkoittamaasi paikkaan</div>');
								}
							} else {
								memo.mapMovedByHand = true;
								memo.dragPan.setActive(true);
								memo.keyboardPan.setActive(false);
								map.addControl(memo.geocoderCtrl);
								if (map.getView().getResolution() < zoomMoreResolution) {
									jQuery( '.jwMapInfoText' ).html( 'Valittu:&nbsp;' );
								} else {
									jQuery('#jwMapInfoContainer').html('<div class="jwMapInfoText">Zoomaa l&auml;hemm&auml;s ja siirr&auml; karttaa niin, ett&auml; risti osoittaa tarkoittamaasi paikkaan</div>');
								}
							}
						}
					});					

					if (opts.showQuestionnaire) {
						targetCtrl = new ol.control.Target();
						map.addControl(targetCtrl);					
						
						map.addControl(memo.lockmeCtrl);

						var infoBar = new ol.control.Bar( { className: 'ol-info' } );
						var fieldEl = document.createElement('div');
						fieldEl.id = 'jwMapInfoContainer'
						var fieldCtrl = new ol.control.Control({ element: fieldEl });
						infoBar.addControl(fieldCtrl);
						map.addControl(infoBar);
						infoBar.setPosition('bottom-left');
						jQuery('#jwMapInfoContainer').html('<div class="jwMapInfoText">Zoomaa l&auml;hemm&auml;s ja siirr&auml; karttaa niin, ett&auml; risti osoittaa tarkoittamaasi paikkaan</div>');
					}
					
				}

				function doAnnotating() {

					if (opts.showQuestionnaire) {

					var resolution = (map.getView().getResolution());
	
					if (resolution < zoomMoreResolution) {
					
						memo.annotateTags = [];				
						memo.lockmeCtrl.setDisable(false);
					
						var coord = map.getView().getCenter();
						var lonlat = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
						var lon = Math.round(lonlat[0]*10000)/10000;
						var lat = Math.round(lonlat[1]*10000)/10000;
						memo.chosenCoords = lonlat;
						jQuery('#citobso311_input_' + code + '_lon').val(lonlat[0]);
						jQuery('#citobso311_input_' + code + '_lat').val(lonlat[1]);

						var muni;

						if (memo.lockmeCtrl.getActive()) {
							output = '<div class="jwMapInfoText">Lukittu:&nbsp;</div>';
						} else {
							output = '<div class="jwMapInfoText">Valittu:&nbsp;</div>';
						}
						output += '<div class="jwMapInfoTag">' + lat + '&deg;, ' + lon + '&deg;</div>';						

						for (var l in memo.annotateLrs) {

							var tolerance = memo.annotateLrs[l].annotateDistance * 1/resolution;

							map.forEachFeatureAtPixel(map.getPixelFromCoordinate(coord), 

								function(feature, layer) {

									tag = feature.get(memo.annotateLrs[l].annotateField);
									output += '<div class="jwMapInfoTag">' + tag + '</div>';

									memo.annotateTags.push('#_' + memo.annotateLrs[l].annotateTag + '_' + feature.get(memo.annotateLrs[l].annotateTag));

								}, { layerFilter: function(layer) { return layer === memo.annotateLrs[l].layer; }, hitTolerance: tolerance }
							);
						}

						jQuery('#jwMapInfoContainer').html( output );				

					} else {

						if (!memo.lockmeCtrl.getActive()) {
						
							memo.annotateTags = [];
							memo.chosenCoords = null;
						
							jQuery('#citobso311_input_' + code + '_lon').val('');
							jQuery('#citobso311_input_' + code + '_lat').val('');					
						
							jQuery('#jwMapInfoContainer').html('<div class="jwMapInfoText">Zoomaa l&auml;hemm&auml;s ja siirr&auml; karttaa niin, ett&auml; risti osoittaa tarkoittamaasi paikkaan</div>');
							
							memo.lockmeCtrl.setDisable(true);
						}

					}

					}
				}

				jQuery( document ).on( 'citobso311_allLoadingDoneForNow', function() {

					doAnnotating();		

				});


				map.on( 'moveend', function(e) {

					doAnnotating();					

				});

				target.on('click touchend', 'input[type="radio"], input[type="checkbox"]', function(e) {

					var input = jQuery( this );
					var prevChecked = input.prop('data-checked');

						//console.log(input.prop('id'));

					jQuery('.citobso311_hideOn_' + input.prop('name')).hide();
					jQuery('.citobso311_hideOn_' + input.prop('id')).hide();
					jQuery('.citobso311_showHideOn_' + input.prop('name')).show();

					if (typeof prevChecked == 'undefined') {
						prevChecked = 'false';
					}

					jQuery('input[type="radio"]').prop('data-checked', 'false');

					if (prevChecked == 'true') {
						input.prop( "checked", false ).checkboxradio("refresh");
						input.prop('data-checked', 'false');				
						input.trigger('change');
						if (jQuery('.ui-checkboxradio-checked input[name="' + input.prop('name') + '"]').length > 0) {
							jQuery('.citobso311_showHideOn_' + input.prop('name')).hide();
						}
					} else {
						input.prop('data-checked', 'true');
						jQuery('.citobso311_showHideOn_' + input.prop('name')).hide();
						jQuery('.citobso311_showOn_' + input.prop('id')).show();
					}

					//console.log(jQuery('input[type="radio"]')


				});
						

				jQuery('#citobso311_form').on('citobso311_submitQuestionnaire', function() {

					target.find('.citobso311_questionnaire_sendingError').html('');

					var today = new Date();

					postdata = {
						'service_code': code,
						'api_key': opts.apiKey,
						'description': 'This observation was saved on ' + today.toISOString() + ' using the SYKE CitObs Open311 Widget. #_citobswidget'
					};
					
					postdataA = [
						{ 'name': 'service_code', 'value': code },
						{ 'name': 'api_key', 'value': opts.apiKey },
						{ 'name': 'description', 'value': 'This observation was saved on ' + today.toISOString() + ' using the SYKE CitObs Open311 Widget. #_citobswidget ' + opts.tagsA.join(' ') }
					];					
					
					if (opts.tagsA.length > 0) { postdata.description += ' ' + opts.tagsA.join(' '); }

					if (opts.showMap) {

						var selCoords = ol.proj.transform(map.getView().getCenter(), map.getView().getProjection(), 'EPSG:4326');
						postdata.lat = selCoords[1];
						postdata.long = selCoords[0];
						postdata.description += ' ';
						postdata.description += memo.annotateTags.join(' ');
												
						postdataA[2]['value'] += ' ' + memo.annotateTags.join(' ');
						postdataA.push( { 'name': 'lat', 'value': selCoords[1] } );
						postdataA.push( { 'name': 'long', 'value': selCoords[0] } );
					}

					for (var a in memo.requiredA) {

						valStr = '';
						valNum = 0;

						if (memo.requiredA[a].datatype == "multivaluelist") {
							var listArr = [];
							jQuery(memo.requiredA[a].input).each(function() {
								listArr.push(jQuery( this ).val());
								postdataA.push( { 'name': 'attribute[' + memo.requiredA[a].code + ']', 'value': jQuery( this ).val() } );
								valNum += parseInt(jQuery( this ).val());
							});
							//valStr = listArr.join(',');
							valStr = valNum.toString();
						} else {
							valStr = jQuery(memo.requiredA[a].input).val();							
							postdataA.push( { 'name': 'attribute[' + memo.requiredA[a].code + ']', 'value': jQuery(memo.requiredA[a].input).val() } );
						}
						postdata['attribute[' + memo.requiredA[a].code + ']'] = jQuery(memo.requiredA[a].input).val();

						//console.log( memo.requiredA[a].code ); console.log( valStr );

					}

					for (var a in memo.optionalA) {

						valStr = '';
						valNum = 0;

						if (memo.optionalA[a].datatype == "multivaluelist") {
							var listArr = [];
							jQuery(memo.optionalA[a].input).each(function() {
								listArr.push(jQuery( this ).val());
								postdataA.push( { 'name': 'attribute[' + memo.optionalA[a].code + ']', 'value': jQuery( this ).val() } );
								valNum += parseInt(jQuery( this ).val());
							});
							//valStr = listArr.join(',');
							//console.log(valNum);
							valStr = valNum.toString();
							//console.log(valStr);
						} else {
							valStr = jQuery(memo.optionalA[a].input).val();
							postdataA.push( { 'name': 'attribute[' + memo.optionalA[a].code + ']', 'value': jQuery(memo.optionalA[a].input).val() } );
						}
						if (valStr != '') {
							postdata['attribute[' + memo.optionalA[a].code + ']'] = valStr;
						}

						//console.log( memo.optionalA[a].code ); console.log( valStr );
					}
					
					if (imgUploader.files.length > 0) {
					
						imgUploader.start();
						
					} else {
					
						sendObservation(target);					
					}
					
				});

				function doResize() {

					setTimeout( function() { 
						var width = jQuery('#citobso311_container_' + code + ' .sizer').first().width();
						target.find( 'input' ).outerWidth(width);
						target.find( 'textarea' ).outerWidth(width);
						//jQuery( '.citobso311_input_required label' ).width(width);
					 }, 550);
				}

				doResize();

				target.on('change', 'input, textarea', function(e) {

					req = true;

					for (var f in memo.requiredA) {

						jQuery(memo.requiredA[f].container.selector).removeClass('citobso311_input_missing');

						var val = jQuery(memo.requiredA[f].input).val();

						if (typeof val != 'undefined') {

							if (val == '') {

								jQuery(memo.requiredA[f].container.selector).addClass('citobso311_input_missing');
								req = false;
							}

						} else {

								jQuery(memo.requiredA[f].container.selector).addClass('citobso311_input_missing');
								req = false;

						}

						jQuery(memo.requiredA[f].input).each(function() {

							//console.log( jQuery( this ).val() );

						});


					}

				});

				jQuery( window ).on('resize', function() {
					doResize();
				});



			},
			error: function(err) {

				jQuery(this).html('Kyselyn lataaminen CitObs-tietojärjestelmästä ei onnistunut. Ole hyvä, ja kokeile myöhemmin uudelleen.');

			}

		});

	}

	function sendObservation(target) {					

		console.log( JSON.stringify( postdata ) );
		//console.log(jQuery.param(postdataA));

		jQuery.ajax({
			type: 'POST',
			url: api + '/requests.xml',
			data: postdata,
			success: function(req) {

				target.find('.citobso311_questionnaire_container').html('');
				target.find('.citobso311_questionnaire_container').append('<h3>Kiitos havainnostasi!</h3>');
				target.find('.citobso311_questionnaire_container').append('<p>Se on tallennettu CitObs-kansalaishavaintoj&auml;rjestelm&auml;&auml;n hy&ouml;dytt&auml;m&auml;&auml;n muun muassa tutkimusta.</p>');
				target.find('.citobso311_questionnaire_container').append('<p></p>');
				target.find('.citobso311_questionnaire_container').append('<button class="ui-button ui-widget ui-corner-all" id="citobso311_another_observation">Tallenna toinen havainto</button>');

			},
			error: function(err) {

				console.log(err);

				target.find('.citobso311_questionnaire_sendingError').html('<div class="citobso311_input_container citobso311_input_missing"></div>');
				target.find('.citobso311_questionnaire_sendingError div').append('<h4 class="coo311" style="margin-top: 0px;">Havaintoa ei voitu tallentaa!</h4>');				
				target.find('.citobso311_questionnaire_sendingError div').append('<p>Havaintoa tallennettaessa tapahtui virhe: "' + err.responseText + '".</p>');
				target.find('.citobso311_questionnaire_sendingError div').append('<p>Voit yritt&auml;&auml; l&auml;hett&auml;&auml; havaintoa uudestaan. Jos ongelma jatkuu, ole yhteydess&auml; t&auml;m&auml;n sivun yll&auml;pitoon.</p>');
				target.find('.citobso311_questionnaire_sendingError div').append('<p></p>');

				target.find('.slide-submit-thumb').animate({ 'left': '0' }, 150 );
				target.find('.slide-submit-text').html('L&auml;het&auml; pyyhk&auml;isem&auml;ll&auml;');
				target.find('.slide-submit').removeClass('slide-success');

			},
			dataType: 'xml'
		});

	}


	jQuery( document ).on( 'click', '#citobso311_another_observation', function(e) {

		allLoaded();
		e.preventDefault();

	});


    }; // scriptsLoaded
	  


    } // main()

})(); // We call our anonymous function immediately