import React, {Component} from 'react';
import PropTypes from 'prop-types';
import injectSheet from "react-jss";
import { react } from "@nosplatform/api-functions";
import { u, wallet } from "@cityofzion/neon-js";
import { unhexlify, hexlify }  from "binascii";
import sjcl from "sjcl";


const { injectNOS } = react.default;



const styles = {

  buy:{}

};


class BuyTickets extends Component {

  state = {
    changeState: "events",
    currentCat: "",
    currentTitle: "",
    currentAddress: "",
    currentPrice: null,
    currentAvail: null,
    tickets: "",
    password: "",
    totalPrice: null,
    active: false,
    upcoming: false,
    past: false,

  }

  handleActive = () => {
    var status = this.state.active
    this.setState({active: !status})
    //console.log("change active")
  }

  handleUpcoming = () => {
    var status = this.state.upcoming
    this.setState({upcoming: !status})
    //console.log("change upcoming")
  }

  handlePast = () => {
    var status = this.state.past
    this.setState({past: !status})
    //console.log("change past")
  }

  handleSubmit = e => {
    e.preventDefault();
    var hashConcat = this.props.userAddress
      +this.state.currentAddress
      +this.state.currentCat
      +this.state.currentTitle
      +this.state.password
    //console.log(hashConcat);
    var ticketHash = sjcl.codec.hex.fromBits(
      sjcl.hash.sha256.hash(hashConcat)
    )
    //console.log(ticketHash);

    var getData;
    getData=this.props.handleGetStorage(this.props.scriptHash,
      this.props.dappHash
      +hexlify('/st/')
      +ticketHash
      +this.props.userAddress,
      false,
      false);

    Promise.resolve(getData).then(r => {
        if(r===null){
          alert(`Make sure you have ${this.state.totalPrice} MCTs in your wallet.\nOtherwise transcation will not be process by Smart Contract`)
          this.props.handleInvoke(
            this.props.scriptHash,
            "transfer",
            [this.props.userAddress,
              this.props.dappHash,
              parseInt(this.state.totalPrice)*100000000,
              hexlify("buyTickets"),
              this.state.currentAddress,
              hexlify(this.state.currentCat),
              hexlify(this.state.currentTitle),
              parseInt(this.state.tickets),
              ticketHash],
              false)

        } else {
          alert("Password already used for another ticket order, Please use different password!")
        }
      });
  }

  handleStatus = (e) => {
    this.setState({changeState: e});

  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value})
    if(e.target.name==="tickets") {
      this.setState({totalPrice:
        (e.target.value * this.state.currentPrice)})
    }

  }

  handleBuy = (e) => {
    if(e[6]!==0){
      this.setState({currentAddress: e[0]},
      () => this.setState({currentCat: e[1]},
      () => this.setState({currentTitle: e[2]},
      () => this.setState({currentPrice: e[4]/100000000},
      () => this.setState({currentAvail: e[6]},
      () => this.setState({changeState: "buy"}
      ))))));


    } else {
      alert("All tickets sold!")
    }


  }

  callMain = ({classes}) => {
        return(
          <React.Fragment>
          <div className={classes.userArea}>
          <div className={classes.heading}>
          List of Events
          </div>
          <div className={classes.container}>
          <div className={classes.eventBuy}>
            <label><strong>Show Me:  </strong></label>
            <input type="checkbox" name="active"
              onClick={()=>{this.handleActive()}} />Active Events
            <input type="checkbox" name="upcoming"
              onClick={()=>{this.handleUpcoming()}} />Upcoming Events
            <input type="checkbox" name="past"
              onClick={()=>{this.handlePast()}} />Past Events
          </div>
          <div className={classes.row}>
          {
            this.state.active ?

              this.props.deserialized.map((d, index) => {
                return(
                <React.Fragment key={index}>
                  <div className={classes.col45}>
                    <div className={classes.eventDetails}>
                      Active Event
                    </div>
                    <div className={classes.eventCat}>
                    <strong>Event Category: </strong> {d[1]}
                    </div>
                    <div className={classes.eventName}>
                    <strong>Event Title: </strong>
                    {d[2]}
                    </div>
                    <div className={classes.eventAddress}>
                    <strong>Event Address: </strong> {d[3]}
                    <br />
                    <br />
                    <strong>Event Date: </strong> {d[10]}
                    </div>
                    <div className={classes.eventBuy}>
                      <strong>Price: </strong> {d[4]/100000000}/MCT
                      <br />
                      <button onClick={()=>{this.handleBuy(d)}}>Buy Tickets</button>
                    </div>
                  </div>
                </React.Fragment>


                )
              })
              :null
            }

            {
              this.state.upcoming ?
                this.props.deserialized_upcoming.map((u, index) => {
                  return(
                  <React.Fragment key={index}>
                    <div className={classes.col45}>
                        <div className={classes.eventDetails}>
                          Upcoming Event
                        </div>

                        <div className={classes.eventCat}>
                        <strong>Event Category: </strong> {u[1]}
                        </div>
                        <div className={classes.eventName}>
                        <strong>Event Title: </strong>
                        {u[2]}
                        </div>
                        <div className={classes.eventAddress}>
                        <strong>Event Address: </strong> {u[3]}
                        <br />
                        <br />
                        <strong>Event Date: </strong> {u[10]}
                        </div>
                        <div className={classes.eventBuy}>
                          <strong>Price: </strong> {u[4]/100000000}/MCT
                          <br />
                          <strong>Start on: </strong> {u[8]}
                        </div>
                    </div>
                  </React.Fragment>


                  )
                })
                :null
              }


              {
                this.state.past ?
                this.props.deserialized_past.map((u, index) => {
                  return(
                  <React.Fragment key={index}>
                    <div className={classes.col45}>
                        <div className={classes.eventDetails}>
                          Past Event
                        </div>

                        <div className={classes.eventCat}>
                        <strong>Event Category: </strong> {u[1]}
                        </div>
                        <div className={classes.eventName}>
                        <strong>Event Title: </strong>
                        {u[2]}
                        </div>
                        <div className={classes.eventAddress}>
                        <strong>Event Address: </strong> {u[3]}
                        <br />
                        <br />
                        <strong>Event Date: </strong> {u[10]}
                        </div>
                        <div className={classes.eventBuy}>
                          <strong>Price: </strong> {u[4]/100000000}/MCT
                          <br />
                          <strong>Ended on: </strong> {u[9]}
                        </div>
                    </div>
                  </React.Fragment>


                  )
                })
                :null
              }
              </div>


              <div className={classes.row}>
              </div>
              </div>
              </div>
              <div className={classes.buttonArea}>
              <button className={classes.homeButton} onClick={() => {
                this.props.clickHandler("default")
              }}>Home</button>
              </div>

          </React.Fragment>
        );
      }



      callBuy= ({classes}) => {
        return(
          <React.Fragment>
          <div className={classes.userArea}>
          <div className={classes.heading}>
            Buy Tickets Form
          </div>
          <div className={classes.container}>
            <form onSubmit={this.handleSubmit}>
              <div className={classes.row}>
                <div className={classes.col25}>
                  <label className={classes.label}>Your Wallet Address:</label>
                </div>
                <div className={classes.col75}>
                  <label className={classes.label2}>
                  {wallet.getAddressFromScriptHash(
                    u.reverseHex(this.props.userAddress))}
                    </label>
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.col25}>
                  <label className={classes.label}>Event Category:</label>
                </div>
                <div className={classes.col75}>
                  <label className={classes.label2}>
                  {this.state.currentCat}
                    </label>
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.col25}>
                  <label className={classes.label}>Event Title:</label>
                </div>
                <div className={classes.col75}>
                  <label className={classes.label2}>
                  {this.state.currentTitle}
                    </label>
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.col25}>
                  <label className={classes.label}>Ticket Price (MCT):</label>
                </div>
                <div className={classes.col75}>
                  <label className={classes.label2}>
                  {this.state.currentPrice}
                    </label>
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.col25}>
                  <label className={classes.label}>Available Tickets:</label>
                </div>
                <div className={classes.col75}>
                  <label className={classes.label2}>
                  {this.state.currentAvail}
                    </label>
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.col25}>
                  <label className={classes.label}>Number of Tickets:</label>
                </div>
                <div className={classes.col75}>
                  <input className={classes.input}
                    type="text" id="tickets"
                    name="tickets"
                    placeholder="Enter number of tickets you want to buy..."
                    value={this.state.tickets}
                    onChange={this.handleChange}
                    required />
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.col25}>
                  <label className={classes.label}>Enter Password:</label>
                </div>
                <div className={classes.col75}>
                  <input className={classes.input}
                    type="password" id="password"
                    name="password"
                    placeholder="Enter a unique Password for your ticket order..."
                    value={this.state.password}
                    onChange={this.handleChange}
                    required />
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.col25}>
                  <label className={classes.label}>Total Price (MCT):</label>
                </div>
                <div className={classes.col75}>
                  <label className={classes.label2}>
                  {this.state.totalPrice}
                    </label>
                </div>
              </div>


              <div className={classes.row}>
                  <input className={classes.submit_btn}
                    type="submit" value="Buy Tickets" />
              </div>

            </form>
          </div>
          </div>

          <div className={classes.buttonArea}>
          <button className={classes.homeButton} onClick={() => {
            this.props.clickHandler("default")
          }}>Home</button>
          </div>
          </React.Fragment>
        );
      }


  render() {
    const { classes } = this.props;
    if(this.state.changeState === "buy"){
      return this.callBuy({classes});
    } else {
      return this.callMain({classes});
    }

  }
}

BuyTickets.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  handleInvoke: PropTypes.func.isRequired,
  handleGetStorage: PropTypes.func.isRequired
};

export default injectNOS(injectSheet(styles)(BuyTickets));
