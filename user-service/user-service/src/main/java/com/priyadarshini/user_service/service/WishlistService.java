package com.priyadarshini.user_service.service;

import com.priyadarshini.user_service.entity.*;
import com.priyadarshini.user_service.repository.ProductRepo;
import com.priyadarshini.user_service.repository.UserRepo;
import com.priyadarshini.user_service.repository.WishlistItemRepo;
import com.priyadarshini.user_service.repository.WishlistRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepo wishlistRepo;

    @Autowired
    private WishlistItemRepo wishlistItemRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProductRepo productRepo;


    public Wishlist getWishlistByUserId(Long userId) {
        Wishlist wishlist = wishlistRepo.findByUserId(userId);
        if (wishlist != null) {
            return wishlist;
        }
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Wishlist newWishlist = new Wishlist();
        newWishlist.setUser(user);
        newWishlist.setItems(new ArrayList<>());
        return wishlistRepo.save(newWishlist);
    }
    public List<Products> getWishlistProductsByUserId(Long userId) {
        Wishlist wishlist = wishlistRepo.findByUserId(userId);
        if (wishlist == null || wishlist.getItems() == null || wishlist.getItems().isEmpty()) {
            return Collections.emptyList();
        }

        List<Products> products = wishlist.getItems().stream()
                .map(WishlistItem::getProduct)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        if (products.isEmpty()) {
            return Collections.emptyList();
        }
        return products;
    }

    @Transactional
    public Wishlist addItemToWishlist(Long userId, Long productId) throws IOException {
        Wishlist wishlist = getWishlistByUserId(userId);

        Optional<WishlistItem> existingItem = wishlist.getItems().stream()
                .filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            return wishlist;
        }
        Products product =  productRepo.findById(productId).orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setProduct(product);

        wishlistItem.setWishlist(wishlist);
        wishlist.getItems().add(wishlistItem);

        return wishlistRepo.save(wishlist);
    }

    @Transactional
    public List<Products> removeItemFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getWishlistByUserId(userId);

        if (wishlist != null && wishlist.getItems() != null) {
            // Find the item matching the productId
            WishlistItem itemToRemove = wishlist.getItems().stream()
                    .filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
                    .findFirst()
                    .orElse(null);

            if (itemToRemove != null) {
                wishlist.getItems().remove(itemToRemove);
                wishlistItemRepo.delete(itemToRemove);
                wishlistRepo.save(wishlist);
            }
        }

        // Return the updated list of full Product objects
        return getWishlistProductsByUserId(userId);
    }
}