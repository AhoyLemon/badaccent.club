// jshint -W117
var app = new Vue({
  el: '#app',
  data: {
    phase: 'quote',
    current: {
      quote: '',
      accent: '',
      choices: [],
      badguess: ''
    },
    previous: {
      quotes: [],
      accents: [],
      reRoll: 0
    },
    guesses: [false,false,false,false]
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
          alert('GAME OVER (OUT OF QUOTES)');
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
          alert('GAME OVER (OUT OF ACCENTS)');
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
    accentGuess: function(guess,num) {
      if (guess != this.current.accent) {
        this.guesses[num] = true;
        //event.target.disabled = true;
        this.current.badguess = "Nope, not "+guess+".";
      } else {
        this.guesses = [false,false,false,false];
        this.current.badguess = "";
        this.phase = "correct";
      }
    }
  },
  mounted: function() {
    this.newRound();
  }
});