import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox', 'onestop_id', 'served_by', 'isochrone_mode'],
	queryUrl: Ember.computed('bbox', 'onestop_id', function(){
		var url = "https://transit.land/api/v1/stops?";
		var arrayOfQueryParams = ['isochrone_mode'];
		for (var i = 0; i < this.get('queryParams').length; i++){
			if (arrayOfQueryParams.indexOf(this.get('queryParams')[i]) === -1 && this.get(this.get('queryParams')[i]) !== null){
				arrayOfQueryParams.push(this.get('queryParams')[i])
				if (i === 0){
					url = url + this.get('queryParams')[i] + "=" + this.get(this.get('queryParams')[i]);
				} else {
					url = url + "&" + this.get('queryParams')[i] + "=" + this.get(this.get('queryParams')[i]);
				}
			}
		}
		return url;
	}),
	bbox: null,
	leafletBbox: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
	onestop_id: null,
	selectedStop: null,
	served_by: null,
	isochrone_mode: null,
	hoverStop: null,
	place: null,
	pedestrianIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'pedestrian');
	}),
	bicycleIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'bicycle');
	}),
	multimodalIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'multimodal');
	}),
	autoIsochrone: Ember.computed('isochrone_mode', function(){
		return (this.get('isochrone_mode') === 'auto');
	}),
	icon: L.icon({
		iconUrl: 'assets/images/stop.png',		
		iconSize: (10, 10)
	}),
	highlightedIcon: L.icon({
		iconUrl: 'assets/images/stop2.png',		
		iconSize: (10, 10),
	}),
	mapMoved: false,
	mousedOver: false,
	actions: {
		updateLeafletBbox(e) {
			var leafletBounds = e.target.getBounds();
			this.set('leafletBbox', leafletBounds.toBBoxString());
		},
		updatebbox(e) {
			var bounds = this.get('leafletBbox');
			this.set('bbox', bounds);
			this.set('mapMoved', false);
		},
		updateMapMoved(){
			if (this.get('mousedOver') === true){
				this.set('mapMoved', true);
			}
		},
		mouseOver(){
			this.set('mousedOver', true);
		},
		selectStop(stop){
			this.set('selectedStop', null);
			var highlightedIcon = this.get('highlightedIcon');
			stop.set('stop_icon', highlightedIcon);
			this.set('hoverStop', stop);
		},
		unselectStop(stop){
			var icon = this.get('icon');
			stop.set('stop_icon', icon);
			this.set('hoverStop', null);
		},
		setOnestopId(stop) {
			var onestopId = stop.id;
			this.set('selectedStop', stop);
			this.set('onestop_id', onestopId);
			this.set('served_by', null);
			this.set('displayIsochrone', false);
		},
		searchRepo(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = `https://search.mapzen.com/v1/autocomplete?api_key=search-ab7NChg&sources=wof&text=${term}`;
      return Ember.$.ajax({ url }).then(json => json.features);
    },
    setPlace(selected){
    	this.set('place', selected);
    	this.set('bbox', selected.bbox);
  		this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox')}});
  	},
  	clearPlace(){
  		this.set('place', null);
  	},
  	setIsochroneMode(mode){
  		if (this.get('isochrone_mode') === mode){
  			this.set('isochrone_mode', null);
  		} else {
  			this.set('isochrone_mode', mode);
  		}
		}
	}
});