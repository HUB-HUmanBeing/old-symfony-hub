/**
 * Created by banquo on 03/07/17.
 */
//quant le document est ready

$(function() {  
   	var map;
    //fonction affichant la map avec une pin sur le lieu qu'on veut
    function initmap(lat, lon, city) {
		if(map!=null) {
		      map.remove();
		}
		map = L.map('user_mapid');
		map.setView([lat, lon], 13);
		// create the tile layer with correct attribution
		var osmUrl = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
		var osmAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
		var osm = new L.TileLayer(osmUrl, {
	        maxZoom: 19,
	        attribution: osmAttrib
      	});
		// start the map
		L.marker([lat, lon]).addTo(map)
        	.bindPopup(city)
        	.openPopup();
		map.addLayer(osm);
	}

	//au click sur le bouton rechercher ma ville
	$("#search").click(function(e) {
		e.preventDefault();
		//on récupere la valeur de la ville rentrée par l'utilisateur
		var address = $("#user_adress").val();
		//on envoie une requete à l'api nominatim (on remplace les accents par des &)
		var url = "http://nominatim.openstreetmap.org/search/" + address.replace(" " , "&") + "?format=json&addressdetails=1&limit=1";
		$.getJSON(url, function(data) {
			if(data.length==0) {
				return;
			}
			//on parse la reponse data
			var lat = data[0].lat;
			var lon = data[0].lon;
			var city = data[0].address.city;
			var country = data[0].address.country;
			//on remplit les champs cachés
			$('#user_lat').val(lat);
			$('#user_lon').val(lon);
			$('#user_city').val(city);
			$('#user_country').val(country);
			//on fait la meme chose si on est face a un projet
			$('#project_lat').val(lat);
			$('#project_lon').val(lon);
			$('#project_city').val(city);
			$('#project_country').val(country);
			//on fait la meme chose si on est face a un form d'edition de la géoloc
			$('#form_lat').val(lat);
			$('#form_lon').val(lon);
			$('#form_city').val(city);
			$('#form_country').val(country);
			//on fait s'afficher la carte
			initmap(lat, lon, city);
		});
	});
	//fonction pour afficher la pin et la carte sur la vue des projets
	//l'evenement correspond au click sur le bouton définit sur le projectGeneralTemplate
	//todo : de manière inexplicable, la carte s'affiche qu'a moitié, la moitié droite reste grisée...
	$('#show_city').click(function (e) {
		e.preventDefault();
		var project_lat = $('#project_lat').html();
		var project_lon = $('#project_lon').html();
		var project_city = $('#project_city').html();
	
		initmap(project_lat, project_lon, project_city);
	});
});
