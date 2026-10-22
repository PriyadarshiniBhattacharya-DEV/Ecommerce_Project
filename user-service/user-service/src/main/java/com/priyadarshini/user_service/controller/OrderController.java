package com.priyadarshini.user_service.controller;

import com.priyadarshini.user_service.entity.Order;
import com.priyadarshini.user_service.entity.OrderItem;
import com.priyadarshini.user_service.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping ("/api/order")
@CrossOrigin(origins = "http://localhost:5173")

public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/addorders/{userId}")
    public ResponseEntity<Order> createOrder(@PathVariable Long userId, @RequestBody String shippingAddress){
        Order newOrder= orderService.createOrderFromCart(userId, shippingAddress);
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }
    @GetMapping("/getorders")
    public ResponseEntity<List<Order>> getAllOrder(){
        List<Order> orders=orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    @GetMapping("/getorders/{userid}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userid){
        List<Order> orders=orderService.getOrdersByUserId(userid);
        return ResponseEntity.ok(orders);
    }
    @GetMapping("/getorder/{id}")
    public ResponseEntity<Order> getOrderByID(@PathVariable Long id){
        Order order=orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/updateorderstatus/{orderId}")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> requestBody) {
        String newStatus = requestBody.get("status");
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, newStatus));
    }
    @PutMapping("/updateorderitemstatus/{itemId}")
    public ResponseEntity<OrderItem> updateOrderItemStatus(
            @PathVariable Long itemId,
            @RequestBody Map<String, String> requestBody) {
        String newStatus = requestBody.get("status");
        return ResponseEntity.ok(orderService.updateOrderItemStatus(itemId, newStatus));
    }
    @PutMapping("/returnorderitem/{itemId}")
    public ResponseEntity<OrderItem> submitReturnRequestForOrderItem(
            @PathVariable Long itemId,
            @RequestParam("reason") String reason,
            @RequestParam("details") String details,
            @RequestParam(value = "photos", required = false) List<MultipartFile> images) throws IOException {

        return ResponseEntity.ok(orderService.requestReturnForOrderItem(itemId, reason, details, images));
    }
    @PutMapping("/cancelreturn/{itemId}")
    public ResponseEntity<OrderItem> cancelReturnRequestForOrderItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(orderService.cancelReturnRequestForOrderItem(itemId));
    }

    @GetMapping("/getReturnRequest/{itemId}")
    public ResponseEntity<Map<String, String>> fetchReturnRequest(@PathVariable Long itemId){
        Map<String, String> requestMap = orderService.fetchReturnRequestMap(itemId);
        return ResponseEntity.ok(requestMap);
    }
}
