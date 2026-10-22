package com.priyadarshini.user_service.repository;

import com.priyadarshini.user_service.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistItemRepo extends JpaRepository<WishlistItem, Long> {
}
