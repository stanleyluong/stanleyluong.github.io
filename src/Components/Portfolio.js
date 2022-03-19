import React, { Component } from 'react';

class Portfolio extends Component {
  render() {

    if(this.props.data){
      var portfolio = this.props.data.projects.slice(0,12).map(project => {
        var projectImage = 'images/portfolio/'+project.image
        return (
          <div key={project.title} className="columns portfolio-item">
            <div className="item-wrap">
              <a target="_blank" rel="noreferrer" href={project.url} title={project.title}>
                  <img width="100%" loading="lazy" src={projectImage} alt={project.title} type="image/webp"/>
                <div className="overlay">
                    <div className="portfolio-item-meta">
                  <h5>{project.title}</h5>
                      <p>{project.category}</p>
                    </div>
                  </div>
                <div className="link-icon"><i className="fa fa-link"></i></div>
              </a>
            </div>
          </div>
        )
      })
    }

    return (
      <section id="portfolio">

      <div className="row">

         <div className="twelve columns collapsed">

            <h1>Check Out my portfolio.</h1>

            <div id="portfolio-wrapper" className="bgrid-fifths s-bgrid-thirds cf">
                {portfolio}
            </div>
          </div>
      </div>
   </section>
    );
  }
}

export default Portfolio;
