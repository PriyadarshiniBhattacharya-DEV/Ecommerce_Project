package com.priyadarshini.user_service.repository;

import com.priyadarshini.user_service.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepo extends JpaRepository<Wishlist, Long> {
    Wishlist findByUserId(Long userId);
}
