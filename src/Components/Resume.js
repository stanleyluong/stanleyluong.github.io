import React, { Component } from 'react';

class Resume extends Component {
  render() {
    if(this.props.data){
      var skillmessage = this.props.data.skillmessage;  
      var education = this.props.data.education.map(education => {
        return (
          <div key={education.description}>
            <h3>{education.school}</h3>
              <p className="info">{education.degree} 
                <span>&bull;</span>
                <em className="date">{education.graduated}</em>
              </p>
              <p className='description'>{education.description}</p>
          </div>
        )
      })

      var work = this.props.data.work.map(function(work){
        let lines = work.description.map(line=>{
          return(
            
              <li key={line}><span>&bull; </span>{line}</li>
            
          )
        })
        return (<div key={work.company}><h3>{work.company}</h3>
                  <p className="info">{work.title}<span>&bull;</span> <em className="date">{work.years}</em></p>
                  <ul>{lines}</ul>
                </div>)
      })

      var skills = this.props.data.skills.map(function(skills){
        var className = 'bar-expand '+skills.name.toLowerCase();
        return  <li key={skills.name}>
                  <span style={{width:skills.level}}className={className}></span>
                  <em>{skills.name}</em>
                </li>
      })

      var certificates = this.props.data.certificates.map(function(certificate){
        return(
          <div key={certificate.image} >
            <h3>{certificate.school}</h3>
              <p className="info">{certificate.course} 
                <em className="date">{certificate.graduated}</em>
              </p>
              <a href={"https://www.stanleyluong.com/"+certificate.image} target="_blank" rel="noreferrer">
                <img loading="lazy" className="certificate-image"  width="100%" src={certificate.image} alt="certificate" type="image/webp"/>
              </a>
          </div>
        )
      })
    }


    return (
    <section id="resume">
      <div className="row work">
        <div className="three columns header-col"><h1><span>Employment</span></h1></div>
        <div className="nine columns main-col">{work}</div>
      </div>

      <div className="row education">
        <div className="three columns header-col"><h1><span>Education</span></h1></div>
        <div className="nine columns main-col"><div className="row item"><div className="twelve columns">{education}</div></div></div>
      </div>

      <div className="row certificates">
        <div className="three columns header-col"><h1><span>Certificates</span></h1></div>
        <div className="nine columns main-col"><div><div>{certificates}</div></div></div>
      </div>

      <div className="row skill">
        <div className="three columns header-col"><h1><span>Skills</span></h1></div>
        <div className="nine columns main-col"><p>{skillmessage}</p><div className="bars"><ul className="skills">{skills}</ul></div></div>
      </div>
    
    </section>
    );
  }
}

export default Resume;
