/**
 * Created by idams on 6/26/15.
 */

'use strict'

import React from 'react';
import Movie from './Movie.jsx';

class MoviePage extends React.Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){
        var h = React.findDOMNode(this).offsetHeight;

        this.props.communicateHeight(this.props.page,h);
    }
    componentDidUpdate(){
        React.findDOMNode(this).style.height = this.props.height+'px';
    }

    render(){

        var mL = this.props.movies.length;
        var moviesNode = [];

        for(let i = 0; i < mL; i++){
            var key = this.props.page * 10 + i;
            moviesNode.push(<Movie movie={this.props.movies[i]} key={key} />)
        }

        return (
            <li className="page">
                {moviesNode}
            </li>
        )

    }

};
MoviePage.propTypes = {
    movies: React.PropTypes.array,
    page: React.PropTypes.number,
    height: React.PropTypes.number
};
MoviePage.defaultProps = {
    movies: [],
    page: 1,
    height: 0
};

export default MoviePage;