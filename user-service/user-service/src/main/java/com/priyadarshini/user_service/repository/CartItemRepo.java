package com.priyadarshini.user_service.repository;

import com.priyadarshini.user_service.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepo extends JpaRepository<CartItem, Long> {
}
