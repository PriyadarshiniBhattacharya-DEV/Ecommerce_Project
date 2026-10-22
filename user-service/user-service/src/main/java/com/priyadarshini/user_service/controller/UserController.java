package com.priyadarshini.user_service.controller;
import com.priyadarshini.user_service.dto.LoginRequest;
import com.priyadarshini.user_service.entity.User;
import com.priyadarshini.user_service.repository.UserRepo;
import com.priyadarshini.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping ("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService service;
    @PostMapping("/signup")
    public ResponseEntity<?> createUser(@RequestBody User user){

        String email= user.getEmail();
        User existingUser = service.searchUserByEmail(email);
        if(existingUser != null){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT) // 409 Conflict is standard for duplicate resources
                    .body(Map.of("message", "Email is already registered!"));
        }
        else {
            User savedUser = service.addUser(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        }

    }
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> userLogin(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        boolean valid = service.validateUser(email, password);

        Map<String, Object> response = new HashMap<>();

        if (!valid) {
            response.put("message", "INVALID CREDENTIALS");
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        User userObj = service.searchUserByEmail(email);

        // Nullify password before returning object to frontend
        if (userObj != null) {
            userObj.setPassword(null);
        }

        response.put("user", userObj);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users= service.getAll();
        return ResponseEntity.ok(users);
    }
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user){
        User updateUserDetails= service.updateUser(id, user);
        return ResponseEntity.ok(updateUserDetails);

    }
    @PutMapping("/updateAddressBook/{userId}")
    public ResponseEntity<User> updateUserAddressBook(
            @PathVariable Long userId,
            @RequestBody String newAddress) {
        try {
            User updatedUser = service.addAddressToUser(userId, newAddress);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/getAddressBook/{userId}")
    public ResponseEntity<List<String>> getUserAddressBook(@PathVariable Long userId) {
        try {
            List<String> addresses = service.getUserAddresses(userId);
            return ResponseEntity.ok(addresses);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deleteAddress/{userId}/{index}")
    public ResponseEntity<User> deleteAddress(
            @PathVariable Long userId,
            @PathVariable int index) {
        try {
            User updatedUser = service.removeAddressByIndex(userId, index);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
         service.deleteUser(id);
         return ResponseEntity.ok("User deleted successfully");
    }
    /*@GetMapping("/searchUser")
    public ResponseEntity<List<User>> findUserByName(@RequestParam String name){
        List<User> users=service.searchUserByName(name);
        return ResponseEntity.ok(users);
    }*/
    @GetMapping("/searchUser")
    public ResponseEntity<List<User>> searchUsers(@RequestParam(required = false) String searchTerm) {
        List<User> results=service.searchUsers(searchTerm);
        return ResponseEntity.ok(results);
    }
}
