/**
 * Created by idams on 6/26/15.
 */

'use strict'

import AppDispatcher from '../dispatcher/AppDispatcher.js';
import MovieConstants from '../constants/MovieConstants.js';

var MovieActions = {

    get(page){

        AppDispatcher.dispatch({
            actionType: MovieConstants.LOAD_ACTION,
            page: page
        })

    }
};

export default MovieActions;