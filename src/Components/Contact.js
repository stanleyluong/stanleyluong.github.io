import React, { Component } from 'react';
const moment = require('moment'); // require
// const apiKey = "KmFsGlzJi1PoHj2oEW1RBgj64"
// const apiSecretKey = "S8XTQKWLdGuwJvFJkwojVc2hrYTBD5wPtXxWr6l0jmLrsr82BE"
const bearerToken = "AAAAAAAAAAAAAAAAAAAAAHDALwEAAAAAi6oVHBSmffgxsWXOdj5KO1pwDgI%3DT4ZMdbyHugE8ut873YM23T4BVfx7ZynYeo3wYFH9IjYYO0AIAA"
const proxy = "https://cors-anywhere.herokuapp.com/"
const userId = "2554310400"
class Contact extends Component {
   constructor(){
      super()
      this.state = {
         tweets: []
      }
   }
   componentDidMount(){
      this.getTweets()
   }

   getTweets = async () => {
      let res = await fetch(`${proxy}https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=created_at&user.fields=created_at&max_results=5`,{
         method: "GET",
         headers: {
            'Content-Type':'application/json',
            'Authorization':'Bearer '+bearerToken
         }
      })
      let json = await res.json()
      this.setState({
         tweets: json.data
      })
   }
   
  render() {

    if(this.props.data){
      // var name = this.props.data.name;
      // var street = this.props.data.address.street;
      // var city = this.props.data.address.city;
      // var state = this.props.data.address.state;
      // var zip = this.props.data.address.zip;
      // var phone= this.props.data.phone;
      var email = this.props.data.email;
      var message = this.props.data.contactmessage;
    }

    return (
      <section id="contact">

         <div className="row section-head">

            <div className="two columns header-col">

               <h1><span>Get In Touch.</span></h1>

            </div>

            <div className="ten columns">

                  <p className="lead">{message}</p>

            </div>

         </div>

         <div className="row">
            <div className="eight columns">
               
               <form action="https://mailthis.to/stanleyluong" method="POST" id="contactForm" name="contactForm">
					<fieldset>

                  <div>
						   <label htmlFor="name">Name <span className="required">*</span></label>
						   <input type="text" defaultValue="" size="35" id="name" name="name" onChange={this.handleChange}/>
                  </div>

                  <div>
						   <label htmlFor="_replyto">Email <span className="required">*</span></label>
						   <input type="text" defaultValue="" size="35" id="_replyto" name="_replyto" onChange={this.handleChange}/>
                  </div>

                  <div>
						   <label htmlFor="contactSubject">Subject</label>
						   <input type="text" defaultValue="" size="35" id="contactSubject" name="contactSubject" onChange={this.handleChange}/>
                  </div>

                  <div>
                     <label htmlFor="contactMessage">Message <span className="required">*</span></label>
                     <textarea cols="50" rows="15" id="contactMessage" name="contactMessage"></textarea>
                  </div>

                  <div>
                     <button className="submit">Submit</button>
                     <span id="image-loader">
                        <img alt="" src="images/loader.gif" />
                     </span>
                  </div>
                  
					</fieldset>
				   </form>

           <div id="message-warning"> Error boy</div>
				   <div id="message-success">
                  <i className="fa fa-check"></i>Your message was sent, thank you!<br />
				   </div>
           </div>


            <aside className="four columns footer-widgets">
               <div className="widget widget_contact">

					   <h4>Email</h4>
					   <p className="address">
						   {/* {name}<br />
						   {street} <br />
						   {city}, {state} {zip}<br />
						   <span>{phone}</span> */}
                     <span>{email}</span>
					   </p>
				   </div>

               <div className="widget widget_tweets">
                  <h4 className="widget-title">Latest Tweets</h4>
                  <ul id="twitter">
                     {this.state.tweets.map(tweet=>{
                        let href = `https://twitter.com/stanleyluong17/status/${tweet.id}?ref_src=twsrc%5Etfw`
                        return(
                           <li key={tweet.id}>
                              <blockquote className="twitter-tweet">
                                 <p lang="en" dir="ltr">{tweet.text}</p>
                                 &mdash; stanley luong (@stanleyluong17) <a target="_blank" rel="noreferrer" href={href}>{moment(tweet.created_at).format("MMMM DD, YYYY")}</a>
                              </blockquote> 
                              {/* <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> */}
                           </li>
                        )
                     })}
                    
                  </ul>
		         </div>
            </aside>
      </div>
   </section>
    );
  }
}

export default Contact;
