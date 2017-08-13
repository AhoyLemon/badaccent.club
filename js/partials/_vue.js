// jshint -W117
var app = new Vue({
  el: '#app',
  data: {
    phase: 'quote',
    device: '',
    browser: '',
    current: {
      quote: '',
      accent: '',
      choices: [],
      badguess: '',
      gameover: false,
      correctMessage: ""
    },
    previous: {
      quotes: [],
      accents: [],
      reRoll: 0
    },
    guesses: [false,false,false,false],
    sidebarVisible: false,
    addToHomescreen: false
  },
  methods: {
    newRound: function() {
      this.previous.reRoll = 0;
      this.getQuote();
      this.previous.reRoll = 0;
      this.getAccent();
      this.current.choices = [this.current.accent];
      this.defineChoices();
      this.previous.quotes.push(this.current.quote);
      this.previous.accents.push(this.current.accent);
      this.phase = 'quote';
    },
    getQuote: function() {
      var rQ = Math.floor(Math.random() * allQuotes.length);
      this.current.quote = allQuotes[rQ].text;
      if (this.previous.quotes.includes(this.current.quote)) {
        this.previous.reRoll++;
        if (this.previous.reRoll < 5) {
          this.getQuote();
        } else {
          this.phase = "game over";
          this.current.gameover = "(we ran out of quotes)";
        }
      } else {
        this.current.cite = allQuotes[rQ].cite;
      }
    },
    getAccent: function() {
      var rA = Math.floor(Math.random() * allAccents.length);
      this.current.accent = allAccents[rA].pick;
      if (this.previous.accents.includes(this.current.accent)) {
        this.previous.reRoll++;
        if (this.previous.reRoll < 5) {
          this.getAccent();
        } else {
          this.phase = "game over";
          this.current.gameover = "(we ran out of accents)";
        }
      } else {
        // Do nothing
      }
    },
    defineChoices: function() {
      var rA = Math.floor(Math.random() * allAccents.length);
      var newChoice = allAccents[rA].pick;
      if (this.current.choices.includes(newChoice)) {
        this.defineChoices();
      } else {
        this.current.choices.push(newChoice);
      }
      if (this.current.choices.length < 4) {
        this.defineChoices();
      } else {
        shuffle(this.current.choices);
      }
    },
    getCorrectMessage: function() {
      var correctMessages = [
        "That was supposed to be a "+this.current.accent+" accent.",
        "Apparently that was a "+this.current.accent+" accent.",
        "That was a "+this.current.accent+" accent, I guess?",
        "Your friend was trying a "+this.current.accent+" accent."
      ];
      var rM = Math.floor(Math.random() * correctMessages.length);
      this.current.correctMessage = correctMessages[rM];
    },
    getWrongMessage: function(guess) {
      var wrongMessages = [
        "Nope, not "+guess+".",
        "No, that wasn't "+guess+".",
        "No, not "+guess+".",
        guess+"? No.",
        "You think it was "+guess+"? No.",
        "That wasn't "+guess+".",
        guess+"? Guess again",
        "Definitely not "+guess+".",
        "It wasn't "+guess+".",
        "You think that was "+guess+"? Guess again.",
        "You thought it sounded like "+guess+"? No.",
        "Did it actually sound "+guess+"? No.",
        "You think "+guess+"? No."
      ];
      var rM = Math.floor(Math.random() * wrongMessages.length);
      this.current.badguess = wrongMessages[rM];
    },
    accentGuess: function(guess,num) {
      if (guess != this.current.accent) {
        this.guesses[num] = true;
        this.getWrongMessage(guess);
        //event.target.disabled = true;
        //this.current.badguess = "Nope, not "+guess+".";
      } else {
        this.getCorrectMessage();
        this.guesses = [false,false,false,false];
        this.current.badguess = "";
        this.phase = "correct";
      }
    },
    toggleSidebar: function() {
      if (this.sidebarVisible === true) {
        this.sidebarVisible = false;
      } else {
        this.sidebarVisible = true;
      }
    },
    iOScheck: function() {
      if (this.device == 'ios') {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted: function() {
    this.newRound();
    var ua = navigator.userAgent.toLowerCase();
    console.log(ua);
    
    if (ua.indexOf("android") > -1) {
      this.device = "android";
      if (ua.indexOf("firefox") > -1) {
        // Android Firefox
        this.browser="firefox";
      } else if (ua.indexOf("opr") > -1) {
        // Android Opera
        this.browser="opera";
      } else if (ua.indexOf("chrome") > -1) {
        // Android Chrome
        this.browser="chrome";
      }
    } else if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1) {
      this.device = "ios";
    } else if (ua.indexOf('windows') > -1) {
      this.device = "windows";
      if (ua.indexOf("edge") > -1) {
        this.browser = "edge";
      } else if (ua.indexOf("trident") > -1) {
        this.browser = "ie";
      } else if (ua.indexOf('firefox') > -1) {
        this.browser = "firefox";
      } else if (ua.indexOf('opr') > -1) {
        this.browser = "opera";
      } else if (ua.indexOf('chrome') > -1) {
        this.browser = "chrome";
      }
    } else if (ua.indexOf('mac') > -1) {
      this.device = "mac";
      
      if (ua.indexOf('chrome') > -1) {
        this.browser = "chrome";
      } else if (ua.indexOf('safari') > -1) {
        this.browser = "safari";
      } else if (ua.indexOf('firefox') > -1) {
        this.browser = "firefox";
      }
    } else if (ua.indexOf('cros') > -1) {
      this.device = "chrome";
      this.browser = "chrome";
    }
    console.log('device: '+device+'. browser:'+browser);
  }
});