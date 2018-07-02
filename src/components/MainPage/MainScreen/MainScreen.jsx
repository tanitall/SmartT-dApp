import React, {Component} from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { react } from "@nosplatform/api-functions";
import { u, wallet } from "@cityofzion/neon-js";
import { unhexlify, hexlify }  from "binascii";

import MainTitle from "./MainTitle";
import Button from "./Button";
import BuyTickets from "./../buyTickets/BuyTickets";
import ApplyWhitelisting from "./../applyWhitelisting/ApplyWhitelisting";


const { injectNOS, nosProps } = react.default;


const styles = {
  middleCol: {
      height: "100%",
      float: "left",
      width: "75%",
      paddingTop: 0,
      background: "#2c3f50"
  },

  middleCol_Center: {
    height: "93%"
  },

  buttonsContainer: {
    width: "70%",
    height: "100%",
    paddingLeft: "20px",
    marginLeft: "15%"

  },
  img: {
    margin: "0px",
    padding: "0px",
    width: "60px",
    height: "60px"
  },

  applyWL_userArea: {
    height: "100%",
    overflow: "auto",
    border: "solid"

  },
  applyWL_formArea: {
    paddingTop: "80px",
    marginLeft:"250px"

  },
  applyWL_formLabel: {
    color: "#fff",
    paddingRight: "10px"
  },
  applyWL_formInput: {
    margin: "30px"
  }

};

class MainScreen extends Component {
      handleAlert = async func => alert(await func);

      handleGetStorage = async (scriptHash, key, encodeInput, decodeOutput)
          => this.props.nos
               .getStorage({ scriptHash, key, encodeInput, decodeOutput})
               .catch(err => alert('Error: ${err.message}'));

      handleInvoke = async (scriptHash, operation, args, encodeArgs)
          => this.props.nos
               .invoke({ scriptHash, operation, args, encodeArgs })
               .then(txid => alert(`Invoke txid: ${txid} `))
               .catch(err => alert('Error: ${err.message}'));

      // handleGetAddress = async () => alert(await this.props.nos.getAddress());

      handleClaimGas = () =>
        this.props.nos
          .claimGas()
          .then(alert)
          .catch(alert);


      getDateTime = unixTimestamp => {
          const date = new Date(unixTimestamp * 1000);
          const hours = date.getHours();
          const minutes = `0${date.getMinutes()}`;
          const seconds = `0${date.getSeconds()}`;
          return `${date.toLocaleDateString()} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
      };



      deserialize = rawData => {

      const rawSplitted = rawData.match(/.{2}/g);

      const arrayLen_outer = parseInt(rawSplitted[1], 16);
      let offset = 2;
      const rawArray_outer = [];

      for (let j=0; j < arrayLen_outer; j += 1) {
        const arrayLen = parseInt(rawSplitted[offset+1], 16);

        offset = offset + 2;
        const rawArray = [];

      for (let i = 0; i < arrayLen; i += 1) {

        const itemType = parseInt(rawSplitted[offset], 16);
        offset += 1;

        let itemLength = parseInt(rawSplitted[offset], 16);
        offset += 1;
        if (itemLength === 253) {
          itemLength = parseInt(
            u.reverseHex(
              this.concatBytes(rawSplitted, offset, offset + 2)), 16);

          offset += 2;

        } else if (itemLength === 254) {
          itemLength = parseInt(
            u.reverseHex(
              this.concatBytes(rawSplitted, offset, offset + 2)), 16);

          offset += 4;

        } else if (itemLength === 255) {
          itemLength = parseInt(
            u.reverseHex(
              this.concatBytes(rawSplitted, offset, offset + 2)), 16);

          offset += 8;

        } else {

        }

        let data = this.concatBytes(rawSplitted, offset, itemLength + offset);


        if (i === 6 || i === 5) {
            data = parseInt(u.reverseHex(data),16)

        } else if (i === 0) {

            data = data;

        } else {

            data = u.hexstring2str(data);

        }
        rawArray.push(data);
        offset = itemLength + offset;

      }
      rawArray_outer.push(rawArray)
    }

      return rawArray_outer;
    };


    concatBytes = (source, start, length) => {
      let temp = "";
      for (let i = start; i < length; i += 1) temp += source[i];
      return temp;
    };


    state = {
          buy: "buy",
          buyState: false,
          my: "my",
          myState: false,
          refund: "refund",
          refundState: false,
          checkin: "checkin",
          checkinState: false,
          applyWL:"applyWL",
          applyWLState: false,
          events: "events",
          eventsState: false,
          orgWL: "orgWL",
          orgWLState: false,
          advertiser: "advertiser",
          advertiserState: false,
          help: "help",
          helpState: false,

          scriptHash: "c186bcb4dc6db8e08be09191c6173456144c4b8d",
          dappHash: "25aaa448988793758230b8e1f82711a5f4b556c4",
          userAddress: "",
          wlAddress: false,
          wlStatus: false

    }

    componentDidMount() {
      this.props.nos.getAddress().then(address => {
        this.setState({userAddress: u.reverseHex(wallet.getScriptHashFromAddress(address))})
        //console.log(this.state.userAddress)
        //console.log(this.state.scriptHash+hexlify('/st/')+hexlify('applyWhitelist'))

        //console.log(u.int2hex(1530357900))
        //console.log(u.reverseHex(wallet.getScriptHashFromAddress(address)))
      });
    }

    defaultStates = () => {
          this.setState({buyState: false});
          this.setState({myState: false});
          this.setState({refundState: false});
          this.setState({checkinState: false});
          this.setState({applyWLState: false});
          this.setState({eventsState: false});
          this.setState({orgWLState: false});
          this.setState({advertiserState: false});
          this.setState({helpState: false});
          this.setState({wlAddress: false});
          this.setState({wlStatus: false});
    }

    changeStates = (e) => {
          this.defaultStates();
          if(e === "buy"){
              var statechnaged = !this.state.buyState;
              this.setState({buyState: statechnaged});
          }
          if(e === "my"){
              this.setState({myState: true});
          }
          if(e === "refund"){
              this.setState({refundState: true});
          }
          if(e === "checkin"){
              this.setState({checkinState: true});
          }
          if(e === "applyWL"){
            var getData;
            getData=this.handleGetStorage(this.state.scriptHash,
              this.state.dappHash+hexlify('/st/applyWhitelist'),
              false, false);
              Promise.resolve(getData).then(r => {
                //console.log(r)
                let deserialized = []
                deserialized = this.deserialize(r);
                var i;
                for(i = 0; i < deserialized.length; i++){
                  if(deserialized[i][0]==this.state.userAddress){
                    this.setState({wlAddress: true})
                    console.log(deserialized[i])
                    if(deserialized[i][6]===1) {
                      this.setState({wlStatus: true})
                      console.log("Already approved!")
                    } else {
                      console.log("Not approved yet!")
                    }
                    console.log(this.state.wlAddress);
                    console.log(this.state.wlStatus);
                    break;
                  }
                }
              });

            this.setState({applyWLState: true});
          }
          if(e === "events"){
              this.setState({eventsState: true});
          }
          if(e === "orgWL"){
              this.setState({orgWLState: true});
          }
          if(e === "advertiser"){
              this.setState({advertiserState: true});
          }
          if(e === "help"){
              this.setState({helpState: true});
          }

    }

    callMain = ({classes, nos}) => {
      var getData="";
      return(
          <div className={classes.middleCol}>
            <MainTitle>SmartT Main Page</MainTitle>
            <div className={classes.middleCol_Center}>
              <div className={classes.buttonsContainer}>
                <Button clickHandler = {this.changeStates}
                  title="Buy Tickets"
                  check={this.state.buy}>
                  <img className={classes.img}
                    src={require('./../../../img/user.png')} />
                </Button>

                <Button clickHandler = {this.changeStates}
                  check={this.state.my}
                  title="My Tickets">
                  <img className={classes.img}
                    src={require('./../../../img/organiser.png')} />
                </Button>

                <Button clickHandler = {this.changeStates}
                  check={this.state.refund}
                  title="Refund Tickets">
                  <img className={classes.img}
                    src={require('./../../../img/whitelist.png')} />
                </Button>

                <Button clickHandler = {this.changeStates}
                  check={this.state.checkin}
                  title="Check-in Tickets">
                  <img className={classes.img}
                    src={require('./../../../img/advertise.png')} />
                </Button>

                <Button clickHandler = {this.changeStates}
                  check={this.state.applyWL}
                  title="Apply Whitelisting">
                  <img className={classes.img}
                    src={require('./../../../img/about.png')} />
                </Button>

                <Button clickHandler = {this.changeStates}
                  check={this.state.events}
                  title="Crete Events">
                  <img className={classes.img}
                    src={require('./../../../img/help.png')} />
                </Button>

                <Button clickHandler = {this.changeStates}
                  check={this.state.orgWL}
                  title="Whitelist Organizers">
                  <img className={classes.img}
                    src={require('./../../../img/help.png')} />
                </Button>

                <Button clickHandler = {this.changeStates}
                  check={this.state.advertiser}
                  title="Advertisement">
                  <img className={classes.img}
                    src={require('./../../../img/help.png')} />
                </Button>

                <Button clickHandler = {this.changeStates}
                  check={this.state.help}
                  title="Help">
                  <img className={classes.img}
                    src={require('./../../../img/help.png')} />
                </Button>

              </div>
            </div>
          </div>
      );
    }

    callBuy = ({classes, nos}) => {
      return(
        <div className={classes.middleCol}>
          <MainTitle>Buy Tickets</MainTitle>
            <div className={classes.middleCol_Center}>
              <BuyTickets clickHandler = {this.changeStates}
                check={this.state.buy} />
            </div>
        </div>

      );
    }

    callMy = ({classes, nos}) => {
      return(
        <div className={classes.middleCol}>
          <MainTitle>My Tickets</MainTitle>
            <div className={classes.middleCol_Center}>
              <h1>Test my Tickets</h1>
            </div>
        </div>

      );
    }

    callRefund = ({classes, nos}) => {
      return(
        <div className={classes.middleCol}>
          <MainTitle>Refund Tickets</MainTitle>
            <div className={classes.middleCol_Center}>
              <h1>test Refund Tickets</h1>
            </div>
        </div>

      );
    }

    callCheckin = ({classes, nos}) => {
      return(
        <div className={classes.middleCol}>
          <MainTitle>Check-In Tickets</MainTitle>
            <div className={classes.middleCol_Center}>
              <h1>test checkin Tickets</h1>
            </div>
        </div>

      );
    }

    callApplyWL = ({classes, nos}) => {
      return(
        <div className={classes.middleCol}>
          <MainTitle>Apply Whitelisting</MainTitle>
            <div className={classes.middleCol_Center}>
              <ApplyWhitelisting clickHandler = {this.changeStates}
                check={this.state.applyWL}
                scriptHash={this.state.scriptHash}
                dappHash={this.state.dappHash}
                handleInvoke={this.handleInvoke}
                wlAddress={this.state.wlAddress}
                wlStatus={this.state.wlStatus}
                userAddress={this.state.userAddress}
                classes={classes}/>
            </div>
        </div>

      );
    }

    callEvents = ({classes, nos}) => {
      return(
        <div className={classes.middleCol}>
          <MainTitle>Manage Events</MainTitle>
            <div className={classes.middleCol_Center}>
              <h1>test Manage events</h1>
            </div>
        </div>

      );
    }

    callOrgWL = ({classes, nos}) => {
      return(
        <div className={classes.middleCol}>
          <MainTitle>Whitelist Organizers</MainTitle>
            <div className={classes.middleCol_Center}>
              <h1>test Whitelist Organizers</h1>
            </div>
        </div>

      );
    }

    callAdvertiser = ({classes, nos}) => {
      return(
        <div className={classes.middleCol}>
          <MainTitle>Advertisements</MainTitle>
            <div className={classes.middleCol_Center}>
              <h1>test Advertisement</h1>
            </div>
        </div>

      );
    }

    callHelp = ({classes, nos}) => {
      return(
        <div className={classes.middleCol}>
          <MainTitle>Help</MainTitle>
            <div className={classes.middleCol_Center}>
              <h1>test Help</h1>
            </div>
        </div>

      );
    }

    render()
      {

        const { classes, nos } = this.props;
        const { deserialize } = this;

        if(this.state.buyState) {
              return this.callBuy({classes, nos});
        } else if(this.state.myState) {
              return this.callMy({classes, nos});
        } else if(this.state.refundState) {
              return this.callRefund({classes, nos});
        } else if(this.state.checkinState) {
              return this.callCheckin({classes, nos});
        } else if(this.state.applyWLState) {
              return this.callApplyWL({classes, nos});
        } else if(this.state.eventsState) {
              return this.callEvents({classes, nos});
        } else if(this.state.orgWLState) {
              return this.callOrgWL({classes, nos});
        } else if(this.state.advertiserState) {
              return this.callAdvertiser({classes, nos});
        } else if(this.state.helpState) {
              return this.callHelp({classes, nos});
        } else {
            return this.callMain({classes, nos});
        }

      }

}

MainScreen.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosProps.isRequired
};

export default injectNOS(injectSheet(styles)(MainScreen));
