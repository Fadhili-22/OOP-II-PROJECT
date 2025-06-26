package com.tms.TenantManagementSystem.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tms.TenantManagementSystem.Models.paymentHistory;
import com.tms.TenantManagementSystem.Services.PaymentHistoryService;

@RestController
@RequestMapping("/api/paymentHistories")
public class PaymentHistoryController {

    @Autowired
    private PaymentHistoryService paymentHistoryService;

    @GetMapping
    public List<paymentHistory> getAllHistories() {
        return paymentHistoryService.getAllHistories();
    }

    @GetMapping("/{tenantId}")
    public paymentHistory getHistoryByTenantId(@PathVariable int tenantId) {
        return paymentHistoryService.getHistoryByTenantId(tenantId);
    }

    @PostMapping
    public paymentHistory createHistory(@RequestBody paymentHistory history) {
        return paymentHistoryService.createHistory(history);
    }

    @DeleteMapping("/{tenantId}")
    public void deleteHistory(@PathVariable int tenantId) {
        paymentHistoryService.deleteHistory(tenantId);
    }
}
