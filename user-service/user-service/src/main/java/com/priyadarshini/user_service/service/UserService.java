package com.priyadarshini.user_service.service;

import com.priyadarshini.user_service.entity.User;
import com.priyadarshini.user_service.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired

    private UserRepo repo;

    public User addUser(User user){
        return repo.save(user);
    }
    public List<User> getAll(){
        return repo.findAll();
    }
    public User getUserById(long id){
        return repo.findById(id).orElseThrow(()->new RuntimeException("USER DOES NOT EXIST"));
    }
    public boolean validateUser(String email, String password) {
        User user = repo.findByEmail(email);
        if (user == null) {
            return false;
        }
        return user.getPassword().equals(password);
    }
    public User updateUser(Long id, User user){
        User savedUser=repo.findById(id).orElseThrow(()->new RuntimeException("USER DOES NOT EXIST"));
        savedUser.setPassword(user.getPassword());
        return repo.save(savedUser);
    }
    public void deleteUser(Long id) {
        User savedUser = repo.findById(id).orElseThrow(() -> new RuntimeException("USER DOES NOT EXIST"));
        repo.delete(savedUser);
    }
    /*public List<User> searchUserById(Long userId){
        return repo.findById(userId).orElseThrow(()-> new RuntimeException("USER DOESNOT EXIST"));
    }*/

    public List<User> searchUserByName(String name){
        return repo.findByNameContainingIgnoreCase(name);
    }
    public User searchUserByEmail(String email){return repo.findByEmail(email);}
    public List<User> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String searchTerm = query.trim();

        // Check if query is a numeric User ID
        try {
            Long userId = Long.parseLong(searchTerm);
            return repo.findById(userId).map(List::of)
                    .orElse(List.of());
        } catch (NumberFormatException e) {
            // If not a number, search by email only
            return repo.findByEmailContainingIgnoreCase(searchTerm);
        }
    }
    public User addAddressToUser(Long userId, String newAddress) {
        Optional<User> userOptional = repo.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();


            String cleanedAddress = newAddress != null ? newAddress.replaceAll("^\"|\"$", "").trim() : "";
            if (user.getAddress() != null && user.getAddress().contains(cleanedAddress)) {
                return user;
            }
            if (!cleanedAddress.isEmpty()) {
                if(user.getAddress() == null){
                    List<String> addresses = new ArrayList<>();
                    addresses.add(cleanedAddress);
                    user.setAddress(addresses);

                }
                else{
                    user.getAddress().add(cleanedAddress);
                }

                return repo.save(user);
            }
            throw new IllegalArgumentException("Address cannot be empty");
        }

        throw new RuntimeException("User not found with ID: " + userId);
    }
    public List<String> getUserAddresses(Long userId) {
        User user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return user.getAddress();
    }

    public User removeAddressByIndex(Long userId, int index) {
        User user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        List<String> addresses = user.getAddress();
        if (index >= 0 && index < addresses.size()) {
            addresses.remove(index);
            return repo.save(user);
        }
        throw new IndexOutOfBoundsException("Invalid address index");
    }
}
