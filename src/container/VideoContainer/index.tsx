import * as React from 'react';
import { OTPublisher, OTSubscriber, createSession } from 'opentok-react';
import { Grid } from 'semantic-ui-react';
import { RouteChildrenProps } from 'react-router';

// const BASE_URL = "https://mysterious-peak-77536.herokuapp.com"
const BASE_URL = " https://e8148f1f.ngrok.io";
interface Props {
  
}

type IVideContainerProps = RouteChildrenProps & Props;
interface State {
  error: any;
  connection: string;
  publishVideo: boolean;
  isClientOffline?: boolean;
  isPublisherOffline?: boolean;
  message?: string;
  streams: any;
  loading: boolean;
}
export default class VideContainer extends React.Component<IVideContainerProps, State> {
  private sessionHelper: any = null;
  private publisherEventHandlers;
  private subscriberEventHandlers;
  constructor(props: IVideContainerProps) {
    super(props);

    this.state = {
      error: null,
      connection: 'Connecting',
      publishVideo: true,
      streams: [],
      loading: true
    };

    this.publisherEventHandlers = {
      accessDenied: () => {
        console.log('User denied access to media source');
      },
      streamCreated: () => {
        console.log('Publisher stream created');
      },
      streamDestroyed: (event) => {
        console.log("publisher_event", event)
      }
    };

    this.subscriberEventHandlers = {
      videoEnabled: () => {
        console.log('Subscriber video enabled');
      },
      videoDisabled: () => {
        console.log('Subscriber video disabled');
      },
      streamDestroyed: (event) => {
        console.log("subscriber_event", event)
      }
    };
  }

  onSessionError = (error) => {
    this.setState({ error });
  };

  onPublish = () => {
    console.log('Publish Success');
  };

  onPublishError = (error) => {
    this.setState({ error: error.code });
  };

  onSubscribe = () => {
    console.log('Subscribe Success');
  };

  onSubscribeError = (error: any) => {
    this.setState({ error: error.code });
  };

  toggleVideo = () => {
    this.setState({ publishVideo: !this.state.publishVideo });
  };

  verify = (connectionId: string) => {
    // let self = this;
    fetch(`${BASE_URL}/connectionVerified`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        connectionId
      })
    })
    .then(function (res: any) {
      return res.json()
    })
    .catch(err => {
      console.log("err", err)
    })
  }

  verifyConnection = (connectionId: string) => {
    let self = this;
    self.verify(connectionId)
  }

  componentDidMount() {
    let self = this;
    fetch(`${BASE_URL}`, { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json'
      } 
    })
    .then(function (res: any) {
      return res.json()
    })
    .then(function (json: any) {
      self.sessionHelper = createSession({
        apiKey: json.apiKey,
        sessionId: json.sessionId,
        token: json.token,
        onStreamsUpdated: streams => { 
          console.log("Streams", streams)
          self.setState({ streams }); 
        }
      })
      self.sessionHelper.session.on({
        "signal:streamTemporarilyDisconnected": function(event: any) {
          let data = JSON.parse(event.data);
          if (data.connectionId !== self.sessionHelper.session.connection.id) {
            alert(`${data.streamName} has lost internet connection`);
          }
        },
        "signal:streamReconnected": function(event: any) {
          let data = JSON.parse(event.data);
          if (data.connectionId !== self.sessionHelper.session.connection.id) {
            alert(`${data.streamName} has reconnected`);
          }
        },
        "signal:verifyConnection": function(event: any) {
          console.log("date", new Date().toString());
          let data = JSON.parse(event.data);
          self.verifyConnection(data.connectionId)
        },
        "streamDestroyed": function (event: any) {
          event.preventDefault();
          console.log("Stream " + event.stream.name + " ended. " + event.reason)
          console.log("event", event);
          alert(`${event.stream.name} ended - ${event.reason}`);
        },
      })
      self.setState({ loading: false });
    })
  }

  componentWillUnmount() {
    this.sessionHelper.disconnect();
  }

  render() {
    const { publishVideo } = this.state;
    const streamName = this.props.location.pathname.split('/')[1]; 
    if (this.state.loading) return true;
    if (!this.sessionHelper) return null;
    return (
      <div>
          <Grid>
            <Grid.Row>
              <Grid.Column width={6}>
                <OTPublisher
                  properties={{ publishVideo, width: "100%", height: "300px", name: streamName }}
                  session={this.sessionHelper.session}
                  eventHandlers={this.publisherEventHandlers}
                />
              </Grid.Column>
              <Grid.Column width={6}>
                {this.state.streams.map(stream => {
                  return (
                    <OTSubscriber
                      key={stream.id}
                      session={this.sessionHelper.session}
                      stream={stream}
                      eventHandlers={this.subscriberEventHandlers}
                    />
                  );
                })}
              </Grid.Column>
            </Grid.Row>
          </Grid>
      </div>
    );
  }
}