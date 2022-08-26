import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";



export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'science'
  }
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,

  }
  capitalizeFirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  

  constructor(props){
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page:1,
      totalResults:0
    }
    document.title = `${this.capitalizeFirst(this.props.category)} - Small Press`;

  }
  async updateNews(){
    const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=f0197a9d4d134af6b972ed0a2c1a731b&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true});
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
       articles: parsedData.articles,
       totalResults: parsedData.totalResults,
       loading:false,
      });

  }
  async componentDidMount(){
    this.updateNews()
  }
  handlePrevClick=async()=>{
    // console.log("previous");
    // this.setState({loading:true})
    // let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=f0197a9d4d134af6b972ed0a2c1a731b&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // console.log(parsedData);
     


    // this.setState({
    //   page: this.state.page - 1,
    //   articles: parsedData.articles,
    //   loading:false
    // })
    this.setState({page:this.state.page - 1});
    this.updateNews()
  }

  handleNextClick=async()=>{
    // if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))){
    //   let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=f0197a9d4d134af6b972ed0a2c1a731b&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    //   this.setState({loading:true});
    //   let data = await fetch(url);
    //   let parsedData = await data.json();
    //   console.log(parsedData);
     
     

    //   this.setState({
    //     page: this.state.page + 1,
    //     articles: parsedData.articles,
    //     loading:false
    //   })
    // }
    this.setState({page:this.state.page + 1});
    this.updateNews()
  }
  fetchMoreData = async() => {
    
    this.setState({page: this.state.page + 1})
    const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=f0197a9d4d134af6b972ed0a2c1a731b&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    // this.setState({loading:true});
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
       totalResults: parsedData.totalResults,
      //  loading:false,
       page: this.state.page + 1
      });

  };

  render() {
    return (
      <>
        <h1 className="text-center" style={{margin:'35px 0px', marginTop:'90px'}}>Small Press - Top {this.capitalizeFirst(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner/>}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >
          <div className="container">

          
          <div className="row">
          { this.state.articles.map((element)=>{
            return <div className="col-md-4" key={element.url}>
              <NewsItem 
                title={element.title}
                description={element.description}
                imageUrl={element.urlToImage}
                newsUrl={element.url}
                author={element.author}
                date={element.publishedAt}
                source={element.source.name}
              />
            </div>
          })}
          </div>
          </div>
        </InfiniteScroll> 

       
        
      </>
    );
  }
}

export default News;
