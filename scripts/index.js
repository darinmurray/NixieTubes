// ============  F O R  D E V  O N L Y  ================ //
// turn power on when loaded
window.onload = function () { 
    // activateOnOffButton()
      
    };
    
    
    // ============  S E T  U P  S H O P  ================ //
    // console.clear();
    var display_length = 7; // how many tubes (7 for clock) 
    var new_id = 2; //initial #id is alread at 1 in the markup
    var max = $(".nixie_container").find(".nixie_tube").length;
    var tubes_toggled = false; // start with tubes not generated
    var powerOn = false;
    var cycleOn = false;
    var cycleTO;
    let clockOn = false;
    var clockTO;
    let military = false;
    var fuckery = false;
    var clink;
    var c = 0 // for cycleUpWrapper function
    
    // The ONNLY f#c%!ng way this works is by adding the length onto
    // the var name. It does NOT f#c%!ng work if length is on the element selector
    var max_2 = document.getElementsByClassName("nixie_tube");
    max_2.length; //is the ONLLY f#c%!ng WAY this thing returns a result
    
    
    // hiding these for initial state // set style in html?
    $('#military_slider_container').hide();
    $('#cycle_slider_container').hide();
    $( ".buttons" ).hide();
    
    
    
    
    
    
    // ======================================================== //
    // ======  L O A D  T U B E S  ON/0FF S C R E E N  ======== //
    // ============== (slowly / with effects) ================= //
    function toggleTubes(){
      tubes_toggled = !tubes_toggled
      if (tubes_toggled) {
          // call tube make function with interval
          makeTubesTO = setInterval( makeTubes, 50 )
         } else {
          switchOff()
          // call tube removal function with inteval
          removeTubesTO = setInterval( removeTubes, 50 )
         };
    };
    
    // ======================================================== //
    // ===========  M A K E  S O M E  T U B E S !  ============ //
    // ============== (slowly / with effects) ================= //
    var t = 0 
    function makeTubes() {
      //console.log("max at start of makeTubes: "+max)
      if (t < display_length) {
        new_tube = $("#tube_1").clone().attr("id", "tube_"+new_id); 
        $(".nixie_container").append(new_tube);  
        new_id++
        t++
      } else { // done making, now clean up
        clearInterval(makeTubesTO);
        makeTubesTO = null;
        // hide reflectons on outside of first/last tube
        // so the reflectons are of neighboring tubes only
        $("#tube_1").find(".nixie_glass_left_front").fadeTo( 2000, 0.1 ); 
        $("#tube_8").find(".nixie_glass_right_front").fadeTo( 2000, 0.1 );
        
        // this lowers the reflection of the left-most base
        // as there is not tube to the left of it to cause reflection  
        $("#tube_1").find(".base_gradiant").fadeTo( 2000, 0.5 );
         
        // = = = = =  why is this here = = = = = //
        // make vars from results for other functions
        // does NOT work as var
        tubes = $(".nixie_container").find(".nixie_tube"); 
        max = tubes.length  // used in other functions
      }; 
    };   
    
    // ======================================================== //
    // ========  R E M O V E  (M O S T)  T U B E S !  ========= //
    // ============== (slowly / with effects) ================= // 
    function removeTubes() {
      // console.log(max+" - tubes at start of removal")
      if (max > 1) {
        $("#tube_"+max).remove(); 
        max-- 
      } else { // done making, now clean up
        clearInterval(removeTubesTO) 
        removeTubesTO = null
        // bring back reflectons on outside of first/last tube
        $("#tube_1").find(".nixie_glass_left_front").fadeTo( 20, 1 ); 
        $("#tube_8").find(".nixie_glass_right_front").fadeTo( 20, 1 );
        // bring back the reflection of the left-most base 
        $("#tube_1").find(".base_gradiant").fadeTo( 20, 1 );      
      } 
      t = 0       // reset to 0
      new_id = 2  // reset to original value
    };  
    
    // ======================================================== //
    // =============  G L A S S  S O U N D F/X  =============== //
    // ============== (slowly / with effects) ================= // 
    $(document).on("mouseenter", ".nixie_tube" , function(e) {
      max == 1 ? clink = 2 : clink = Math.ceil(Math.random() * 5)  
      $("#sound-"+clink)[0].play();
    });
    
    
    
    
    // ==============  P O W E R   (button) ================= //
    $(document).on("click", "#power" , function(e) {
    activateOnOffButton()  
    });
    
    // ==============  P O W E R   (function) ================= //
    function activateOnOffButton() { 
      powerOn = !powerOn 
      if (!powerOn) {
          $('.buttons' ).slideToggle( "fast" );
          //$("button").removeClass("active_button");
          $("button, #power, #clock").removeClass("active_button");  
          $(".nixie_container").removeClass('blueOnGlow'); // slowGlowPulse 
          // Shut off the clock, if it's on
          clockOn ? initializeClock() : clockTO = null // duplicitous if false?
          fuckery ? mayhem() : "" // duplicitous if false?
              } else {
              $('.buttons' ).slideToggle( "fast" );
              $("#power").addClass("active_button"); 
              $(".nixie_container").addClass('blueOnGlow'); // slowGlowPulse  
              }
      //setInterval( makeTubes, 50 ) // higher number, slower steps  
      toggleTubes(50)
    }; // end of function
    
    
    
    
    // ===============  C Y C L E  ================ // 
    // ===============   (button)  ================ // 
    // ===============  =========  ================ //  
    // run the cycle of numbers up the stream
    $(document).on("click", "#cycle" , function(e) { 
      activateButton(this.id); // activate button
      cycleUpWrapper(100)      // activate the function
      $('#cycle_slider_container').slideToggle("slow");
    });  
    
    // ===============   (slider)  ================ //
    // try .slide vs .change
    $('#cycle_speed').change(function(event) {
      newSpeed = $(this).val() || 1000
      window.clearInterval(cycleTO) // !!!!!!!! this works??
    //  cycleTO = null // clear TimOut ?!?!?
      cycleOn = !cycleOn; // must flip since reinitializing
      cycleUpWrapper(newSpeed)
      console.log("New Speed is: "+newSpeed)
    });
    
    // ===============  C Y C L E.  ================ // 
    // ===============  (function)  ================ // 
    // ===============  ==========  ================ //  
    function cycleUpWrapper(cycleSpeed) {
      cycleOn = !cycleOn;      // flip the boolean for the function
      clockOn ? initializeClock() : "else do nothing"
      console.log("cycleSpeed in function: "+cycleSpeed)
      cycleUp(cycleSpeed)    
            function cycleUp() {
               if (cycleOn ) {
                   // in case I want to use 'char' as a function param later
                   // defaulting it to 'x' for now
                   char=c 
                   //cycle through each 'digit' element and light  
                   switchOn( tubes[c], char)
                   // accounting for last tube in the row
                   if (c==0) {prev = max-1} else {prev = c-1} 
                   // switch off previous tube
                   switchOff( tubes[prev], prev)
                   c++
                   c>=max ? c=0 : 'nothing'       
                   };
            cycleOn ? cycleTO = setTimeout(cycleUp, cycleSpeed) : window.clearInterval(cycleTO); 
            };// end function
      cycleTO = null
      console.log("clockOn is: "+cycleOn+" & cycleTO is: "+cycleTO)
    }; // end Wrapper
    
    // cycleTO = null  window.clearTimeOut(cycleTO)
    
    
    
    
    // ===============  C L O C K  ================ // 
    // ===============  (button)   ================ // 
    // =============== =========== ================ //  
    $(document).on("click", "#clock" , function(e) {
      activateButton(this.id);  // hilight the button
      initializeClock()         // initiate the clock function
    //  $('#military_slider_container').slideToggle("slow");
    });
    
    // ===============  12/24hr   ================ //
    $('#military_time_switch').change(function(){
      //$("#info").fadeTo("slow", 1)
      militaryTimeAndDisclaimer() 
    });
    
    // THIS IS ALL UGLY AND VERY VERBOSE, REFACTOR THIS DOWN TO SOMETHING INTELIGABLE  ! ! ! 
    function militaryTimeAndDisclaimer() {
      let updateInfoTO;
      military = !military;
      if (military && (new Date().getHours() < 13) ) {      
          $("#info").text("It's currently before 12:59pm. Military time will be displyed after 12:59pm");
          $("#info").addClass("fadeOut");
        $(".h24, .h12").toggleClass("opacity_5");
      } else {
          $("#info").text(".");
          $("#info").removeClass("fadeOut");
        $(".h24, .h12").toggleClass("opacity_5");
    }; 
    //$("#info").toggleClass("fadeOut")
     if (military == true){
        $("#info").text("Military/24 hr time");
      } else {
        $("#info").text("Sorry you couldn't hack it...");
      }
      updateInfoTO = setTimeout(function() {
        $("#info").toggleClass("fadeOut")
        //$("#info").text(":-)");
        console.log("after 3 secs")
        window.clearInterval(updateInfoTO) // clear self?
        // need something to stop a current transition in it's tracks and re-start
      }, 3000);
      console.log("military time = "+military)
    };
    
    // ===============  C L O C K-  ================ // 
    // ===============  (function)  ================ // 
    // ===============  ==========  ================ //  
    function initializeClock() { 
    // Wrapper function: this takes care of setup, before running the clock
    fuckery ? mayhem() : ""
    cycleOn ? cycleOn=false : ""
    clockOn = !clockOn;       // flip the boolean
      if (clockOn) {
          switchOff()             // turn off all tubes
          startTime()             // initiate the clock function
          warmUpTube(500, 20, 10, 100, 15000); // nice 'warm up' effect
      } else {
          switchOff()              // turn off all tubes
          window.clearInterval(clockTO); 
          clockTO = null           // 'cause it's anoying to have it hanging out there?!
      }
    // do this regardless  
    toggleColon()             // shrink the colon tube 
    stubbySeconds()           // shrink the 'seconds' digits
    // spin-up effect for no reason
    $(".honeycomb, .digits").toggleClass("twirly_tubes ");
    // show the option for military time
    $('#military_slider_container').slideToggle("slow");
      function startTime() {
         let today = new Date();
             if (military == true) { 
              var h = String(today.getHours()).padStart(2, " "); 
             } else {
              var th = today.getHours()
              var h = String(  (th + 11) % 12 + 1   ).padStart(2, " ")   
             }
          //.padStart ads a leading zero if it's a single digit #
          let m = String(today.getMinutes()).padStart(2, "0");
          let s = String(today.getSeconds()).padStart(2, "0"); 
          // document.getElementById('time').innerHTML =  h + ":" + m + ":" + s; 
          switchOnOff( "#tube_1", h.slice(0,1)) // hours_a
          switchOnOff( "#tube_2", h.slice(-1)) // hours_b
          switchOnOff( "#tube_3", 10) // simicolen << ===== make this blink!?
          switchOnOff( "#tube_4", m.slice(0,1)) // minutes_a
          switchOnOff( "#tube_5", m.slice(-1)) // minutes_b
          //  switchOnOff( "#tube_6", 11) // simicolen
          switchOnOff( "#tube_7", s.slice(0,1)) // 
          switchOnOff( "#tube_8", s.slice(-1)) //
          clockTO = setTimeout(startTime, 1000)     
         }; // end startTimefunction
      console.log("clockOn is: "+clockOn+" & clockTO is: "+clockTO)
    }; // end clock Wrapper
    
    
    
    
    
    
    // ==============   W A R M  U P  ================ //
    // ==============  F L I C K E R  ================ //
    // ==============     W I T H     ================ // 
    // ==============    D E C A Y    ================ //
    /* * * *  serious refactoring needed here. * * * * */
    function warmUpTube(maxDelayTime, outSpeed, inSpeed, b_laps, burn_out) {
      flicker_decay = 100
      decay_velocity = 1.25
      console.log("Starting at:"+flicker_decay+" Burnout is at: "+burn_out);
      // flicker_decay has to start at 0 and go UP to flicker_out
      blinkMe(maxDelayTime, outSpeed, inSpeed, b_laps)  
      
        function blinkMe(maxDelayTime, outSpeed, inSpeed, b_laps) { 
          // make blink infinite if no s_laps variable
          // the ternary below works, but it's inelegent and clumsy 
          ( b_laps ) ? b_laps = b_laps : b_laps = 1000 
        
          // random tube will flicker each time, until decay reached
          let tube =  "#tube_"+tubeOrama(); // define with " " to select ALL tubes
          
          //  Max Delay time creates a faster (lower number) or slower ( higher number) blink
          delayTime = Math.floor(Math.random()*(maxDelayTime-20+1)+20)
          
          // console.log("lap;"+laps+" delayTime: "+ delayTime);
          let b_count = b_laps
          let timer = setTimeout(function() {
                  flicker_decay+=Math.floor(flicker_decay*decay_velocity)
                  $(tube+" .digit.lit, "+tube+" .glowing.slowGlowPulse").fadeOut(outSpeed); 
                  $(tube+" .digit.lit, "+tube+" .glowing.slowGlowPulse").fadeIn(inSpeed) 
                  if (b_laps >= 1000) {b_count++} else  {b_count--}
                  // only call another clicker if decay is < burnout, and there are laps left.
                  if (0 < b_count && flicker_decay <= burn_out) { // use flag variable to make this on/off
                                blinkMe(maxDelayTime, outSpeed, inSpeed, b_count); 
                               } else { timer = null };  
                  // console.log("Icremented Delay:"+flicker_decay+" Burnout is at: "+burn_out)
            console.log("timer = "+timer)
              }, delayTime+flicker_decay); 
        };// end blinkMe
    };// end flicker
    
    
    
    
    // ==========  M A Y H E M !  ========== //
    // ==========    (button)     ========== //
    // ==========  =============  ========== //
    // Chaos raping chinanigans while pillaging and bunring every 
    // bridge in sight... Epic general fuckery!
    $(document).on("click", "#mayhem" , function(e) { 
      activateButton(this.id); // activate button
      mayhem()
    });
    
    // ===============  M A Y H E M ! ================ // 
    // ===============   (function)   ================ // 
    // =============== ============== ================ //   
    // Light 'em up!
    function mayhem() {
      fuckery = !fuckery
      if (fuckery) {
        // make this function do random tubes, at random times
        toggleColons()
        //this delayed instead of intervaled?
        // Unfortuntely, this kills ALL intervals, including other 
        // intervals that were JUST initialized in this function
         // mayhemCycleTO = setInterval( cycleUpWrapper, 5000 );  
        // bring in the smoke! 
        $(".smoke_source").css({'opacity': "1"}) 
    
        setTimeout(function() { 
          tubeOrama() 
          makeThisSkinny(randoTube) 
          console.log("Tube is:"+randoTube); 
        }, 3000);  // make repeat at random times, reverse
     
        // both options below are working fine 
        setTimeout(function() { 
          $("#bsog").toggle() 
        }, 2000)
    } else { 
      // reverse/clean everything up
      toggleColons()
      // MAKE POWER BUTTON HIDE SMOKE!! make it a toggle function? 
      $(".smoke_source").css({'opacity': "0"})
      $("#bsog").hide();
      mayhemCycleTO = null
      saySomething(":-(")
      console.log("Nothing to see here...")
    };
     
    }; // <== end MAYHEM function <== //
      // make the mouse cursor change at random intervals
      // annimate BSOG entrance 
      // PLAY THE MAC RESTARTING SOUND!!!!!
    
    // click anywhere on Blue Screen Of Death to hide it 
    $(document).on("click", "#bsog", function(e) {  
     $("#bsog").hide(); 
    });
    
    
    
    
    
    
    // ================  ======================  ================ //
    // ==========  T U B E  O N / O F F  FUNCTIONS  ============= //
    // ================  ======================  ================ //
    // rename these? tubeON, tubeOFF, tubeUPDATE
    function switchOn( tube, di) {  
         $(tube).find(".no_"+di).addClass("lit glow");
         $(tube).find('.honeycomb').addClass("glowing slowGlowPulse");
         $(tube).find('.base_glow').addClass("base_glow_effect"); 
    }
       
    function switchOff( tube, di) { 
      // <<-- I think this could be done with a variable that 
      // is called as a tubeID instead of using an IF/Else
      // << = = = = = =  possibel refactoring here = = = = = = << 
      // If no parameters provided when called, kill everything  
      if (typeof di === 'undefined' || di === null ){ 
        $(".digit").removeClass("lit  glow");
        $('.honeycomb').removeClass("glowing slowGlowPulse");
        $('.base_glow').removeClass("base_glow_effect");   
      } else { // target by parameters provided
              $(tube).find(".no_"+di).removeClass("lit  glow");
              $(tube).find('.honeycomb').removeClass("glowing slowGlowPulse");
              $(tube).find('.base_glow').removeClass("base_glow_effect");
              } 
    }; 
    
    function switchOnOff( tube, di) { 
      // clears out the existing number...
      $(tube+" .digit").removeClass("lit glow");
      $(tube+' .honeycomb').removeClass("glowing slowGlowPulse"); 
      $(tube+' .base_glow').removeClass("base_glow_effect");
      if ( di == '' || di == ' ' ){ 
      // if a space was supplied as the digit,  DO NOTHING!  
      } else {  // light the ditits div and glow effects
             $(tube).find(" .no_"+di).addClass("lit glow")
             $(tube).find(' .honeycomb').addClass("glowing slowGlowPulse");
             $(tube).find(' .base_glow').addClass("base_glow_effect");
             };
    }; 
    
    
    
    
    // ===========   G E N E R A L  F U N C T I O N S   ============== //
    // ===========   G E N E R A L  F U N C T I O N S   ============== //
    // ===========   G E N E R A L  F U N C T I O N S   ============== //
    
    // =============  Hilight Active Button  ================ // 
    function activateButton(button_id) {  
      if ( $("#"+button_id).hasClass("active_button")  )
         { 
           $("#"+button_id).removeClass("active_button")
         } else { // <== toggle all
           $("button.group_1").removeClass("active_button");
           $("#"+button_id).addClass("active_button");
         }
    };  
    
    // =============  Rando Tube Picker  ================ //
    function tubeOrama() {
      min = 1 // min is always 1, in this case
      randoTube = Math.floor(Math.random() * (max - min + 1) + min) 
      return randoTube 
      //console.log("max is:"+randoTube() );
    }
    
    // ===================   S C A L I N G    =================== // 
    // ===================   S C A L I N G    =================== // 
    // ===================   S C A L I N G    =================== // 
    
    // ====  S T U B B Y  S E C O N D S  F O R  C L O C K  ======= //
    function stubbySeconds() { // scales the seconds digits in clock
      // <<==== make this do the last two-three tubes 
      // <<==== instead of calling by specific tube number
      $("#tube_6").toggle(); //.toggle("slow")
      setTimeout(function(){
        $("#tube_7, #tube_8").toggleClass("stubby") 
        $("#tube_7 .base, #tube_8 .base").toggleClass("thinner_base") 
      }, 100); 
    }; // end of function
    
    // =========  S K I N N Y  C O L O N  F O R  C L O C K  ============ // 
    flipSingleColon = false
    function toggleColon() {
      flipSingleColon =!flipSingleColon
      $("#tube_3").toggleClass("thinner") 
      $("#tube_3").find(".digit:not(.no_10)").fadeOut("slow") 
      if (flipSingleColon) {
                $("#tube_3 .honeycomb").css("width","40px");
                $("#tube_3 .honeycomb").addClass("scale_skinny_up") 
      } else {
                $("#tube_3 .honeycomb").css("width","95px");
                $("#tube_3").find(".digit:not(.no_10)").fadeIn("slow")
                $("#tube_3 .honeycomb").removeClass("scale_skinny_up")    
      }
    }
    
    // <<< ====== USED IN MAYHEM <<  = = = =  MAKE THIS TOGGLE, OR SOMETHING
    function makeThisSkinny(choice) {
      $("#tube_"+choice+" .honeycomb").css("width","40px");  
      //setTimeout(function(){   
      $("#tube_"+choice).addClass("scale_skinny")
      $("#tube_"+(choice+1) ).addClass("bump_left")
      // $("#tube_3, #tube_6").find(".digit:not(.no_10)").fadeOut("slow")
      // $("#tube_3 .honeycomb").css("width","90px")
      $("#tube_"+choice+" .honeycomb").addClass("scale_skinny_up")
      // }, 100);  
    }
    
    function makeThisFat(choice) { 
      $("#tube_"+choice+" .honeycomb").css("width","95px");
      $("#tube_"+choice).removeClass("scale_skinny")
      $("#tube_"+(choice+1) ).removeClass("bump_left")
      // $("#tube_3, #tube_6").find(".digit:not(.no_10)").fadeIn("slow")
      $("#tube_"+choice+" .honeycomb").removeClass("scale_skinny_up")
    }
    // makeThisFat(4) 
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // ,`,`,`,`,`,`>  W O R K  I N  P R O G R E S S  <`,`,`,`,`,` //
    // ,`,`,`,`,`,`>  W O R K  I N  P R O G R E S S  <`,`,`,`,`,` //
    // ,`,`,`,`,`,`>  W O R K  I N  P R O G R E S S  <`,`,`,`,`,` //
    
    
    // ,`,`,`,`,`,`>  words on tubes  <`,`,`,`,`,` //
    function saySomething(stringy) { 
        var s = stringy
           for (var i = 0; i < s.length; i++) {
           console.log(s.charAt(i));
           saySomethingOnOff( i+1, s.charAt(i))
       }
    // return(stringy)
    // why does this return undefined in console?  
    }; // end 
    // saySomething("HAPPY") 
    
    
    // ,`,`,`,`,`,`>  more words on tubes?  <`,`,`,`,`,` //
    // ,`,`,`,`,`,`>  modify to cycle through tubes?  <`,`,`,`,`,` //
    // try wrapping this in another function that bumps the 
    // tube number by one for each one. 
    function saySomethingOnOff( tube, alpha) { 
      // clears out the existing number...
      this_tube = "#tube_"+tube
      $(this_tube+" .digit").removeClass("lit glow alpha"); // .alpha class changes the font
      $(this_tube+' .honeycomb').removeClass("glowing slowGlowPulse");  
      $(this_tube+' .base_glow').removeClass("base_glow_effect");
        if ( alpha == '' || alpha == ' ' ){ 
        // do nothign for nill or blank spaces  
           } else {  // light the digits div and glow effects
                     $(this_tube).find(" .no_11").text(alpha)
                     $(this_tube).find(" .no_11").addClass("lit glow alpha") // .alpha class changes the font - - - change to .display_font to avoid confusion with transparancy
                     $(this_tube).find(' .honeycomb').addClass("glowing slowGlowPulse");
                     $(this_tube).find(' .base_glow').addClass("base_glow_effect");
                   }
      console.log(this_tube)
      //return(this_tube )
    } // <== end function
    
    // saySomethingOnOff( "3", "P"); saySomethingOnOff( "4", "R"); saySomethingOnOff( "5", "P")
    
    
    
    
    
    
    
    
    // ============== 3 3 3 3 3 3 3 3   (button) ================= //
    $(document).on("click", "#three" , function(e) {
      //steady blink
      // steadyBlink(1000, 500, 500, 3)
      steadyBlink(50, 50, 5 )
    });
    // ============== 5 5 5 5 5 5 5 5 5  (button) ================= //
    $(document).on("click", "#five" , function(e) {
      saySomething("HI ERIN") 
    });
    
    // ========= S T E A D Y  B L I N K I N G =========== //
    // ========= S T E A D Y  B L I N K I N G =========== //
    // ========= S T E A D Y  B L I N K I N G =========== //
     function steadyBlink(s_outSpeed, s_inSpeed, s_laps) {
       // make blink infinite if no s_laps variable
       // the ternary below works, but it's inelegent and clumsy
       //   ( s_laps ) ? s_laps = s_laps : s_laps = 1000 
     var s_count = s_laps    
       // if no s_laps, it should be always a positive number
       console.log("Before the setTimeout: s_count is: "+s_count+", s_laps is: "+ s_laps)
           setTimeout(function() {
              $(".digit.lit, .glowing.slowGlowPulse").fadeOut(s_outSpeed); 
              $(".digit.lit, .glowing.slowGlowPulse").fadeIn(s_inSpeed) 
     // if (s_laps >= 1000) {s_count++} else  {s_count--} // only for the awkward infiinte 
             s_count-- // <<<== this triggers everthhing
             //console.log("Before the IF: s_count is: "+s_count+", s_laps is: "+ s_laps)
             if (0 < s_count) {
                             steadyBlink(s_outSpeed, s_inSpeed, s_count);
                            };
           // No delay on initial itteration, blink instantly 
           }, (s_count == s_laps) ? "0" : s_outSpeed+s_inSpeed ); 
     };
    
    
    
    
    
    // ============== 6 6 6 6 6 6 6 6 6  (button) ================= //
    $(document).on("click", "#six" , function(e) {
      // blink rate, onFade, offFade, itterations
      randoBlinkWrapper(2000, 20, 100, 10 ) //last param should be nil for perpetual blinking?
    }); //Math.floor(Math.random() * (100 - 2 + 1) + 2)
    
    // ========= QUICK BLINKS FOR SHORT BURSTS  =========== //
    // ========= QUICK BLINKS FOR SHORT BURSTS =========== //
    // ========= QUICK BLINKS FOR SHORT BURSTS =========== // 
    // really good random blinking effect!!  See notes...
    function randoBlinkWrapper(maxDelayTime, outSpeed, inSpeed, maxLaps) {
     max_laps = maxLaps
     min_laps = 2
     b_laps = Math.floor(Math.random() * (max_laps - min_laps + 1) + min_laps) 
     randoBlink(maxDelayTime, outSpeed, inSpeed, b_laps)
      
        function randoBlink(maxDelayTime, outSpeed, inSpeed, b_laps) {
        // blinking on up to max # to stead on
        //  max = b_laps // up to 1000 works, exponentialy decreases
        //  min = 1 // at least one flicker
        //  blinkLife = Math.floor(Math.random() * (max - min + 1) + min) 
        
           // make blink infinite if no s_laps variable
           // the ternary below works, but it's inelegent and clumsy 
          
        ( b_laps ) ? b_laps = b_laps : b_laps = 1000 
        // Max Delay time creates a faster (lower number) or slower ( higher number) blink
        delayTime = Math.floor(Math.random()*(maxDelayTime-20+1)+20)
        console.log("Delay is: "+delayTime+"laps is: "+b_laps);
           var b_count = b_laps
              setTimeout(function() {
                 $(".digit.lit, .glowing.slowGlowPulse").fadeOut(outSpeed); 
                 $(".digit.lit, .glowing.slowGlowPulse").fadeIn(inSpeed) 
                if (b_laps >= 1000) {b_count++} else  {b_count--}
                if (0 < b_count) { // use flag variable to make this on/off
                                randoBlink(maxDelayTime, outSpeed, inSpeed, b_count); 
                               };  
              }, delayTime); 
        }; // end of RandoBlink
    }; // end of RandoBlinkWrapper
    
    
    
    
    
    
    // ============== F L I C K E R  (button) ================= //
    $(document).on("click", "#two" , function(e) {
      warmUpTube(500, 20, 10, 100, 15000) // nice 'warm up' effect at the current settings
    });
    
    // ============== F L I C K E R  (button) ================= //
    $(document).on("click", "#four" , function(e) {
      tubeOrama()
      console.log("i got a random tube: "+randoTube)
    });
    
    
    // ,`,`,`,`,`,`>              E N D              <`,`,`,`,`,` //
    // ,`,`,`,`,`,`>  W O R K  I N  P R O G R E S S  <`,`,`,`,`,` //
    // ,`,`,`,`,`,`>              E N D              <`,`,`,`,`,` //
    
    
    
    
    
    // ============== T e S T  &  p L a Y  ================= //
    // ============== T e S T  &  p L a Y  ================= //
    // ============== T e S T  &  p L a Y  ================= //
    
    
    
    // ,`,`,`,`,`,`>  C H A N G E   <`,`,`,`,`,` //
    // ,`,`,`,`,`,`>      O N       <`,`,`,`,`,` //
    // ,`,`,`,`,`,`>  D E P L O Y   <`,`,`,`,`,` //
    // ===========  H O N E Y C O M B S  ============= //
    // CLONE the hidden SVG element (in the HTML) 
    // and put it into place, keeping the HTML 
    // clean while I'm working on it. 
    //  honomb_grid = $(".honeycomb").clone().removeAttr("style");
    //  $(".glass").prepend(honeycomb_grid); 
    
    
    // ============== T e S T clear intervals  (button) ================= //
    $(document).on("click", "#clearIntervals" , function(e) {  
      console.log("intervals clicked")
      clearMyIntervals() 
    });
    
    $(document).on("click", "#glow" , function(e) {
      if ( $(".honeycomb").hasClass("glowing") ) {
        $(".honeycomb").removeClass("glowing")
      } else {
      $(".honeycomb").addClass("glowing")// .css("opacity", "0.2"); 
      }
      console.log(".glow button clicked")
    });
    
    $(document).on("click", "#a" , function(e) {
      // $(".nixie_tube").toggleClass("thinner")
     toggleColons()
    });
    
    // ============== Skinny Colen  (button) ================= //
    $(document).on("click", "#one" , function(e) {
    stubbySeconds()
    });
    
    // ============== fat/skinny any character  (button) ================= //
    $(document).on("click", "#four" , function(e) {
      makeThisFat(4)
    });
    
    $(document).on("click", "#BSOG_button" , function(e) {
      $("#bsog").toggle();  // hilight the  button
                  // initiate the clock function
    });
    
    
    // ============== 3 3 3 3 3 3 3 3   (button) ================= //
    $(document).on("click", "#one" , function(e) {
    //removeTubes()
      setInterval( removeTubes, 50 )
    });
    
    
    
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    //Slider is not working as it isn't effectively killing the interval, it's cumulative
    //So, clearMyIntervals works, but it's ugly and cumbersome. there has to be a better solution
    
    // Depricated by naming and targeting all TOs and Intervals
    // ============= Clear All Intervals ================ //
      function clearMyIntervals() {
        var interval_id = window.setInterval(()=>{}, 999999999 );
        for (var i = 0; i < interval_id; i++)
          window.clearInterval(i);
        console.log("💀 Killing intervals ⌫")
      }; // end of function
    
    
    
    
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // Depricated by similar TOGGLE function above
    // ===========  M A K E  S O M E  T U B E S !  ============= //
    // foolproof, but boring
    function makeTubesNow() { // makes all tubes instantly
      for (let step2 = 0; step2 < display_length; step2++) {  
        new_tube = $("#tube_1").clone().attr("id", "tube_"+new_id  );   
        $(".nixie_container").append(new_tube);
        new_id++
      }
    } //end function 
    // makeTubesNow()
    
    
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // Depricated by similar TOGGLE function above
    function smallSeconds() {
      $("#tube_6 ").hide(); // .fadeOut("slow") //.hide();  
      $("#tube_7 .base, #tube_8 .base").addClass("scale_base_thin")
      $("#tube_7 .glass, #tube_8 .glass").addClass("scale_short");
        //$("#tube_8").addClass("bump_left"); 
        $("#tube_7 .honeycomb, #tube_8 .honeycomb").addClass("scale_short_up");
        $("#tube_7 .honeycomb, #tube_8 .honeycomb").css({"height":"75px","width":"40px", "margin-top":"107px"  });   
    }  
    
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // Depricated by similar TOGGLE function above
    function skinnyColons() {  
      $("#tube_3 .honeycomb, #tube_6 .honeycomb").css("width","40px");   
      $("#tube_3, #tube_6").addClass("scale_skinny")
      //$("#tube_4").addClass("bump_left") //no bump on 7 for tiny seconds
      $("#tube_3, #tube_6").find(".digit:not(.no_10)").fadeOut("slow")
      $("#tube_3 .honeycomb, #tube_6 .honeycomb").addClass("scale_skinny_up") 
    }
    function fatColons() {
      $("#tube_3 .honeycomb, #tube_6 .honeycomb").css("width","95px");
      $("#tube_3, #tube_6").removeClass("scale_skinny")
      //$("#tube_4, #tube_7").removeClass("bump_left")
      $("#tube_3, #tube_6").find(".digit:not(.no_10)").fadeIn("slow")
      $("#tube_3 .honeycomb, #tube_6 .honeycomb").removeClass("scale_skinny_up")
    }
    
    
    //  $("#tube_8").on('transitionend webkitTransitionEnd oTransitionEnd', function () {
    //    // your event handler
    //    console.log("working")
    //  });
    
    
    // ====  nice fade on hover  ====
    // $(".group_1").hover(function() { 
    //   $(this).fadeTo(600, 1); 
    // }, function() { 
    //   $(this).fadeTo(600, 0); 
    // });
    
    
    
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    function bigSeconds() {
       setTimeout(function(){   
          $("#tube_7 .base, #tube_8 .base").removeClass("scale_base_thin")
          $("#tube_7 .glass, #tube_8 .glass").removeClass("scale_short");
          // $("#tube_8").removeClass("bump_left")
          $("#tube_6").show();  // fadeIn("slow");  
          $("#tube_7 .honeycomb, #tube_8 .honeycomb").removeAttr("style");
          }, 500);   // stupid, gives honeycomb time to transition
      $("#tube_7 .honeycomb, #tube_8 .honeycomb").removeClass("scale_short_up");
    
    }
    
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    flipBothColons = false
    function toggleColons() {
      flipBothColons =!flipBothColons
      $("#tube_3, #tube_6").toggleClass("thinner") 
      $("#tube_3, #tube_6").find(".digit:not(.no_10)").fadeOut("slow") 
      if (flipBothColons) {
                $("#tube_3 .honeycomb, #tube_6 .honeycomb").css("width","40px");
                $("#tube_3 .honeycomb, #tube_6 .honeycomb").addClass("scale_skinny_up") 
      } else {
                $("#tube_3 .honeycomb, #tube_6 .honeycomb").css("width","95px");
                $("#tube_3, #tube_6").find(".digit:not(.no_10)").fadeIn("slow")
                $("#tube_3 .honeycomb, #tube_6 .honeycomb").removeClass("scale_skinny_up")    
      }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    