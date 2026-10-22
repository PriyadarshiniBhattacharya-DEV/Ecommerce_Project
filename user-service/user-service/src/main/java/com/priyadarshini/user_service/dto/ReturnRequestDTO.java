package com.priyadarshini.user_service.dto;

import java.util.List;

public class ReturnRequestDTO {
    public class ReturnRequestDto {
        private String reason;
        private String details;
        private List<String> images; // List of base64 strings or URLs

        // Getters and Setters
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }

        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }

        public List<String> getImages() { return images; }
        public void setImages(List<String> images) { this.images = images; }
    }
}
