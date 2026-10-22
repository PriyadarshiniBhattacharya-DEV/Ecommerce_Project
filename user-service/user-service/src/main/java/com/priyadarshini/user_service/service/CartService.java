package com.priyadarshini.user_service.service;
import com.priyadarshini.user_service.entity.*;
import com.priyadarshini.user_service.repository.CartItemRepo;
import com.priyadarshini.user_service.repository.CartRepo;
import com.priyadarshini.user_service.repository.ProductRepo;
import com.priyadarshini.user_service.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private ProductRepo productRepo;

    public Cart getCartByUserId(Long userId) {
        Cart cart = cartRepo.findByUserId(userId);
        if (cart != null) {
            return cart;
        }
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Cart newCart = new Cart();
        newCart.setUser(user);
        newCart.setItems(new ArrayList<>());
        return cartRepo.save(newCart);
    }
    public List<CartItem> getCartProductsByUserId(Long userId) {
        Cart cart = cartRepo.findByUserId(userId);
        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            return Collections.emptyList();
        }
        return cart.getItems();
    }

    public CartItem getCartProductById(Long userId, Long productId) {
        Cart cart = cartRepo.findByUserId(userId);
        if (cart == null || cart.getItems() == null) {
            return null;
        }

        return cart.getItems().stream()
                .filter(item -> {
                    Long pId = item.getProduct() != null ? item.getProduct().getId() : null;
                    return pId != null && pId.equals(productId);
                })
                .findFirst()
                .orElse(null);
    }

    public Cart addItemToCart(Long userId, Long productId) {
        Cart cart = getCartByUserId(userId);

        // Ensure cart items list is initialized
        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = (item.getQuantity() != null ? item.getQuantity() : 0) + 1;
            item.setQuantity(newQty);

            double unitPrice = item.getPrice() != null ? item.getPrice() : 0.0;
            item.setTotalPrice(unitPrice * newQty);

            cartItemRepo.save(item); // Persist updated item
        } else {
            // Fetch product from DB
            Products product = productRepo.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setPrice(product.getPrice());
            cartItem.setImage(product.getImages());
            cartItem.setQuantity(1);

            double unitPrice = product.getPrice() != null ? product.getPrice() : 0.0;
            cartItem.setTotalPrice(unitPrice);
            cartItem.setCart(cart);

            // Save CartItem directly first to force primary key (cartItemId) generation
            CartItem savedItem = cartItemRepo.save(cartItem);
            cart.getItems().add(savedItem);
        }

        // Recalculate overall Cart total
        double totalCartPrice = cart.getItems().stream()
                .mapToDouble(item -> item.getTotalPrice() != null ? item.getTotalPrice() : 0.0)
                .sum();

        cart.setCartTotal(totalCartPrice); // 👈 Sets the overall cart total

        return cartRepo.save(cart);
    }

    public Cart updateCartItemQuantity(Long userId, Long productId, Integer newQuantity) {
        Cart cart = getCartByUserId(userId);

        if (cart == null) {
            throw new RuntimeException("Cart not found for user ID: " + userId);
        }

        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }

        // Safely find the CartItem by checking both productId and nested product.getId()
        CartItem itemToUpdate = cart.getItems().stream()
                .filter(item -> {
                    Long idToCheck = item.getProduct() != null
                            ? item.getProduct().getId()
                            : null;
                    return idToCheck != null && idToCheck.equals(productId);
                })
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product with ID " + productId + " not found in user's cart"));

        if (newQuantity == null || newQuantity <= 0) {
            // Remove item from list (orphanRemoval = true will automatically delete it from database)
            cart.getItems().remove(itemToUpdate);
        } else {
            // Update quantity and line-item total price
            itemToUpdate.setQuantity(newQuantity);
            double unitPrice = itemToUpdate.getPrice() != null ? itemToUpdate.getPrice() : 0.0;
            itemToUpdate.setTotalPrice(unitPrice * newQuantity);
            cartItemRepo.save(itemToUpdate);
        }

        // Recalculate overall cart total
        double totalCartPrice = cart.getItems().stream()
                .mapToDouble(item -> item.getTotalPrice() != null ? item.getTotalPrice() : 0.0)
                .sum();
        double gst = totalCartPrice * 0.18;
        double deliveryFee = totalCartPrice > 0 ? totalCartPrice * 0.10 : 0;
        double finalCartPrice = totalCartPrice + gst + deliveryFee;
        cart.setCartTotal(finalCartPrice); // Change to cart.setCartTotal(totalCartPrice) if your field name is cartTotal

        return cartRepo.save(cart);
    }
    public Cart removeItemFromCart(Long userId, Long productId) {

        Cart cart = getCartByUserId(userId);

        CartItem itemToRemove = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("CartItem with ID " + productId + " not found in user's cart"));

        cart.getItems().remove(itemToRemove);

        cartItemRepo.delete(itemToRemove);
        Double totalPrice = cart.getItems().stream().mapToDouble(item-> item.getTotalPrice() != null? item.getTotalPrice() : 0.0).sum();
        cart.setCartTotal(totalPrice);
        return cartRepo.save(cart);
    }
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cartRepo.save(cart);
    }
}