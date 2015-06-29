/**
 * Created by idams on 6/26/15.
 */

'use strict'

import React from 'react';
import MoviePage from './MoviePage.jsx';
import MovieStore from '../stores/MovieStore.js';
import MovieActions from '../actions/MovieActions.js';
import MovieConstants from '../constants/MovieConstants.js';
import Utils from '../utils.js';

function getState(){
    return {
        pages: MovieStore.getPages(),
        currentPage: MovieStore.getPage(),
        hasMore: MovieStore.getHasMore()
    }
}

class MovieList extends React.Component{

    constructor(props){
        super(props);

        this.state = getState();

        this.scroll = 0;
        this.lastScroll = 0;
        this.scrollCounter = 0;
        this.pagesH = {};

        // Avoid looking into the DOM for unchanged values
        this.body = document.body;
        this.docEl = document.documentElement; //Firefox
        this.bodyH = Math.max(this.docEl.clientHeight,window.innerHeight);

        this._onChange = this._onChange.bind(this);
        this._onChangePage = this._onChangePage.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._getPageHeight = this._getPageHeight.bind(this);
        this._goToPage = this._goToPage.bind(this);
    }

    componentDidMount(){
        MovieStore.addEventListener(MovieConstants.LOAD_EVENT,this._onChange);
        MovieActions.get(1);

        var self = this;
        window.addEventListener('scroll',function(){
            Utils.throttle(self._onScroll,self,100)}
            ,false
        );
    }
    componentWillUnmount(){
        MovieStore.removeEventListener(MovieConstants.LOAD_EVENT,this._onChange);
        window.removeEventListener('scroll');
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextState.currentPage !== this.state.currentPage;
    }

    _onChange(){
        this.setState(getState());
    }
    _onChangePage(){
        var goToPageInc = 0;

        if( this.scroll > this.lastScroll ){
            // DOWN

            // page already loaded before
            if( (this.state.pages[this.state.currentPage + 1] &&
                (this.scrollCounter >= this.pagesH[this.state.currentPage] * .6)) ){
                goToPageInc = 1;

            }else if( React.findDOMNode(this).offsetHeight - this.scroll < this.bodyH * 1.5 ){
                goToPageInc = 1;
            }
        }else{
            // UP
            if( Math.abs(this.scrollCounter) >= this.pagesH[this.state.currentPage] * .7 ||
                this.scroll < this.pagesH[1] * .8 ){
                goToPageInc = -1;
            }
        }

        this._goToPage(goToPageInc);
    }
    _onScroll(){

        this.lastScroll = this.scroll;
        this.scroll = Math.max(this.body.scrollTop,this.docEl.scrollTop);
        this.scrollCounter += this.scroll - this.lastScroll;

        this._onChangePage();
    }
    _goToPage(inc){
        if( inc === 0 ) return;

        MovieActions.get(inc);
        this.scrollCounter = 0;
    }
    _getPageHeight(page,h){
        this.pagesH[page] = h;
    }

    render(){

        var pagesNode = [];
        var mL = this.state.pages.length;

        for(let i = 0; i < mL; i++){
            pagesNode.push(<MoviePage
                movies={this.state.pages[i]}
                page={i+1}
                communicateHeight={this._getPageHeight}
                height={this.pagesH[i+1]}
                key={i} />)
        }

        return (
            <div id="movieList">
                <ul>
                    {pagesNode}
                </ul>
            </div>
        )

    }

};
MovieList.propTypes = {
    pages: React.PropTypes.array,
    hasMore: React.PropTypes.bool
};
MovieList.defaultProps = {
    pages: [],
    hasMore: true
};

export default MovieList;