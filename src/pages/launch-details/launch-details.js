import React, { Component } from 'react';
import { object } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import launchData from '../../data/launches.json';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
  pageTitle: {
    marginTop: theme.spacing.unit * 2,
  },
  card: {
    height: '100%',
    margin: `0 ${theme.spacing.unit}px`,
  },
  payloadCard: {
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center',
  },
  media: {
    height: 300,
  },
  orderActions: {
    justifyContent: 'center',
  },
  orderButton: {
    minWidth: 300,
  },
});

class LaunchDetails extends Component {
  static propTypes = {
    classes: object.isRequired,
  };

  renderLaunchCard(launch) {
    const { classes } = this.props;
    return (
      <Card classes={{ root: classes.card }}>
        <CardMedia
          className={classes.media}
          image={`${process.env.PUBLIC_URL}/${launch.lsp.icon}`}
          title={launch.rocket.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5">
            {launch.name}
          </Typography>
          <Typography component="p">
            Window start: <b>{launch.windowstart}</b>
          </Typography>
          <Typography component="p">
            Window start: <b>{launch.windowend}</b>
          </Typography>
          <Typography component="p">
            Orbit: <b>{launch.orbit}</b>
          </Typography>
          <Typography gutterBottom variant="h6">
            Mission
          </Typography>
          <Typography component="p">
            {launch.missions.map(mission => mission.description)}
          </Typography>

          <Typography gutterBottom variant="h6">
            Service provider
          </Typography>
          <Typography component="p">
            Name: {launch.lsp.name}
          </Typography>
          <Typography component="p">
            Country: {launch.lsp.countryCode}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" target="_blank" href={launch.lsp.wikiURL}>
            Learn more about LSP
          </Button>
        </CardActions>
      </Card>
    );
  }

  renderLaunchPadCard(launch) {
    const { classes } = this.props;

    return (
      <Card classes={{ root: classes.card }}>
        <CardMedia
          className={classes.media}
          image={`${process.env.PUBLIC_URL}/google_maps.png`}
          title={launch.location.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5">
            {launch.location.name}
          </Typography>
          <Typography component="p">
            Country: {launch.location.countryCode}
          </Typography>
          <Typography gutterBottom variant="h5">
            Pads
          </Typography>
          {launch.location.pads.map(pad => (
            <div key={pad.id}>
              <Typography component="p">
                Name: {pad.name}
              </Typography>
              <Typography component="p">
                Latitude: {pad.latitude}
              </Typography>
              <Typography component="p">
                Longitude: {pad.longitude}
              </Typography>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  renderRocketCard(launch) {
    const { classes } = this.props;

    return (
      <Card classes={{ root: classes.card }}>
        <CardMedia
          className={classes.media}
          image={launch.rocket.imageURL}
          title={launch.rocket.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5">
            {launch.rocket.name}
          </Typography>
          <Typography component="p">
            Configuration: {launch.rocket.configuration}
          </Typography>
          <Typography component="p" gutterBottom>
            Family name: {launch.rocket.familyname}
          </Typography>
          <Typography gutterBottom variant="h6">
            Flight record
          </Typography>
          <CircularProgress
            variant="static"
            size={100}
            value={90}
          />
          <Typography variant="body2" component="p">
            Flights 54/60
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" target="_blank" href={launch.rocket.wikiURL}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    );
  }

  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  renderPayloadCard(launch) {
    const { classes } = this.props;
    const payloadUsed = (launch.payload.total - launch.payload.freeForOrder) / launch.payload.total;

    return (
      <Card classes={{ root: classes.payloadCard }}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            Payload status
          </Typography>
          <CircularProgress
            variant="static"
            size={200}
            value={Math.floor(payloadUsed * 100)}
          />
          <Typography variant="h4">
            Payload available (kg) {launch.payload.freeForOrder}/{launch.payload.total}
          </Typography>
        </CardContent>
        <CardActions classes={{ root: classes.orderActions }}>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            classes={{ root: classes.orderButton }}
            disabled={launch.payload.freeForOrder === 0}
            onClick={this.handleClickOpen}
          >
            Request payload allowance
          </Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title" >
            <DialogTitle id="form-dialog-title">Payload</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To get an offer for this launch, please fill the form and enter your email address here. We will send
                updates occasionally.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="fullname"
                label="Full Name"
                type="text"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="phone"
                label="Phone Number"
                type="text"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="payloadInfo"
                label="Payload Weight"
                type="text"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="aditionalInfo"
                label="Additional Info"
                type="text"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleClose} color="primary">
                Send
              </Button>
            </DialogActions>
          </Dialog>
        </CardActions>
      </Card>
    );
  }

  render() {
    const { match, classes } = this.props;
    const launch = launchData.find(data => data.id === Number(match.params.launchId));

    return (
      <div>
        <Typography variant="h2" gutterBottom classes={{ root: classes.pageTitle }}>
          {launch.name}
        </Typography>
        <Grid container>
          <Grid item xs={4}>
            {this.renderLaunchCard(launch)}
          </Grid>
          <Grid item xs={4}>
            {this.renderLaunchPadCard(launch)}
          </Grid>
          <Grid item xs={4}>
            {this.renderRocketCard(launch)}
          </Grid>
          <Grid item xs={12}>
            {this.renderPayloadCard(launch)}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(LaunchDetails));
