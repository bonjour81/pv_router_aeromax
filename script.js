function checkConsumption() {
    var currentTime = new Date();
    var currentHour = currentTime.getHours();
    print('heure' + currentHour);
    let injected_power;
    let threshold = -1500;     // heater will start if you have more than 1500W extra power.   The heater use around 400-500W, tune at your convenience
    let hyst = 800             // heater will stop  if you have less than 700W (-1500 + 800) extra power  => this value shall be higher than the heater consumption.
  

    if (currentHour >= 10 && currentHour <= 16) {   // only after 10h before 17h
        // sonde em0 (compteur)    measure the power you have in or out of your provider
        Shelly.call("em1.getstatus", { id: 0 }, function (em0, em0_error_code, em0_error_message) {
            print("********* Sonde em0 Compteur ************");
            print("error code: " + em0_error_code);
            print("error msg: "  + em0_error_message);
            print("puissance_active :" + em0.act_power);
            injected_power = em0.act_power;
        });
        // sonde em1 (chauffe-eau)  measure the power of the heater (not used, for information)
        Shelly.call("em1.getstatus", { id: 1 }, function (em1, em1_error_code, em1_error_message) {
            print("********* Sonde em1 Cumulus  ************");
            print("error code: " + em1_error_code);
            print("error msg: " +  em1_error_message);
            print("puissance_active :" + em1.act_power);
        });
        
        if (injected_power < threshold) {  // if we inject more than "theshold" out of the house, then we turn on the heater
            Shelly.call("Switch.set", {'id': 0, 'on': true});
            print("On allume le chauffe-eau");
        } 
        if (injected_power > (threshold+hyst)) {   // if we inject less than "theshold+hyst" out of the house (or we don't inject at all, then we turn off the heater
            Shelly.call("Switch.set", {'id': 0, 'on': false});
            print("On eteint le chauffe-eau");
         } 
    } else { // fin IF currentHour
         Shelly.call("Switch.set", {'id': 0, 'on': false});  // by default, out of production hours, we turn off the signal.
         print("On eteint le chauffe-eau");
    }
}  // end checkConsumption()

Timer.set(60000, true, checkConsumption);  // execute  every 1 minute
