package com.codewithriddler.tenant_management_system.ServiceLayer;

import com.codewithriddler.tenant_management_system.Entity.Message;
import com.codewithriddler.tenant_management_system.RepositoryInterfaces.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;

    // Create or send a message
    public Message createMessage(Message message) {
        return messageRepository.save(message);
    }

    // Alias for createMessage, if you want semantic clarity
    public Message sendMessage(Message message) {
        return createMessage(message);
    }

    // Get messages sent by a sender
    public List<Message> getMessagesBySender(Long senderId) {
        return messageRepository.findBySenderId(senderId);
    }

    // Get messages received by a receiver
    public List<Message> getMessagesByReceiver(Long receiverId) {
        return messageRepository.findByReceiverId(receiverId);
    }

    // Get conversation (messages) between two users
    public List<Message> getConversation(Long user1Id, Long user2Id) {
        return messageRepository.findConversation(user1Id, user2Id);
    }

    // You need to implement these repository methods or define appropriate queries
    public List<Message> getMessagesByTenant(Long tenantId) {
        // Assuming tenantId is either sender or receiver in messages
        return messageRepository.findByTenantId(tenantId);
    }

    public List<Message> getMessagesByProperty(Long propertyId) {
        return messageRepository.findByPropertyId(propertyId);
    }

    // Update message by ID
    public Message updateMessage(Long id, Message message) {
        Optional<Message> existingMessageOpt = messageRepository.findById(id);
        if (existingMessageOpt.isPresent()) {
            Message existingMessage = existingMessageOpt.get();
            // Update fields — example: content and timestamp
            existingMessage.setContent(message.getContent());
            existingMessage.setTimestamp(message.getTimestamp());
            // Add other fields as needed
            return messageRepository.save(existingMessage);
        } else {
            // Or throw exception if message not found
            throw new RuntimeException("Message not found with id " + id);
        }
    }

    // Delete message by ID
    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }
}
