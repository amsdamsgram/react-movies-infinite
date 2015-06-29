/**
 * Created by idams on 6/26/15.
 */

'use strict'

import React from 'react';


class Movie extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="movie">
                <div className="movieCoverWrapper">
                    <img src={this.props.movie.cover} className="movieCover" />
                </div>
                <div className="movieName">{this.props.movie.name}</div>
            </div>
        )

    }

};
Movie.propTypes = {
    movie: React.PropTypes.object
};
Movie.defaultProps = {
    movie: {
        name: 'No Name',
        cover: ''
    }
};

export default Movie;