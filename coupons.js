function CouponsCtrl( $scope ) {

    // Coupon list
    $scope.coupons = [
        {
            text: 'PEPSI',
            selected: false
        },
        {   text:'COKE',
            selected: false
        },
        {   text:'NIKE',
            selected: false
        },
        {   text:'ADIDAS',
            selected: false
        }
    ];

    // Selected coupons
    $scope.selected = null;

    $scope.select = function( c ){
        //console.log( 'select : '+ c.text );
        var prev = $scope.selected;

        setSelect( prev, c );

    };

    function setSelect( prev, c ){
        // If `selected` is exist then toggle
        // to normal state.
        if( prev ){
            prev.selected = false;
        }else{
            // Enable `start` button
            $('#control').attr( 'disabled', false );
        }

        // Set new selected coupon.
        $scope.selected = c;
        c.selected = true;

        // Keep coupon data in DOM.
        // It should be _better_
        $('#selected-coupon').data('attr',c);
    }

}
