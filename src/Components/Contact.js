import React, { Component } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
class Contact extends Component {
   
  render() {

    if(this.props.data){
      // var name = this.props.data.name;
      // var street = this.props.data.address.street;
      // var city = this.props.data.address.city;
      // var state = this.props.data.address.state;
      // var zip = this.props.data.address.zip;
      // var phone= this.props.data.phone;
      // var email = this.props.data.email;
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


            {/* <aside className="four columns footer-widgets">
               <div className="LI-profile-badge" style={{textAlign: "center"}} data-version="v1" data-size="large" data-locale="en_US" data-type="vertical" data-theme="dark" data-vanity="stanley-luong"><a className="LI-simple-link" href='https://www.linkedin.com/in/stanley-luong?trk=profile-badge'>Stanley Luong</a></div>
               <div className="widget widget_contact">

					   <h4>Email</h4>
					   <p className="address">
						   {name}<br />
						   {street} <br />
						   {city}, {state} {zip}<br />
                  <span>{phone}</span>
                     <span>{email}</span>
					   </p>
				   </div>

               <div className="widget widget_tweets">
                  <h4 className="widget-title">Twitter</h4>
                  <ul id="twitter">  
                             <TwitterTimelineEmbed
                                 sourceType="profile"
                                 screenName="stanleyluong17"
                                 options={{height: 270}} />
                  </ul>
		         </div>
            </aside> */}
      </div>
   </section>
    );
  }
}

export default Contact;