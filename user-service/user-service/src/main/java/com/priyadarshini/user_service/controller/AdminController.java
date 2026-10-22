package com.priyadarshini.user_service.controller;

import com.priyadarshini.user_service.entity.Admin;
import com.priyadarshini.user_service.entity.User;
import com.priyadarshini.user_service.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping ("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")

public class AdminController {

    @Autowired
    private AdminService service;
    @PostMapping("/adminlogin")
    public ResponseEntity<?> adminLogin(@RequestBody Admin admin ){
        String email = admin.getEmail();
        String password = admin.getPassword();
        boolean valid = service.validateAdmin(email,password);
        Map<String, Object> response = new HashMap<>();
        if (!valid) {
            response.put("message", "INVALID CREDENTIALS");
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
        response.put("message", "ADMIN LOGIN SUCCESSFUL");
        return ResponseEntity.ok(response);
    }



}
