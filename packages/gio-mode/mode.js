'use strict';

let _ = require('underscore');

let get = require('../gio-get/get');
let utils = require('../gio-utils/utils');
let convert_geometry = require('../gio-convert-geometry/convert-geometry');
let intersect_polygon = require('../gio-intersect-polygon/intersect-polygon');

let get_mode = values => {

    // iterate through values and store in obj
    let store = {};
    let value_length = values.length;
    let mode = [null, 0];
    for (let i = 0; i < value_length; i++) {
        let value = values[i];
        if (store[value]) {
            store[value] += 1;
        } else {
            store[value] = 1;
        }
    }

    // iterate through values to get highest frequency
    let buckets = _.sortBy(_.pairs(store), pair => pair[1])
    let max_frequency = buckets[buckets.length - 1][1];
    let modes = buckets
        .filter(pair => pair[1] === max_frequency)
        .map(pair => Number(pair[0]));
    return modes.length === 1 ? modes[0] : modes; 
}

module.exports = (image, geom) => {
    
    try {
        
        if (utils.is_bbox(geom)) {

            geom = convert_geometry('bbox', geom);

            // grab array of values;
            let values = get(image, geom);
            let no_data_value = utils.get_no_data_value(image);

            if (values.length === 1) { // one band
                let filtered_values = values[0].filter(value => value !== no_data_value)
                return get_mode(filtered_values);
            } else { // multiple bands
                return values
                    .map(band => band.filter(value => value !== no_data_value))
                    .map(get_mode_from_values);
            }
        } else if (utils.is_polygon(geom)) {
            geom = convert_geometry('polygon', geom);
            let values = [];

            // the third argument of this function is a function which
            // runs for every pixel in the polygon. Here we add them to
            // an array to run through the get_mode function
            intersect_polygon(image, geom, (value, band_index) => {
                if (values[band_index]) {
                    values[band_index].push(value);
                } else {
                    values[band_index] = [value];
                }
            });

            if (values.length === 1) {
                return get_mode(values[0]);
            } else if (values.length > 1) {
                return values.map(get_mode);
            } else {
                throw 'No Values were found in the given geometry';
            }
        }else {
            throw 'Non-Bounding Box geometries are currently not supported.'
        }  
    } catch(e) {
        console.error(e);
        throw e;
    }

}