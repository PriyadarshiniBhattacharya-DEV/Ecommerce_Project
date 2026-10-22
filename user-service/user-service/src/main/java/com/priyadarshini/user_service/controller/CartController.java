package com.priyadarshini.user_service.controller;
import com.priyadarshini.user_service.entity.Cart;
import com.priyadarshini.user_service.entity.CartItem;
import com.priyadarshini.user_service.entity.Products;
import com.priyadarshini.user_service.entity.Wishlist;
import com.priyadarshini.user_service.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/usercartitems/{userId}")
    public ResponseEntity<List<CartItem>> getAllCartItems(@PathVariable Long userId) {
        List<CartItem> cartItems = cartService.getCartProductsByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }
    @GetMapping("/usercartitems/gettotal/{userId}")
    public ResponseEntity<Double> getCartTotal(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        Double total = (cart != null && cart.getCartTotal() != null) ? cart.getCartTotal() : 0.0;
        return ResponseEntity.ok(total);
    }
    @GetMapping("/usercart/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @GetMapping("/usercartitem/{userId}/{productId}")
    public ResponseEntity<CartItem> getCartItem(@PathVariable Long userId, @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.getCartProductById(userId, productId));
    }

    // Add item to cart
    @PostMapping("/additemtocart/{userId}/{productId}")
    public ResponseEntity<?> addItemToCart(@PathVariable Long userId,
                                           @PathVariable Long productId) {
        try {
            Cart cart = cartService.addItemToCart(userId, productId);
            return new ResponseEntity<>(cart, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PutMapping("/updatecart/{userId}/{productId}")
    public ResponseEntity<Cart> updateItemQuantity(@PathVariable Long userId,
                                                   @PathVariable Long productId,
                                                   @RequestBody Integer newQuantity)
    {
        Cart updatedCart = cartService.updateCartItemQuantity(userId, productId, newQuantity);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/removecartitem/{userId}/{productId}")
    public ResponseEntity<Cart> removeItem(@PathVariable Long userId, @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(userId, productId));
    }

    @DeleteMapping("/clearcart/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}