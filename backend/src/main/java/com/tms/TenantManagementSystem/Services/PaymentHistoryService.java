package com.tms.TenantManagementSystem.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tms.TenantManagementSystem.Models.paymentHistory;
import com.tms.TenantManagementSystem.Repositories.PaymentHistoryRepository;

import java.util.List;

@Service
public class PaymentHistoryService {

    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;

    public List<paymentHistory> getAllHistories() {
        return paymentHistoryRepository.findAll();
    }

    public paymentHistory getHistoryByTenantId(int tenantId) {
        return paymentHistoryRepository.findById(tenantId).orElse(null);
    }

    public paymentHistory createHistory(paymentHistory history) {
        return paymentHistoryRepository.save(history);
    }

    public void deleteHistory(int tenantId) {
        paymentHistoryRepository.deleteById(tenantId);
    }
}
