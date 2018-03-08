(function(){

	"use strict"

	var app = {
		init: function(){
			getPosters.init()
			map.init()
			//eventHandlers or global app stuff
		}
	}

	var getPosters = {
		init: function(){
			this.request();
		},
		request: function() {
			var sparqlquery = `
			PREFIX dc: <http://purl.org/dc/elements/1.1/>
			PREFIX test: <http://purl.org/dc/terms/>
			PREFIX date: <http://semanticweb.cs.vu.nl/2009/11/sem/>
			PREFIX foaf: <http://xmlns.com/foaf/0.1/>
			PREFIX wdt: <http://www.wikidata.org/prop/direct/>
			PREFIX wd: <http://www.wikidata.org/entity/>
			PREFIX owl: <http://www.w3.org/2002/07/owl#>
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
			SELECT ?x ?img ?title ?subject ?locationLabel ?spatial ?hasBeginTimeStamp WHERE {
			  SERVICE <https://query.wikidata.org/sparql>
			  {
			    OPTIONAL { ?wiki wdt:P276 ?location . }
			    ?location wdt:P131 wd:Q9899 .
			    ?location rdfs:label ?locationLabel .
			    FILTER (langMatches( lang(?locationLabel), "NL" ) )
			  }
			     ?x dc:type "Poster."^^xsd:string .
			     ?x dc:title ?title .
			     ?x dc:subject ?subject .
			     ?x test:spatial ?spatial .
			     ?spatial owl:sameAs ?wiki .
			     OPTIONAL{?x date:hasBeginTimeStamp ?hasBeginTimeStamp .}
			     ?x foaf:depiction ?img .
			}
			ORDER BY ?location
			`;

			var encodedquery = encodeURIComponent(sparqlquery);
			var queryurl = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

			fetch(queryurl)
			.then((resp) => resp.json()) // transform the data into json
				.then(function(data) {

				var rows = data.results.bindings; // get the results
				console.log(rows)
				filter.init(rows)

			}).catch(function(error) {
				// if there is any error you will catch them here
				console.log(error);
			});

		}
	}

	var map = {
		init: function() {
			this.create();
		},
		create: function() {
			var mymap = L.map('mapid').setView([52.3667, 4.9000], 11);

			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
					maxZoom: 18,
					id: 'mapbox.light',
					accessToken: 'pk.eyJ1Ijoic3V1c3RlbnZvb3JkZSIsImEiOiJjamVmc3Q3MDQxbGJ0MzNrdHE4Y3QwMW82In0.AWAlzy0cXMbrfR8Ed-7DOg'
			}).addTo(mymap);

			mymap.scrollWheelZoom.disable();

			// loading GeoJSON file - Here my html and usa_adm.geojson file resides in same folder
				$.getJSON("amsterdam-stadsdelen.geoJSON", function (stadsdelen) {

					var allStadsdelenJSONArray = [];

					for (var i = 0; i < stadsdelen.features.length; ++i) {
						var stadsdelenJSON = stadsdelen.features[i].properties.titel;
						allStadsdelenJSONArray.push(stadsdelenJSON);
					}
					map.allStadsdelenJSON = allStadsdelenJSONArray

					template.renderAside();

					function onEachFeature(feature, layer) {
				    // does this feature have a property named popupContent?
				    if (feature.properties && feature.properties.titel) {
				        layer.bindPopup(feature.properties.titel);
				    }
					}

					L.geoJSON(stadsdelen, {onEachFeature: onEachFeature}).addTo(mymap);

			})
		},
		allStadsdelenJSON: []
	}

	var filter = {
		init: function(posters) {
			var mapStadsdelen = map.allStadsdelenJSON
			var listStadsdelen = document.querySelectorAll('aside a');

			var stadsdelen = document.querySelectorAll('.leaflet-interactive');
			stadsdelen.forEach(function(el, index){
				el.classList.add(mapStadsdelen[index])
			})

			listStadsdelen[0].addEventListener('click', function(){
				if(stadsdelen[0].classList[1] == listStadsdelen[0].innerHTML){
					document.querySelector('.tweets-nieuw-west').style.display = "block";
					document.querySelector('.tweets-zuid').style.display = "none";
					document.querySelector('.tweets-centrum').style.display = "none";
					document.querySelector('.tweets-west').style.display = "none";
					document.querySelector('.tweets-westpoort').style.display = "none";
					document.querySelector('.tweets-oost').style.display = "none";
					document.querySelector('.tweets-noord').style.display = "none";
					document.querySelector('.tweets-zuidoost').style.display = "none";
					stadsdelen[0].classList.add('Selected');
					stadsdelen[1].classList.remove('Selected');
					stadsdelen[2].classList.remove('Selected');
					stadsdelen[3].classList.remove('Selected');
					stadsdelen[4].classList.remove('Selected');
					stadsdelen[5].classList.remove('Selected');
					stadsdelen[6].classList.remove('Selected');
					stadsdelen[7].classList.remove('Selected');
				}
			})

			listStadsdelen[1].addEventListener('click', function(){
				if(stadsdelen[1].classList[1] == listStadsdelen[1].innerHTML){
					document.querySelector('.tweets-nieuw-west').style.display = "none";
					document.querySelector('.tweets-zuid').style.display = "block";
					document.querySelector('.tweets-centrum').style.display = "none";
					document.querySelector('.tweets-west').style.display = "none";
					document.querySelector('.tweets-westpoort').style.display = "none";
					document.querySelector('.tweets-oost').style.display = "none";
					document.querySelector('.tweets-noord').style.display = "none";
					document.querySelector('.tweets-zuidoost').style.display = "none";

					stadsdelen[0].classList.remove('Selected');
					stadsdelen[1].classList.add('Selected');
					stadsdelen[2].classList.remove('Selected');
					stadsdelen[3].classList.remove('Selected');
					stadsdelen[4].classList.remove('Selected');
					stadsdelen[5].classList.remove('Selected');
					stadsdelen[6].classList.remove('Selected');
					stadsdelen[7].classList.remove('Selected');
				}
			})

			listStadsdelen[2].addEventListener('click', function(){
				if(stadsdelen[2].classList[1] == listStadsdelen[2].innerHTML){
					document.querySelector('.tweets-nieuw-west').style.display = "none";
					document.querySelector('.tweets-zuid').style.display = "none";
					document.querySelector('.tweets-centrum').style.display = "block";
					document.querySelector('.tweets-west').style.display = "none";
					document.querySelector('.tweets-westpoort').style.display = "none";
					document.querySelector('.tweets-oost').style.display = "none";
					document.querySelector('.tweets-noord').style.display = "none";
					document.querySelector('.tweets-zuidoost').style.display = "none";
					stadsdelen[0].classList.remove('Selected');
					stadsdelen[1].classList.remove('Selected');
					stadsdelen[2].classList.add('Selected');
					stadsdelen[3].classList.remove('Selected');
					stadsdelen[4].classList.remove('Selected');
					stadsdelen[5].classList.remove('Selected');
					stadsdelen[6].classList.remove('Selected');
					stadsdelen[7].classList.remove('Selected');
				}
			})

			listStadsdelen[3].addEventListener('click', function(){
				if(stadsdelen[3].classList[1] == listStadsdelen[3].innerHTML){
					document.querySelector('.tweets-nieuw-west').style.display = "none";
					document.querySelector('.tweets-zuid').style.display = "none";
					document.querySelector('.tweets-centrum').style.display = "none";
					document.querySelector('.tweets-west').style.display = "block";
					document.querySelector('.tweets-westpoort').style.display = "none";
					document.querySelector('.tweets-oost').style.display = "none";
					document.querySelector('.tweets-noord').style.display = "none";
					document.querySelector('.tweets-zuidoost').style.display = "none";

					stadsdelen[0].classList.remove('Selected');
					stadsdelen[1].classList.remove('Selected');
					stadsdelen[2].classList.remove('Selected');
					stadsdelen[3].classList.add('Selected');
					stadsdelen[4].classList.remove('Selected');
					stadsdelen[5].classList.remove('Selected');
					stadsdelen[6].classList.remove('Selected');
					stadsdelen[7].classList.remove('Selected');
				}
			})

			listStadsdelen[4].addEventListener('click', function(){
				if(stadsdelen[4].classList[1] == listStadsdelen[4].innerHTML){
					document.querySelector('.tweets-nieuw-west').style.display = "none";
					document.querySelector('.tweets-zuid').style.display = "none";
					document.querySelector('.tweets-centrum').style.display = "none";
					document.querySelector('.tweets-west').style.display = "none";
					document.querySelector('.tweets-westpoort').style.display = "block";
					document.querySelector('.tweets-oost').style.display = "none";
					document.querySelector('.tweets-noord').style.display = "none";
					document.querySelector('.tweets-zuidoost').style.display = "none";

					stadsdelen[0].classList.remove('Selected');
					stadsdelen[1].classList.remove('Selected');
					stadsdelen[2].classList.remove('Selected');
					stadsdelen[3].classList.remove('Selected');
					stadsdelen[4].classList.add('Selected');
					stadsdelen[5].classList.remove('Selected');
					stadsdelen[6].classList.remove('Selected');
					stadsdelen[7].classList.remove('Selected');
				}
			})

			listStadsdelen[5].addEventListener('click', function(){
				if(stadsdelen[5].classList[1] == listStadsdelen[5].innerHTML){
					document.querySelector('.tweets-nieuw-west').style.display = "none";
					document.querySelector('.tweets-zuid').style.display = "none";
					document.querySelector('.tweets-centrum').style.display = "none";
					document.querySelector('.tweets-west').style.display = "none";
					document.querySelector('.tweets-westpoort').style.display = "none";
					document.querySelector('.tweets-oost').style.display = "block";
					document.querySelector('.tweets-noord').style.display = "none";
					document.querySelector('.tweets-zuidoost').style.display = "none";

					stadsdelen[0].classList.remove('Selected');
					stadsdelen[1].classList.remove('Selected');
					stadsdelen[2].classList.remove('Selected');
					stadsdelen[3].classList.remove('Selected');
					stadsdelen[4].classList.remove('Selected');
					stadsdelen[5].classList.add('Selected');
					stadsdelen[6].classList.remove('Selected');
					stadsdelen[7].classList.remove('Selected');
				}
			})

			listStadsdelen[6].addEventListener('click', function(){
				if(stadsdelen[6].classList[1] == listStadsdelen[6].innerHTML){
					document.querySelector('.tweets-nieuw-west').style.display = "none";
					document.querySelector('.tweets-zuid').style.display = "none";
					document.querySelector('.tweets-centrum').style.display = "none";
					document.querySelector('.tweets-west').style.display = "none";
					document.querySelector('.tweets-westpoort').style.display = "none";
					document.querySelector('.tweets-oost').style.display = "none";
					document.querySelector('.tweets-noord').style.display = "block";
					document.querySelector('.tweets-zuidoost').style.display = "none";

					stadsdelen[0].classList.remove('Selected');
					stadsdelen[1].classList.remove('Selected');
					stadsdelen[2].classList.remove('Selected');
					stadsdelen[3].classList.remove('Selected');
					stadsdelen[4].classList.remove('Selected');
					stadsdelen[5].classList.remove('Selected');
					stadsdelen[6].classList.add('Selected');
					stadsdelen[7].classList.remove('Selected');
				}
			})

			listStadsdelen[7].addEventListener('click', function(){
				if(stadsdelen[7].classList[1] == listStadsdelen[7].innerHTML){
					document.querySelector('.tweets-nieuw-west').style.display = "none";
					document.querySelector('.tweets-zuid').style.display = "block";
					document.querySelector('.tweets-centrum').style.display = "none";
					document.querySelector('.tweets-west').style.display = "none";
					document.querySelector('.tweets-westpoort').style.display = "none";
					document.querySelector('.tweets-oost').style.display = "none";
					document.querySelector('.tweets-noord').style.display = "none";
					document.querySelector('.tweets-zuidoost').style.display = "block";

					stadsdelen[0].classList.remove('Selected');
					stadsdelen[1].classList.remove('Selected');
					stadsdelen[2].classList.remove('Selected');
					stadsdelen[3].classList.remove('Selected');
					stadsdelen[4].classList.remove('Selected');
					stadsdelen[5].classList.remove('Selected');
					stadsdelen[6].classList.remove('Selected');
					stadsdelen[7].classList.add('Selected');
				}
			})

			var refresh = document.querySelector('aside button');
			refresh.addEventListener('click', function(){
				stadsdelen.forEach(function(el){
					el.classList.remove("Selected")
				})
			})

			listStadsdelen.forEach(function(el){
				el.addEventListener('click', function(){
					var classStadsdeel = el.innerHTML;
					console.log(classStadsdeel)
					var tweets = document.querySelectorAll('blockquote');
					var h1 = document.querySelector('.content h1');
					h1.innerHTML = classStadsdeel;

					var data = posters.filter(function(el){
						var postersNew = el.locationLabel.value.split('Amsterdam-').join('');
						var rapenburg = el.locationLabel.value.split('Rapenburg').join('Centrum');
						var grachten = el.locationLabel.value.split('grachtengordel van Amsterdam').join('Centrum');
						var pijp = el.locationLabel.value.split('De Pijp').join('Zuid');

						return postersNew == classStadsdeel || rapenburg == classStadsdeel || grachten == classStadsdeel || pijp == classStadsdeel;
						// return mapStadsdelen.indexOf(postersNew) !== -1;
						/* https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript */
					})

					var mapSection = document.querySelector('main');
					var postersSection = document.querySelector('.content');
					var prev =  document.querySelector('.previous');
					var next = document.querySelector('.next');


					if(Object.keys(data).length === 0){
						next.style.display = "block";
						prev.style.display = "none";
					} else {
						//mapSection.classList.add("hide");
						next.style.display = "block";
						prev.style.display = "none";
					}

					prev.addEventListener('click', function(){
						mapSection.style.display = "flex";
						postersSection.style.display = "none";

						document.querySelector('.previous').style.display = "none";

					})

					next.addEventListener('click', function(){
						stadsdelen.forEach(function(el){
							el.classList.remove("Selected")
						})

						mapSection.style.display = "none";
						postersSection.style.display = "block";
						document.querySelector('.previous').style.display = "block";
						document.querySelector('.next').style.display = "none";
					})

					console.log(data)

					template.renderImages(data);
				})
			})

			stadsdelen.forEach(function(el){
				el.addEventListener('click', function(){
					var h1 = document.querySelector('.content h1');
					var classStadsdeel = el.classList[1];
					h1.innerHTML = el.classList[1];

					var data = posters.filter(function(el){
						var postersNew = el.locationLabel.value.split('Amsterdam-').join('');
						var rapenburg = el.locationLabel.value.split('Rapenburg').join('Centrum');
						var grachten = el.locationLabel.value.split('grachtengordel van Amsterdam').join('Centrum');
						var pijp = el.locationLabel.value.split('De Pijp').join('Zuid');

						return postersNew == classStadsdeel || rapenburg == classStadsdeel || grachten == classStadsdeel || pijp == classStadsdeel;
						// return mapStadsdelen.indexOf(postersNew) !== -1;
						/* https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript */
					})

					var mapSection = document.querySelector('main');
					var postersSection = document.querySelector('.content');
					var prev =  document.querySelector('.previous');
					var next = document.querySelector('.next');


					if(Object.keys(data).length === 0){
						next.style.display = "block";
						prev.style.display = "none";
					} else {
						//mapSection.classList.add("hide");
						next.style.display = "block";
						prev.style.display = "none";
					}

					prev.addEventListener('click', function(){
						mapSection.style.display = "flex";
						postersSection.style.display = "none";

						document.querySelector('.previous').style.display = "none";

					})

					next.addEventListener('click', function(){
						stadsdelen.forEach(function(el){
							el.classList.remove("Selected")
						})

						mapSection.style.display = "none";
						postersSection.style.display = "block";
						document.querySelector('.previous').style.display = "block";
						document.querySelector('.next').style.display = "none";
					})

					template.renderImages(data);
				})
			})
		}
	}

	var template = {
		renderImages: function(data){
			var target = document.querySelector('#images')
			var directives = {
			  img: {
			    src: function(params) {
						return this.img.value
			    }
			  }
			}
			Transparency.render(target, data, directives)
		},
		renderAside: function(){
			var target = document.querySelector('aside')
			var stadsdelen = map.allStadsdelenJSON;
			console.log(map.allStadsdelenJSON)

			for (var i = 0; i < stadsdelen.length; i++){
				var a = document.createElement("a");
				a.innerHTML = stadsdelen[i];
				target.appendChild(a);
			}

		}

	}

	// Start the application
	app.init()
})()
