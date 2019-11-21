const moment = require('moment');
const momentTz = require('moment-timezone');
const timeZone = 'Europe/Paris'; //UTC+01:00

// Définition des formats de date du jour courant
const today =  momentTz.tz(new Date(),'YYYY-MM-DD HH:mm:ss',timeZone); //date d'aujourd'hui au format YYYY-MM-DD HH:mm:ss + timezone
const currentYear = today => {
    return moment(today).format('YYYY'); //Ex : 2019
}
const currentDate = today => {
    return moment(today).format('DD MM YYYY'); //Ex: 06 02 2019
};
const currentTime = today => {
    return moment(today).format('HH:mm'); //Ex: 13:35
};

// Calcul des jours fériés selon l'année
moment.fn.paques = function (Y) { //définition du dimanche de paques
      if (Y === undefined) {
        Y = this.year();
      }
      var a = Y % 19;
      var b = Math.floor(Y / 100);
      var c = Y % 100;
      var d = Math.floor(b / 4);
      var e = b % 4;
      var f = Math.floor((b + 8) / 25);
      var g = Math.floor((b - f + 1) / 3);
      var h = (19 * a + b - d - g + 15) % 30;
      var i = Math.floor(c / 4);
      var k = c % 4;
      var l = (32 + 2 * e + 2 * i - h - k) % 7;
      var m = Math.floor((a + 11 * h + 22 * l) / 451);
      var n0 = (h + l + 7 * m + 114);
      var n = Math.floor(n0 / 31) - 1;
      var p = n0 % 31 + 1;
      var date = new Date(Y, n, p);
      return moment(date);
};

moment.fn.lundiDePaques = function (Y) { // = dimanche de paques +1J
      if (Y === undefined) {
        Y = this.year();
      }
      return moment.fn.paques(Y).add(1, "days");
    };

moment.fn.ascension = function (Y) { // = dimanche de paques +39J
      if (Y === undefined) {
        Y = this.year();
      }
      return moment.fn.paques(Y).add(39, "days");
    };

moment.fn.pentecote = function (Y) { // = dimanche de paques +50J
      if (Y === undefined) {
        Y = this.year();
      }
      return moment.fn.paques(Y).add(50, "days");
    };

moment.fn.jourDeLAn = function (Y) { // 1 janv, quelque soit l'année
      if (Y === undefined) {
        Y = this.year();
      }
      return moment("1-1-" + Y, "DD-MM-YYYY");
    };

moment.fn.feteDuTravail = function (Y) {
      if (Y === undefined) {
        Y = this.year();
      }
      return moment("1-5-" + Y, "DD-MM-YYYY");
    };

moment.fn.victoireDeAllies = function (Y) {
      if (Y === undefined) {
        Y = this.year();
      }
      return moment("8-5-" + Y, "DD-MM-YYYY");
    };

moment.fn.feteNationale = function (Y) {
      if (Y === undefined) {
        Y = this.year();
      }
      return moment("14-7-" + Y, "DD-MM-YYYY");
    };

moment.fn.assomption = function (Y) {
      if (Y === undefined) {
        Y = this.year();
      }
      return moment("15-8-" + Y, "DD-MM-YYYY");
    };

moment.fn.toussaint = function (Y) {
      if (Y === undefined) {
        Y = this.year();
      }
      return moment("1-11-" + Y, "DD-MM-YYYY");
    };

moment.fn.armistice = function (Y) {
      if (Y === undefined) {
        Y = this.year();
      }
      return moment("11-11-" + Y, "DD-MM-YYYY");
    };

moment.fn.noel = function (Y) {
      if (Y === undefined) {
        Y = this.year();
      }
      return moment("25-12-" + Y, "DD-MM-YYYY");
    };

const JOURS_FERIES = [
    {
        name: "Jour de l'an",
        date: moment.fn.jourDeLAn
    },
    {
        name: "Fête du travail",
        date: moment.fn.feteDuTravail
    },
    {
        name: "Victoire des alliés",
        date: moment.fn.victoireDeAllies
    },
    {
        name: "Fête Nationale",
        date: moment.fn.feteNationale
    },
    {
        name: "Assomption",
        date: moment.fn.assomption
    },
    {
        name: "Toussaint",
        date: moment.fn.toussaint
    },
    {
        name: "Armistice",
        date: moment.fn.armistice
    },
    {
        name: "Noël",
        date: moment.fn.noel
    },
    {
        name: "Pâques",
        date: moment.fn.paques
    },
    {
        name: "Lundi de Pâques",
        date: moment.fn.lundiDePaques
    },
    {
        name: "Ascension",
        date: moment.fn.ascension
    },
    {
        name: "Pentecôte",
        date: moment.fn.pentecote
    }
];

function isWorkingDay(jour) { // jour=jour à tester
    const formatJour = moment(jour).format('DD MM YYYY');

};





module.exports = JOURS_FERIES;
