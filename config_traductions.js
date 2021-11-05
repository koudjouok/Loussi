let config_traductions = {
    // lazy requires (metro bundler does not support symlinks)
    //ar: () => require("./src/translations/ar.json"),
    en:() => require("./src/traductions/en.json"),
    fr:() => require("./src/traductions/fr.json"),
    hau:() => require("./src/traductions/ha.json"),
  };
module.exports = config_traductions;