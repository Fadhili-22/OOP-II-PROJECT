package com.codewithriddler.tenant_management_system.Controller;

import com.codewithriddler.tenant_management_system.Entity.Message;
import com.codewithriddler.tenant_management_system.ServiceLayer.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // Create a new message
    @PostMapping
    public Message createMessage(@RequestBody Message message) {
        return messageService.createMessage(message);
    }

    // Get messages by tenant ID
    @GetMapping("/tenant/{tenantId}")
    public List<Message> getMessagesByTenant(@PathVariable Long tenantId) {
        return messageService.getMessagesByTenant(tenantId);
    }

    // Get messages by property ID
    @GetMapping("/property/{propertyId}")
    public List<Message> getMessagesByProperty(@PathVariable Long propertyId) {
        return messageService.getMessagesByProperty(propertyId);
    }

    // Update a message by ID
    @PutMapping("/{id}")
    public Message updateMessage(@PathVariable Long id, @RequestBody Message message) {
        return messageService.updateMessage(id, message);
    }

    // Delete a message by ID
    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
    }
}
