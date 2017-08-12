import React, { Component } from 'react';

class Clock extends Component {
  constructor() {
    super();
    this.state = {
      curTime: new Date(),
      endTime: null,
      countdown: null,
      intervalID: null,
    };
  }

  renderTime() {
    const now = this.state.curTime.toLocaleTimeString();
    return now.match(/^\d{1,2}:\d{2}/)[0];
  }

  //start clock on load
  componentDidMount() {
    setInterval(() => {
      this.setState({ curTime: new Date()})
    }, 1000);
  }

  handleChange(event) {
    this.setState({ endTime: new Date(this.jsFormatDate(event.target.value)) });
  }

  handleClick(event) {
    clearInterval(this.state.intervalID);
    this.setState({ intervalID: null });
    if(event.target.name === 'reset') {
      this.setState({ countdown: null });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if(!this.state.countdown) {
      this.setState({
        countdown: (this.state.endTime - this.state.curTime)/1000
      });
    }
    if(!this.state.intervalID) {
      this.setState({ intervalID: setInterval(() => this.runTimer(), 1000) });
    }
  }

  jsFormatDate(htmlDateFormat) {
    //split up html date string
    //into format [yyyy, mm, dd, hh, mm]
    //and input it into new JS Date obj
    const htmlDateArr =
      htmlDateFormat
        .match(/^(\d{4})(?:-)(\d{2})(?:-)(\d{2})(?:T)(\d{2})(?::)(\d{2})/),
      jsDate = new Date(htmlDateArr[1], htmlDateArr[2] - 1, htmlDateArr[3],
        htmlDateArr[4], htmlDateArr[5]);
    return jsDate;
  }

  runTimer() {
    const count = Math.round(this.state.countdown - 1);
    this.setState({ countdown: count });

    /*const curCount = this.renderCountdown(this.state.countDown);
    this.setState({
      countDown: curCount ? curCount : "Time's up!"
    });*/
  }

  renderCountdown(count) {
    const s = count%60;
    count = (count - s)/60;
    const m = count%60;
    count = (count - m)/60;
    const h = count%24,
          d = (count - h) / 24,
          displayCount = [d, h, m, Math.round(s)].map(function(val, i, arr) {
            if(val) {
              if(arr[i - 1]) {
                return val < 10 ? '0' + val : val;
              }
              else return val;
            }
            else if(arr[i - 1]) {
              return '00';
            }
            else return null;
          }).filter(function(val) {
            return val && val >= 0;
          });

    return displayCount.join(':');
  }

  render() {
    return (
      <div className="clock">
        <p className="time">
          { this.renderTime() }
        </p>
        <Timer
          initTime={ new Date() }
          onChange={ (event) => this.handleChange(event) }
          onClick={ (event) => this.handleClick(event) }
          onSubmit={ (event) => this.handleSubmit(event) }
          countdown={ this.renderCountdown(this.state.countdown) }
        />
      </div>
    )
  }
}

class Timer extends Component {
  htmlFormatDate(jsDateFormat) {
    //split up js date string
    //into format [(m)m, (d)d, yyyy, (h)h, mm, ss, "am"/"pm"]
    //and make it a string in the html date format
    const jsDateArr =
            jsDateFormat
              .toLocaleString()
              .match(/^(\d{1,2})(?:\/)(\d{1,2})(?:\/)(\d{4})(?:,\s)(\d{1,2})(?::)(\d{2})(?::)(\d{2})(?:\s)([ap]m)/i),
          htmlDateStr = jsDateArr[3] + '-' +
            (jsDateArr[1].length < 2 ? '0' + jsDateArr[1] : jsDateArr[1]) +
            '-' +
            (jsDateArr[2].length < 2 ? '0' + jsDateArr[2] : jsDateArr[2]) +
            'T' + to24hr(jsDateArr[4], jsDateArr[7]) + ':' + jsDateArr[5];

    function to24hr(hours, ampm) {
      if (hours !== '12') {
        return ampm === 'am' ? hours : +hours + 12;
      }
      else return ampm === 'am' ? '00' : hours;
    }

    return htmlDateStr
  }

  render() {
    return (
      <div className="timer">
        <p className="countdown">{ this.props.countdown }</p>
        <form className="timer-form" onSubmit={ (event) => this.props.onSubmit(event) }>
          <input type="datetime-local" defaultValue={ this.htmlFormatDate(this.props.initTime) } onChange={ (event) => this.props.onChange(event) } />
          <input id="start-timer" name="start" type="submit" value="start" />
          <input id="stop-timer" name="stop" type="button" value="stop" onClick={ (event) => this.props.onClick(event) } />
          <input id="reset-timer" name="reset" type="button" value="reset" onClick={ (event) => this.props.onClick(event) } />
        </form>
      </div>
    )
  }
}

export default Clock;
export { Timer };
