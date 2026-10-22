package com.priyadarshini.user_service.service;
import com.priyadarshini.user_service.entity.Admin;
import com.priyadarshini.user_service.entity.User;
import com.priyadarshini.user_service.repository.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private AdminRepo repo;

    public boolean validateAdmin(String email, String password) {
        Admin admin = repo.findByEmail(email);
        if (admin == null) {
            return false;
        }
        return admin.getPassword().equals(password);
    }
}
