package com.priyadarshini.user_service.controller;

import com.priyadarshini.user_service.entity.Products;
import com.priyadarshini.user_service.entity.Wishlist;
import com.priyadarshini.user_service.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/userwishlist/{userId}")
    public ResponseEntity<Wishlist> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlistByUserId(userId));
    }
    @GetMapping("/userwishlistproducts/{userId}")
    public ResponseEntity<List<Products>> getUserWishlist(@PathVariable Long userId) {
        List<Products> products = wishlistService.getWishlistProductsByUserId(userId);
        return ResponseEntity.ok(products);
    }
    @PostMapping("/addwishlist/{userId}/{productId}")
    public ResponseEntity<?> addItemToWishlist(@PathVariable Long userId,
                                               @PathVariable Long productId) {
        try {
            Wishlist wishlist = wishlistService.addItemToWishlist(userId, productId);
            return new ResponseEntity<>(wishlist, HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/removefromwishlist/{userId}/{productId}")
    public ResponseEntity<List<Products>> removeItem(@PathVariable Long userId, @PathVariable Long productId) {
        List<Products> updatedProducts = wishlistService.removeItemFromWishlist(userId, productId);
        return ResponseEntity.ok(updatedProducts);
    }

}