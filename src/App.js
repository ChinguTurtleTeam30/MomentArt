import React, { Component } from 'react';
// can we put all the css in one folder and have App import the whole folder?
import './App.css';
import './open-weather-icons/dist/css/open-weather-icons.css'
import './font-awesome/css/font-awesome.min.css'
import Art from './art';
import Clock from './clock';
import Goal from './goal';
import Links from './links';
import Timer from './timer';
import Todo from './todo';
import Settings from './settings';
import Weather from './weather';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        username: '' ,
        show: {
          Links: false,
          Bookmarks: false,
          MostVisited: false,
          RecentlyVisited: false,
          Weather: true,
          Todo: false,
          Quote: false,
          Greeting: false,
          Clock: true,
          Timer: true,
          Goal: true,
          staticBG: false,
        },
        weatherUnits: 'imperial',
        weatherLocation: '',
        setLocationAsDefault: false,
        clockFormat: '12hr',
        showAM_PM: false,
        timezone: '',
        setTimezoneAsDefault: false,
        timerFormat: '12hr',
        timerInputType: 'calendar',
        saveCountdown: true,
      },
      currentTime: new Date(),
      endTime: null,
      countdown: 0,
      timeIsUp: false,
      localStorageAvailable: this.storageAvailable(localStorage),
      sessionStorageAvailable: this.storageAvailable(sessionStorage),
    };
  }

  //test for availability of Storage
  storageAvailable(type) {
    const storage = window[type];
    try {
      let x = '___storageTest___';
      storage.setItem(x, x);
      x = storage.getItem(x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return e instanceof DOMException && (
        e.code === 22 ||
        e.code === 4012 ||
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ) &&
        storage.length !== 0;
    }
  }

  // storage functions
  store(prop, val) {
    if (this.state.localStorageAvailable) {
      const storage = window.localStorage;
      return storage.setItem(prop, val ? val : this.state[prop]);
    }
    else return;
  }

  unstore(prop) {
    if (this.state.localStorageAvailable) {
      const storage = window.localStorage;
      return storage.removeItem(prop);
    }
    else return;
  }

  checkStorage(type, key) {
    const storage = window[type];
    // this is problematic because key: val might be 0, null, etc.
    return Boolean(storage.getItem(key));
  }

  // checking for availability of storage only seems to work with compWillMt()
  // not within the constructor
  componentWillMount() {
    this.setState({ localStorageAvailable: this.storageAvailable('localStorage'),
                    sessionStorageAvailable: this.storageAvailable('sessionStorage')
                  });
  }

  // event handlers
  handleClick(event) {
    // currently uses the parentEl, which seems clumsy and fraught
    // find a way to make click target desired element
    if (event.target.dataset.settingsrole === 'toggle' ||
        event.target.parentElement.dataset.settingsrole === 'toggle') {
      const target = event.target.dataset.togglefor ? event.target :
                    event.target.parentElement,
            setting = target.dataset.togglefor;
      //console.log(setting);
      this.setState((prevState) => {
        const prevSettings = setting in prevState.settings ?
          prevState.settings : prevState.settings.show;
        Object.assign(prevSettings, { [setting]: !prevSettings[setting] });
        return prevSettings;
      });
    }
  }

  // fcns for Clock
  runClock() {
    this.clockID = setInterval(() => {
      this.setState({ currentTime: new Date() })
    }, 1000);
  }

  componentDidMount() {
    this.runClock();
    if (window.localStorage.getItem('goal')) {
      this.setState({ goal: window.localStorage.getItem('goal') });
    }
  }
  /*<Center localStorageAvailable={ this.state.localStorageAvailable }
          handleClick={ (event) => this.handleClick(event) }
          username={ this.state.username }
          store={ (key, val) => this.store(key,val) }
          unstore={ (key) => this.unstore(key) }
          checkStorage={ (key) => this.checkStorage('localStorage', key) }
  />*/

  render() {
    return (
      <div className="App">
        <div className="main center">
          { this.state.settings.show.Clock ?
            <Clock
              currentTime={ this.state.currentTime }
            /> : null }
          { this.state.settings.show.Timer ?
            <Timer
              currentTime={ this.state.currentTime }
            /> : null }
          { this.state.settings.show.Goal ? <Goal
              localStorageAvailable={ this.state.localStorageAvailable }
              store={ (key, val) => this.store(key,val) }
              unstore={ (key, val) => this.unstore(key) }
            /> :
            null }
        </div>
        <div className="top left corner">
          <Links />
        </div>
        <div className="top right corner">
          <Weather />
        </div>
        <div className="bottom right corner">
          <Todo localStorageAvailable={ this.state.localStorageAvailable }
                store={ (key, val) => this.store(key, val) }
                unstore={ (key) => this.unstore(key) }
          />
        </div>
        <div className="bottom left corner">
          <Settings handleClick={ (event) => this.handleClick(event) }
                    localStorageAvailable={ this.state.localStorageAvailable }
                    sessionStorageAvailable={ this.state.sessionStorageAvailable }
                    settingsState={ this.state.settings }
          />
        </div>
        <Art />
      </div>
    );
  }
}

export default App;
