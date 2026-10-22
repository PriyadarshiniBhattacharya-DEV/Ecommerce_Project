package com.priyadarshini.user_service.service;

import com.priyadarshini.user_service.dto.ReturnRequestDTO;
import com.priyadarshini.user_service.entity.Cart;
import com.priyadarshini.user_service.entity.Order;
import com.priyadarshini.user_service.entity.OrderItem;
import com.priyadarshini.user_service.entity.User;
import com.priyadarshini.user_service.repository.OrderItemRepo;
import com.priyadarshini.user_service.repository.OrderRepo;
import com.priyadarshini.user_service.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private OrderItemRepo orderItemRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CartService cartService;


    public Order createOrderFromCart(Long userId, String shippingAddress) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Cart cart = cartService.getCartByUserId(userId);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot place order: Cart is empty!");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);
        order.setOrderStatus("ORDER PLACED");
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        double totalValue = cart.getCartTotal();

        for (var cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setImage(cartItem.getImage());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getTotalPrice());
            orderItem.setStatus("ORDER PLACED");
            orderItem.setOrder(order);
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalValue(totalValue);

        // Save order and clear user's cart
        Order savedOrder = orderRepo.save(order);
        cartService.clearCart(userId);

        return savedOrder;
    }

    public List<Order> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepo.findByUserIdOrderByOrderDateDesc(userId);

        if (orders.isEmpty()) {
            return Collections.emptyList(); // or new ArrayList<OrderDTO>() depending on your mapping logic
        }
        return orders;
    }

    public Order getOrderById(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public OrderItem getOrderItemById(Long id) {
        return orderItemRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order item not found with id: " + id));
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAllByOrderByOrderDateDesc();
    }

    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = getOrderById(orderId);
        order.setOrderStatus(newStatus.toUpperCase());
        return orderRepo.save(order);
    }
    public OrderItem updateOrderItemStatus(Long itemId, String newStatus) {
        OrderItem item = getOrderItemById(itemId);
        item.setStatus(newStatus.toUpperCase());
        return orderItemRepo.save(item);
    }
    public OrderItem requestReturnForOrderItem(Long itemId, String reason, String details, List<MultipartFile> images) throws IOException {
        // 1. Fetch the existing order item
        OrderItem item = orderItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Order item not found with id: " + itemId));

        // 2. Update status and return-related fields
        item.setStatus("RETURN REQUESTED");
        item.setReturnReason(reason);
        item.setReturnDetails(details);
        item.setReturnRequestDate(LocalDateTime.now());
        if (images != null && !images.isEmpty()) {
            List<String> base64Images = new ArrayList<>();

            for (MultipartFile file : images) {
                if (file != null && !file.isEmpty()) {
                    String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                    base64Images.add(base64Image);
                }
            }
            item.setReturnImages(String.join(",", base64Images));
        }
        return orderItemRepo.save(item);
    }

    public OrderItem cancelReturnRequestForOrderItem(Long itemId) {

        OrderItem item = orderItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Order item not found with id: " + itemId));

        if (!"RETURN REQUESTED".equals(item.getStatus())) {
            throw new RuntimeException("Cannot cancel return request once it is already being processed or approved.");
        }
        item.setStatus("DELIVERED");

        // 4. Clear out return-specific fields back to null
        item.setReturnReason(null);
        item.setReturnDetails(null);
        item.setReturnImages(null);

        // 5. Save and return the updated item
        return orderItemRepo.save(item);
    }
    public Map<String,String> fetchReturnRequestMap(Long itemId){
        OrderItem item = getOrderItemById(itemId);
        String reason = item.getReturnReason();
        String details = item.getReturnDetails();
        String images = item.getReturnImages();
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("reason", reason);
        requestMap.put("details", details);
        requestMap.put("photos",images);
        return requestMap;
    }

}