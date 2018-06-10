/**
 * A temperature reading has been received for an order by an IoT
 * @param {org.birthvenue.scm.TemperatureReading} temperatureReading - the TemperatureReading transaction
 * @transaction
 */
function temperatureReading(temperatureReading) {

    var order = temperatureReading.order;
    var NS = 'org.birthvenue.scm';

    console.log('Adding temperature ' + temperatureReading.celcius + ' to order ' + order.$identifier);

    if (order.temperatureReadings) {
        order.temperatureReadings.push(temperatureReading);
    } else {
        order.temperatureReadings = [temperatureReading];
    }

    // add the temp reading to the order
    //const orderRegistry = await getAssetRegistry('org.birthvenue.scm.Order');
    //await orderRegistry.update(order);

    return getAssetRegistry(NS + '.Order')
        .then(function (orderRegistry) {
            // add the temp reading to the order
            return orderRegistry.update(order);
        });
}

/**
 * The order has been picked up by 3PL who updates the order in the ledger
 * @param {org.birthvenue.scm.OrderReceivedByLogistics} orderReceivedByLogistics - the OrderReceivedByLogistics trnstn
 * @transaction
 */
function updateOrderAtPickup(orderReceivedByLogistics) {
  
  	var contract = orderReceivedByLogistics.order.contract;
    var order = orderReceivedByLogistics.order;
    var NS = 'org.birthvenue.scm';

    console.log('Received at: ' + orderReceivedByLogistics.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the order
    order.status = 'ACCEPTED_BY_LOGISTICS_COMPANY';

    // find the lowest temperature reading
    if (order.temperatureReadings) {
      // sort the temperatureReadings by celcius
      order.temperatureReadings.sort(function (a, b) {
        return (a.celcius - b.celcius);
      });
      var lowestReading = order.temperatureReadings[0];
      var highestReading = order.temperatureReadings[order.temperatureReadings.length - 1];
      console.log('Lowest temp reading: ' + lowestReading.celcius);
      console.log('Highest temp reading: ' + highestReading.celcius);

      // does the lowest temperature violate the contract?
      if (lowestReading.celcius < contract.minTemperature) {
        order.ediblityStatus = "NO";
        order.status = "REJECTED_BY_LOGISTICS_COMPANY";
        console.log('Temperature lower than recommended!');
      }

      // does the highest temperature violate the contract?
      if (highestReading.celcius > contract.maxTemperature) {
		order.ediblityStatus = "NO";
        order.status = "REJECTED_BY_LOGISTICS_COMPANY";
        console.log('Temperature higher than recommended!');
      }
    }
  
    // update the state of the order
    // const orderRegistry = await getAssetRegistry('org.birthvenue.scm.Order');
    // await orderRegistry.update(order);

    return getAssetRegistry(NS + '.Order')
        .then(function (orderRegistry) {
            // add the temp reading to the order
            return orderRegistry.update(order);
        });
  
}

/**
 * The order has reached retailer location. Retailer updates the order in the ledger
 * @param {org.birthvenue.scm.OrderReceivedByRetailer} orderReceivedByRetailer - the OrderReceivedByRetailer trnstn
 * @transaction
 */
function updateOrderAtRetailerLocation(orderReceivedByRetailer) {
  
  	var contract = orderReceivedByRetailer.order.contract;
    var order = orderReceivedByRetailer.order;
    var NS = 'org.birthvenue.scm';

    console.log('Received at: ' + orderReceivedByRetailer.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the order
    order.status = 'ACCEPTED_BY_RETAILER';

    // find the lowest temperature reading
    if (order.temperatureReadings) {
      // sort the temperatureReadings by celcius
      order.temperatureReadings.sort(function (a, b) {
        return (a.celcius - b.celcius);
      });
      var lowestReading = order.temperatureReadings[0];
      var highestReading = order.temperatureReadings[order.temperatureReadings.length - 1];
      console.log('Lowest temp reading: ' + lowestReading.celcius);
      console.log('Highest temp reading: ' + highestReading.celcius);

      // does the lowest temperature violate the contract?
      if (lowestReading.celcius < contract.minTemperature) {
		order.ediblityStatus = "NO";
        order.status = "REJECTED_BY_RETAILER";
        console.log('Temperature lower than recommended!');
      }

      // does the highest temperature violate the contract?
      if (highestReading.celcius > contract.maxTemperature) {
		order.ediblityStatus = "NO";
        order.status = "REJECTED_BY_RETAILER";
        console.log('Temperature higher than recommended!');
      }
    }
  
    // update the state of the order
    // const orderRegistry = await getAssetRegistry('org.birthvenue.scm.Order');
    // await orderRegistry.update(order);

    return getAssetRegistry(NS + '.Order')
        .then(function (orderRegistry) {
            // add the temp reading to the order
            return orderRegistry.update(order);
        });
  
}

/**
 * The order has reached store location. Store Owner updates the order in the ledger
 * @param {org.birthvenue.scm.OrderReceivedByStore} orderReceivedByStore - the orderReceivedByStore trnstn
 * @transaction
 */
function updateOrderAtStoreLocation(orderReceivedByStore) {
  
  	var contract = orderReceivedByStore.order.contract;
    var order = orderReceivedByStore.order;
    var NS = 'org.birthvenue.scm';
    //let payOut = contract.unitPrice * order.unitCount;

    console.log('Received at: ' + orderReceivedByStore.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the order
    order.status = 'ACCEPTED_BY_STORE';

    // find the lowest temperature reading
    if (order.temperatureReadings) {
      // sort the temperatureReadings by celcius
      order.temperatureReadings.sort(function (a, b) {
        return (a.celcius - b.celcius);
      });
      var lowestReading = order.temperatureReadings[0];
      var highestReading = order.temperatureReadings[order.temperatureReadings.length - 1];
      console.log('Lowest temp reading: ' + lowestReading.celcius);
      console.log('Highest temp reading: ' + highestReading.celcius);

      // does the lowest temperature violate the contract?
      if (lowestReading.celcius < contract.minTemperature) {
        order.ediblityStatus = "NO";
        order.status = "REJECTED_BY_STORE";
        console.log('Temperature lower than recommended!');
      }

      // does the highest temperature violate the contract?
      if (highestReading.celcius > contract.maxTemperature) {
		order.ediblityStatus = "NO";
        order.status = "REJECTED_BY_STORE";
        console.log('Temperature higher than recommended!');
      }
    }
  
    // update the state of the order
    // const orderRegistry = await getAssetRegistry('org.birthvenue.scm.Order');
    // await orderRegistry.update(order);

    return getAssetRegistry(NS + '.Order')
        .then(function (orderRegistry) {
            // add the temp reading to the order
            return orderRegistry.update(order);
        });
  
}

/**
 * A temperature reading has been received for an order
 * @param {org.birthvenue.scm.OrderScannedByCustomer} orderScannedByCustomer - the OrderScannedByCustomer trnstn
 * @transaction
 */
function scanOrder(orderScannedByCustomer) {
  
  	var contract = orderScannedByCustomer.order.contract;
    var order = orderScannedByCustomer.order;
    var NS = 'org.birthvenue.scm';

    console.log('Received at: ' + orderScannedByCustomer.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

  	order.temperatureReadings.sort(function (a, b) {
        return (a.celcius - b.celcius);
      });
    var lowestReading = order.temperatureReadings[0];
    var highestReading = order.temperatureReadings[order.temperatureReadings.length - 1];
  
  	if(order.ediblityStatus == "NO" 
       || lowestReading.celcius < contract.minTemperature
       || highestReading.celcius > contract.maxTemperature) {
      	console.log("Unsafe for purchase.");
    	order.status = "REJECTED_BY_CUSTOMER"; 
      	order.ediblityStatus = "NO";
    }else {
      	console.log("Safe for purchase.");
     	order.status = "ACCEPTED_BY_CUSTOMER"; 
    }
  
    // update the state of the order
    // const orderRegistry = await getAssetRegistry('org.birthvenue.scm.Order');
    // await orderRegistry.update(order);

    return getAssetRegistry(NS + '.Order')
        .then(function (orderRegistry) {
            // add the temp reading to the order
            return orderRegistry.update(order);
        });
  
}

/**
 * Initialize assets and participants useful for running a demo.
 * @param {org.birthvenue.scm.InititalizeParticipants} initializeParticipants - the SetupDemo transaction
 * @transaction
 */
function setupDemo(initializeParticipants) {  // eslint-disable-line no-unused-vars

    var factory = getFactory();
    var NS = 'org.birthvenue.scm';

    // create the manufacturer
    var manufacturer = factory.newResource(NS, 'Manufacturer', 'manufacturer@birthvenue.com');
    manufacturer.name = "Manufacturer";
    var manufacturerAddress = factory.newConcept(NS, 'Address');
    manufacturerAddress.city = 'Pune';
    manufacturer.address = manufacturerAddress;

    // create the logistics company
    var logisticsCompany = factory.newResource(NS, 'LogisticsCompany', '3plogistics@birthvenue.com');
  	logisticsCompany.name = "3PL";
    var logisticsCompanyAddress = factory.newConcept(NS, 'Address');
    logisticsCompanyAddress.city = 'Pune';
    logisticsCompany.address = logisticsCompanyAddress;

    // create the retailer
    var retailer = factory.newResource(NS, 'Retailer', 'retailer@birthvenue.com');
  	retailer.name = "Retailer";
    var retailerAddress = factory.newConcept(NS, 'Address');
    retailerAddress.city = 'Bengaluru';
    retailer.address = retailerAddress;

    // create the store
    var store = factory.newResource(NS, 'Store', 'store@birthvenue.com');
  	store.name = "Store";
    var storeAddress = factory.newConcept(NS, 'Address');
    storeAddress.city = 'Bengaluru';
    store.address = storeAddress;

    // create the contract
    var contract = factory.newResource(NS, 'Contract', 'CON_001');
    contract.manufacturer = factory.newRelationship(NS, 'Manufacturer', 'manufacturer@birthvenue.com');
    contract.logisticsCompany = factory.newRelationship(NS, 'LogisticsCompany', '3plogistics@birthvenue.com');
    contract.retailer = factory.newRelationship(NS, 'Retailer', 'retailer@birthvenue.com');
    contract.store = factory.newRelationship(NS, 'Store', 'store@birthvenue.com');
    
  	var tomorrow = initializeParticipants.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the order has to arrive tomorrow
    contract.unitPrice = 100; // pay 100 cents per unit
    contract.minTemperature = 2; // min temperature for the order
    contract.maxTemperature = 10; // max temperature for the order

    // create the order
    var order = factory.newResource(NS, 'Order', 'ORDER_001');
    order.type = 'CHICKEN';
    order.status = 'AT_COMPANY';
    order.contract = factory.newRelationship(NS, 'Contract', 'CON_001');
    order.ediblityStatus = "YES";

    return getParticipantRegistry(NS + '.Manufacturer')
        .then(function (manufacturerRegistry) {
            // add the manufacturer
            return manufacturerRegistry.addAll([manufacturer]);
        })
        .then(function() {
            return getParticipantRegistry(NS + '.LogisticsCompany');
        })
        .then(function(logisticsRegistry) {
            // add the logistics company
            return logisticsRegistry.addAll([logisticsCompany]);
        })
        .then(function() {
            return getParticipantRegistry(NS + '.Retailer');
        })
        .then(function(retailerRegistry) {
            // add the shippers
            return retailerRegistry.addAll([retailer]);
        })
        .then(function() {
            return getParticipantRegistry(NS + '.Store');
        })
        .then(function(storeRegistry) {
            // add the store
            return storeRegistry.addAll([store]);
        })
        .then(function() {
          return getAssetRegistry(NS + '.Contract');
        })
        .then(function(contractRegistry) {
            // add the contracts
            return contractRegistry.addAll([contract]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Order');
        })
        .then(function(orderRegistry) {
            // add the order
            return orderRegistry.addAll([order]);
        });
}