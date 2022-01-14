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
    
    
    
    
    
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //

    
    
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //
    // * * * * * * * * * * >  U N U S E D  < * * * * * * * * * *  //

    
    
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
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    