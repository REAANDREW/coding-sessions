var uuid = require('node-uuid');
var eventEmitter = require('events').EventEmitter;
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var request = require('request');

var events = {
  orderPlaced : 'OrderPlaced'
}

function url(path){
  return `http://localhost:${port}${path}`;
}

class EventStream{
  constructor(){
    this.events = [];
  } 

  add(evt){
    this.events.push(evt); 
  }

  list(offset, count, filter){
    if(offset === null || offset === undefined){
      offset = 0;
    }
    if(count === null || count === undefined){
      count = 10;
    }

    var events = this.events;

    if(filter !== undefined){
      events = _.filter(this.events, filter);
    }

    if(offset < 0){
      events = _.takeRight(events, count);
    }else{
      events = _.slice(events, offset, count);
    }

    return {
      offset : offset,
      count : count,
      filter : filter,
      events : events
    };
  }
}

class EventStreamSubscriber{
  constructor(url){
    this.count = 10;
    this.nextOffset = 0;
    this.interval = 1000;
    this.url = url; 
    this.timeout = null;
    this.delegates = {};
  }

  on(eventName, delegate){
    if(this.delegates[eventName] === undefined){
      this.delegates[eventName] = [];
    }
    this.delegates[eventName].push(delegate);
  }

  getEvents(){
    var context = this;

    var options = {
      uri: this.url+'?count='+this.count+'&offset='+this.nextOffset,
      method: 'GET',
      json: true
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        body.events.forEach(function(evt){
          if(context.delegates[evt.eventName] !== undefined){
            context.delegates[evt.eventName].forEach(function(delegate){
              delegate(evt);
            });
          }
        });
        context.nextOffset += body.events.length;
      }
      context.timeout = setTimeout(function(){
        context.getEvents();
      },context.interval); 
    });
  }

  start(){
    var context = this;
    this.timeout = setTimeout(function(){
      context.getEvents();
    }, this.interval); 
  }
}

class OrderService{
  constructor(proxy){
    this.proxy = proxy;
    this.orders = {};
    this.eventStream = new EventStream();
    this.eventHandlers = {};
  }

  placeOrder(order, callback){
    order.id = uuid.v4(); 
    this.orders[order.id] = order;
    this.eventStream.add(_.merge({},{eventName:events.orderPlaced}, order));
    callback(undefined,order.id);
  } 

  handleOrderPlaced(order, callback){
    //Call to the payment service
  }

  get(orderId, callback){
    var order = this.orders[orderId];
    this.eventsForId(0,100, orderId, function(err, events){
      order.events = events;
      callback(undefined, order);
    });
  }

  eventsForId(offset, count, id, callback){
    callback(undefined, this.eventStream.list(offset, count, {id:id}));
  }

  events(offset, count, callback){
    callback(undefined, this.eventStream.list(offset, count));
  }
}

var port = 9000;
var orderService = new OrderService();

var app = express();
app.use(bodyParser.json()); 

app.post('/orders', function(req, res){
  orderService.placeOrder(req.body, function(err, orderId){
    res.status(202).json({url:`http://localhost:${port}/orders/${orderId}`});
  });    
});

app.get('/orders/events', function(req,res){
  var offset = req.query.offset;
  var count = req.query.count;
  orderService.events(offset, count, function(err, events){
    res.status(200).json(events);
  });
});

app.get('/orders/events/earliest', function(req,res){
  var count = req.query.count;
  orderService.get(req.params.id, function(err, order){
    orderService.events(0,count, function(err, events){
      res.status(200).json(events);
    });
  });    
});

app.get('/orders/events/latest', function(req,res){
  var count = req.query.count;
  orderService.events(-1,count, function(err, events){
    res.status(200).json(events);
  });
});

app.get('/orders/:id', function(req, res){
  orderService.get(req.params.id, function(err, order){
    orderService.eventsForId(0,100, order.id, function(err, events){
      res.status(202).json(events);
    });
  });    
});

var eventService = new EventStreamSubscriber(`http://localhost:${port}/orders/events`);
eventService.start();
eventService.on('OrderPlaced', function(evt){
  console.log('GOT IT', evt);
})
app.listen(port);

/*
 * Commands and Events
 *
 * ShopFront->OrderService: RaiseOrderCommand               -> OrderRaisedEvent
 *
 * OrderService->PaymentService: TakePaymentCommand         -> PaymentReceivedEvent
 *                                                          -> PaymentDeclinedEvent
 * OrderService->InventoryService: UpdateInventoryCommand   -> InventoryUpdatedEvent
 *                                                          -> InventoryOutOfStockEvent
 * OrderService->WarehouseService: PickOrderCommand         -> OrderPickedEvent
 * WareHouseService->PackingService: PackOrderCommand       -> OrderPackedEvent
 * PackingService->DispatchService: DeliverOrderCommand     -> OrderReadyForDispatchEvent
 *                                                          -> OrderDispatchedEvent
 *                                                          -> OrderDeliveredEvent
 * */

