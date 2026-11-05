/**
 * FarmLink - Weather & Rule-Based Agricultural Suggestions Engine
 * Features AP district microclimates, rule-based agronomic suggestions, and condition simulation.
 */

class WeatherService {
  constructor() {}

  getWeatherData() {
    return window.Storage.get("farmlink_weather") || {};
  }

  getCityWeather(cityName = "Guntur") {
    const data = this.getWeatherData();
    if (!data.cities) return null;
    return data.cities[cityName] || data.cities.Guntur || null;
  }

  getAllCities() {
    const data = this.getWeatherData();
    return data.cities ? Object.keys(data.cities) : ["Guntur", "Kurnool", "Chittoor", "Krishna", "West Godavari", "Anantapur", "Visakhapatnam"];
  }

  /**
   * Generates rule-based farming suggestions categorized strictly by:
   * - Warning:
   *   * rain probability >= 60%
   *   * wind speed >= 20 km/h
   * - Advisory:
   *   * temperature >= 35°C
   * - Information:
   *   * moderate conditions
   */
  generateRuleBasedAdvisories(weather) {
    if (!weather) return [];
    const advisories = [];
    const isTe = window.I18n && window.I18n.currentLang === "te";

    const rainProb = Number(weather.rainProb) || 0;
    const temp = Number(weather.temp) || 0;
    const wind = Number(weather.wind) || 0;

    // Rule 1: Rain probability >= 60% -> Warning
    if (rainProb >= 60) {
      advisories.push({
        id: "rule_rain",
        category: "Warning",
        categoryTe: "హెచ్చరిక",
        severity: "warning",
        type: "danger",
        icon: "🌧️",
        title: isTe ? "హెచ్చరిక: వర్షపాత సూచన" : "Warning: Rain Expected",
        titleTe: "హెచ్చరిక: వర్షపాత సూచన",
        text: isTe
          ? "వర్షం పడే అవకాశం ఉంది. అనవసరమైన పురుగుమందుల పిచికారీని నివారించండి మరియు వ్యవసాయ పనులను తదనుగుణంగా ప్రణాళిక చేయండి."
          : "Rain is expected. Consider avoiding unnecessary pesticide spraying and plan outdoor field activities accordingly.",
        textTe: "వర్షం పడే అవకాశం ఉంది. అనవసరమైన పురుగుమందుల పిచికారీని నివారించండి మరియు వ్యవసాయ పనులను తదనుగుణంగా ప్రణాళిక చేయండి."
      });
    }

    // Rule 2: Temperature >= 35°C -> Advisory
    if (temp >= 35) {
      advisories.push({
        id: "rule_heat",
        category: "Advisory",
        categoryTe: "సలహా",
        severity: "advisory",
        type: "warning",
        icon: "☀️",
        title: isTe ? "సలహా: అధిక ఉష్ణోగ్రత" : "Advisory: High Temperature",
        titleTe: "సలహా: అధిక ఉష్ణోగ్రత",
        text: isTe
          ? "అధిక ఉష్ణోగ్రతలు నమోదయ్యే అవకాశం ఉంది. నేలలోని తేమను గమనించి తగిన నీటిపారుదల అందించండి."
          : "High temperatures are expected. Monitor soil moisture and provide adequate irrigation.",
        textTe: "అధిక ఉష్ణోగ్రతలు నమోదయ్యే అవకాశం ఉంది. నేలలోని తేమను గమనించి తగిన నీటిపారుదల అందించండి."
      });
    }

    // Rule 3: Wind speed >= 20 km/h -> Warning
    if (wind >= 20) {
      advisories.push({
        id: "rule_wind",
        category: "Warning",
        categoryTe: "హెచ్చరిక",
        severity: "warning",
        type: "danger",
        icon: "💨",
        title: isTe ? "హెచ్చరిక: ఈదురు గాలులు" : "Warning: Strong Winds",
        titleTe: "హెచ్చరిక: ఈదురు గాలులు",
        text: isTe
          ? "ఈదురు గాలులు వీచే అవకాశం ఉంది. అధిక గాలుల సమయంలో పురుగుమందుల పిచికారీ చేయవద్దు."
          : "Strong winds are expected. Avoid spraying pesticides during high-wind conditions.",
        textTe: "ఈదురు గాలులు వీచే అవకాశం ఉంది. అధిక గాలుల సమయంలో పురుగుమందుల పిచికారీ చేయవద్దు."
      });
    }

    // Rule 4: Moderate conditions (no warning or advisory triggered) -> Information
    if (advisories.length === 0) {
      advisories.push({
        id: "rule_moderate",
        category: "Information",
        categoryTe: "సమాచారం",
        severity: "info",
        type: "info",
        icon: "🌱",
        title: isTe ? "సమాచారం: అనుకూల వాతావరణం" : "Information: Moderate Conditions",
        titleTe: "సమాచారం: అనుకూల వాతావరణం",
        text: isTe
          ? "సాధారణ వ్యవసాయ పనులకు వాతావరణ పరిస్థితులు అనుకూలంగా ఉన్నాయి."
          : "Weather conditions appear suitable for routine field activities.",
        textTe: "సాధారణ వ్యవసాయ పనులకు వాతావరణ పరిస్థితులు అనుకూలంగా ఉన్నాయి."
      });
    }

    return advisories;
  }

  /**
   * Simulates weather conditions dynamically for instant UI and rule evaluation testing
   * Supported keys: 'clear', 'rain', 'heatwave', 'wind', 'reset'
   */
  simulateCondition(cityName = "Guntur", conditionKey = "clear") {
    const raw = window.Storage.get("farmlink_weather") || { cities: {} };
    if (!raw.cities) raw.cities = {};
    const existing = raw.cities[cityName] || raw.cities.Guntur || {
      forecast: [
        { day: "Mon", temp: 32, cond: "Clear", rain: 10 },
        { day: "Tue", temp: 33, cond: "Partly Cloudy", rain: 15 },
        { day: "Wed", temp: 31, cond: "Sunny", rain: 10 },
        { day: "Thu", temp: 32, cond: "Sunny", rain: 10 },
        { day: "Fri", temp: 34, cond: "Clear", rain: 5 }
      ]
    };

    let simulated = { ...existing };

    if (conditionKey === "rain") {
      simulated.temp = 27;
      simulated.condition = "Heavy Monsoon Rain";
      simulated.conditionTe = "భారీ వర్షం";
      simulated.humidity = 88;
      simulated.rainProb = 75; // >= 60%
      simulated.wind = 14;
      simulated.icon = "cloud-rain";
      simulated.isSimulated = true;
      simulated.simulationType = "rain";
    } else if (conditionKey === "heatwave") {
      simulated.temp = 38; // >= 35°C
      simulated.condition = "Severe Heatwave & Dry";
      simulated.conditionTe = "తీవ్రమైన ఎండ & వేడి గాలులు";
      simulated.humidity = 28;
      simulated.rainProb = 5;
      simulated.wind = 12;
      simulated.icon = "sun";
      simulated.isSimulated = true;
      simulated.simulationType = "heatwave";
    } else if (conditionKey === "wind") {
      simulated.temp = 31;
      simulated.condition = "High Wind Gusts";
      simulated.conditionTe = "బలమైన ఈదురు గాలులు";
      simulated.humidity = 58;
      simulated.rainProb = 20;
      simulated.wind = 26; // >= 20 km/h
      simulated.icon = "wind";
      simulated.isSimulated = true;
      simulated.simulationType = "wind";
    } else if (conditionKey === "clear") {
      simulated.temp = 29; // Moderate: < 35°C, < 60% rain, < 20 km/h wind
      simulated.condition = "Clear Sky & Mild";
      simulated.conditionTe = "తేటగా ఉన్న ఆకాశం";
      simulated.humidity = 52;
      simulated.rainProb = 10;
      simulated.wind = 11;
      simulated.icon = "sun";
      simulated.isSimulated = true;
      simulated.simulationType = "clear";
    } else if (conditionKey === "reset") {
      delete simulated.isSimulated;
      delete simulated.simulationType;
      if (cityName === "Guntur") {
        simulated.temp = 33;
        simulated.condition = "Partly Cloudy";
        simulated.conditionTe = "పాక్షికంగా మేఘావృతం";
        simulated.humidity = 62;
        simulated.rainProb = 15;
        simulated.wind = 14;
      } else if (cityName === "Kurnool") {
        simulated.temp = 37;
        simulated.condition = "High Heat & Dry";
        simulated.conditionTe = "తీవ్రమైన ఎండ & పొడి వాతావరణం";
        simulated.humidity = 38;
        simulated.rainProb = 5;
        simulated.wind = 18;
      } else if (cityName === "Chittoor") {
        simulated.temp = 28;
        simulated.condition = "Heavy Rain Forecast";
        simulated.conditionTe = "భారీ వర్ష సూచన";
        simulated.humidity = 84;
        simulated.rainProb = 80;
        simulated.wind = 24;
      }
    }

    raw.cities[cityName] = simulated;
    window.Storage.set("farmlink_weather", raw);
    return simulated;
  }
}

// Global instance
window.Weather = new WeatherService();
