/**
 * Created by idams on 6/26/15.
 */

'use strict'

import $ from 'jquery';
import AppDispatcher from '../dispatcher/AppDispatcher.js';
import MovieConstants from '../constants/MovieConstants.js';
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var _pages = [];
var _page = 0;
var _hasMore = true;

function get(page){

    // End of scroll or Top of scroll
    if( (!_hasMore && _page + page > _pages.length) || _page + page < 1){
        MovieStore.emitEvent(MovieConstants.LOAD_EVENT);
        return;
    }

    var nextPage = _page + page;

    // if already loaded
    if( _pages[nextPage] ){
        _page = _page + page;
        MovieStore.emitEvent(MovieConstants.LOAD_EVENT);
        return;
    }

    var _source = 'https://dev-api.streamnation.com/api/v1/movies?with_facets=false&page='+nextPage+'&sort_by=new_content&order=desc&watched=false&currently_playing_first=true&per_page=10&cover=low&fields=%5B%22name%22%2C%22cover%22%5D&x_api_version=2.0&auth_token=ap84WKgZ5rgy8Dmkamwe';
    $.get(_source, function(result) {
        if( result.movies.length === 0 ){
            _hasMore = false;
        }else{
            _pages[nextPage - 1] = result.movies;
            _page = _page + page;
        }

        MovieStore.emitEvent(MovieConstants.LOAD_EVENT);
    });

}

var MovieStore = assign({},EventEmitter.prototype,{

    getPages(){

        var pL = _pages.length;
        var displayMovies = [];

        for(let i = 0; i < pL; i++){
            var arr = [];
            if( i >= _page - 2 && i <= +_page ){
                arr = _pages[i] || [];
            }
            displayMovies.push(arr);
        }

        return displayMovies;
    },
    getPage(){
        return _page;
    },
    getHasMore(){
        return _hasMore;
    },

    emitEvent(eventName,arg){
        this.emit(eventName,arg);
    },

    addEventListener(eventName,callback){
        this.on(eventName,callback);
    },

    removeEventListener(eventName,callback){
        this.removeListener(eventName,callback);
    },

    dispatcherIndex:AppDispatcher.register(function(action){

        switch(action.actionType){

            case(MovieConstants.LOAD_ACTION):
                get(action.page);
                break;
        }

    })

});

export default MovieStore;

