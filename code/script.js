/**
 * Book a trip
 * @param {org.aeriaa.paxjourney.makeReservation} passenger
 * @transaction
 */
function bookATrip(makeReservation){
    return getAssetRegistry('org.aeriaa.paxjourney.Booking')
    .then(function (assetRegistry) {
    
        var factory = getFactory();
        var booking = factory.newResource('org.aeriaa.paxjourney', 'Booking', makeReservation.idBooking);
        booking.pax = makeReservation.pax;
        booking.fligth = makeReservation.fligth;
        booking.accommodation = makeReservation.accommodation; 
        booking.transport = makeReservation.transport;
        
        return assetRegistry.add(booking);
    });

}

 
/**
 * Book a trip
 * @param {org.aeriaa.paxjourney.payNavigationFee} fee
 * @transaction
 */
function payTheANSPFee(payNavigationFee) {
    
    //does the airlne have money?
     if (payNavigationFee.sender.amount < payNavigationFee.fee) {
      throw new Error('The Airline has insufficient funds!')
    }
  
    payNavigationFee.sender.amount -= payNavigationFee.fee
    payNavigationFee.receiver.amount += payNavigationFee.fee
    
    var sendTransaction = getFactory().newConcept('org.aeriaa.paxjourney', 'AirNavigationFee')
    sendTransaction.fee = payNavigationFee.fee
    sendTransaction.navigationConcept = 'Flight navigation services'

  return getAssetRegistry('org.aeriaa.paxjourney.Wallet')
      .then(function (assetRegistry) {
        return assetRegistry.updateAll([payNavigationFee.sender, payNavigationFee.receiver])
      })
      .then(function () {
        sendEvent("ANSP fee paid")
      })
 }
  
  function sendEvent(msg) {
    var feeEvent = getFactory().newEvent('org.aeriaa.paxjourney', 'TransactionCompleted')
    feeEvent.msg = msg
    emit(feeEvent)
  }
