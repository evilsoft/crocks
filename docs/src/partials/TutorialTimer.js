'use strict';

import Component from 'metal-component';
import Soy from 'metal-soy';
import moment from 'moment';
import {addClasses, hasClass} from 'metal-dom';

import templates from './TutorialTimer.soy';

class TutorialTimer extends Component {
  attached() {
    this.time = this.calculateTimeRemaining();
  }

  calculateTimeRemaining() {
    let timeRead = 0;
    let totalTime = 0;
    let indexSelected = -1;

    let sidebar = document.querySelector('.sidebar');
    let sidebarLinks = Array.prototype.slice.call(sidebar.querySelectorAll('.sidebar-link'));

    sidebarLinks.forEach((item, i) => {
      let time = parseInt(item.dataset.time || 0);

      totalTime += time;

      if (hasClass(item, 'sidebar-link-selected')) {
        indexSelected = i;
      }

      if (indexSelected === -1) {
        addClasses(item, 'sidebar-link-read');
        timeRead += time;

        return;
      }
    });

    let milliseconds = (totalTime - timeRead);
    let eventDuration = moment.duration(milliseconds, 'seconds');

    return this.humanizeDuration(eventDuration);
  }

  humanizeDuration(eventDuration) {
    var eventDurationString = '';

    if (eventDuration.days() > 0) {
      eventDurationString += ' ' + moment.duration(eventDuration.days(), 'days').asDays() + 'd';
    }

    if (eventDuration.hours() > 0) {
      eventDurationString += ' ' + moment.duration(eventDuration.hours(), 'hours').asHours() + ' h';
    }

    if (eventDuration.minutes() > 0) {
      eventDurationString += ' ' + moment.duration(eventDuration.minutes(), 'minutes').asMinutes() + ' min';
    }

    if (eventDuration.seconds() > 0) {
      eventDurationString += ' ' + moment.duration(eventDuration.seconds(), 'seconds').asSeconds() + ' sec';
    }

    return eventDurationString.trim();
  }
};

TutorialTimer.STATE = {
  time: {
    value: null
  }
}

Soy.register(TutorialTimer, templates);

export default TutorialTimer;
