/**
* Slot machine
* Author: Saurabh Odhyan | http://odhyan.com
*
* Licensed under the Creative Commons Attribution-ShareAlike License, Version 3.0 (the "License")
* You may obtain a copy of the License at
* http://creativecommons.org/licenses/by-sa/3.0/
*
* Date: May 23, 2011 
*/
$(document).ready(function() {
    /**
    * Global variables
    */
    var completed = 0,
        imgHeight = 400;

    /**
    * @class Slot
    * @constructor
    */
    function Slot(el, max, step) {
        this.speed = 0; //speed of the slot at any point of time
        this.step = step; //speed will increase at this rate
        this.si = null; //holds setInterval object for the given slot
        this.el = el; //dom element of the slot
        this.maxSpeed = max; //max speed this slot can have
        this.pos = null; //final position of the slot    

        $(el).pan({
            fps:30,
            dir:'down'
        });
        $(el).spStop();
    }

    /**
    * @method start
    * Starts a slot
    */
    Slot.prototype.start = function() {
        var _this = this;
        $(_this.el).addClass('motion');
        $(_this.el).spStart();
        _this.si = window.setInterval(function() {
            if(_this.speed < _this.maxSpeed) {
                _this.speed += _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
        }, 100);
    };

    /**
    * @method stop
    * Stops a slot
    */
    Slot.prototype.stop = function() {
        var _this = this,
            limit = 30;

        clearInterval(_this.si);
        _this.si = window.setInterval(function() {
            //console.log( _this.speed );
            if( _this.speed > 0 ){
                _this.speed -= _this.step;
                $(_this.el).spSpeed(_this.speed);
            }else{
                _this.finalPos(_this.el);
                $(_this.el).spSpeed(0);
                $(_this.el).spStop();
                clearInterval(_this.si);
                $(_this.el).removeClass('motion');
                _this.speed = 0;
            }

        }, 100);
    };

    /**
    * @method finalPos
    * Finds the final position of the slot
    */
    Slot.prototype.finalPos = function() {
        var el = this.el,
            el_id,
            pos;

        el_id = $(el).attr('id');

        pos = document.getElementById(el_id).style.backgroundPosition;
        pos = pos.split(' ')[1];
        o_pos = parseInt(pos, 10);

        pos = Math.ceil( o_pos / 80 ) * 80;

        n_pos = pos - 80;
        //console.log( Math.abs(n_pos - o_pos )/20);
        if( Math.abs(n_pos - o_pos ) / 10 < 1 ){
            pos = n_pos;
        }
        this.pos = Math.ceil( ( pos % 400 ) / 80 );

        $(el).animate(
            {
                backgroundPosition: pos
            },

            {
                duration: 1000,
                easing: 'easeInOutElastic',
                complete: function(){
                    completed++;
                }
            }
        );
    };

    /**
    * @method reset
    * Reset a slot to initial state
    */
    Slot.prototype.reset = function() {
        var el_id = $(this.el).attr('id');
        $._spritely.instances[el_id].t = 0;
        $(this.el).css('background-position', '0px 0px');
        this.speed = 0;
        completed = 0;
        $('#result').html('');
    };

    function enableControl() {
        $('#control').attr("disabled", false);
    }

    function disableControl() {
        $('#control').attr("disabled", true);
    }

    function printResult() {
        var res;

        if( a.speed >= a.maxSpeed && b.speed >= b.maxSpeed && c.speed >= c.maxSpeed ) {
            res = "You got " + $('#selected-coupon').data('attr').text + ".";
        } else {
            res = "You Lose";
        }
        $('#result').html(res);
    }

    //create slot objects
    var a = new Slot('#slot1', parseInt( $('#v_1').val() ), 1),
        b = new Slot('#slot2', parseInt( $('#v_2').val() ), 2),
        c = new Slot('#slot3', parseInt( $('#v_3').val() ), 3);

    var machine = [ a, b, c ];
    var turnOffRoll = 0;


    /**
    * Slot machine controller
    */
    $('#control').click(function() {
        var x;
        if(this.innerHTML == "Start") {
            // Adjust speed
            a.maxSpeed = parseInt( $('#v_1').val() );
            b.maxSpeed = parseInt( $('#v_2').val() );
            c.maxSpeed = parseInt( $('#v_3').val() );

            a.start();
            b.start();
            c.start();
            this.innerHTML = "Stop";

            disableControl(); //disable control until the slots reach max speed

            //check every 100ms if slots have reached max speed 
            //if so, enable the control
            x = window.setInterval(function() {
                if(a.speed >= a.maxSpeed && b.speed >= b.maxSpeed && c.speed >= c.maxSpeed) {
                    enableControl();
                    window.clearInterval(x);
                }
            }, 100);
        } else if(this.innerHTML == "Stop") {
            turnOffRoll++;
            machine[ turnOffRoll - 1 ].stop();

            if( turnOffRoll == 3 ){
                this.innerHTML = "Reset";

                disableControl(); //disable control until the slots stop

                //check every 100ms if slots have stopped
                //if so, enable the control
                x = window.setInterval(function() {
                    if(a.speed === 0 && b.speed === 0 && c.speed === 0 && completed === 3) {
                        enableControl();
                        window.clearInterval(x);
                        printResult();
                    }
                }, 100);
                turnOffRoll = 0;
            }

        } else { //reset
            window.location.href=window.location.href;
        }
    });
});
