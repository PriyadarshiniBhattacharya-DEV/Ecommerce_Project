package com.priyadarshini.user_service.repository;

import com.priyadarshini.user_service.entity.Order;
import com.priyadarshini.user_service.entity.OrderItem;
import com.priyadarshini.user_service.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {
}
