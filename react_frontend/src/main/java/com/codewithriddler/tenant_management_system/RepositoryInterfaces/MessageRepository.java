package com.codewithriddler.tenant_management_system.RepositoryInterfaces;

import com.codewithriddler.tenant_management_system.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderId(Long senderId);
    List<Message> findByReceiverId(Long receiverId);

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.id = :user1Id AND m.receiver.id = :user2Id) OR " +
            "(m.sender.id = :user2Id AND m.receiver.id = :user1Id) " +
            "ORDER BY m.timestamp")
    List<Message> findConversation(@Param("user1Id") Long user1Id,
                                   @Param("user2Id") Long user2Id);

    List<Message> findByPropertyId(Long propertyId);


    List<Message> findByTenantId(Long tenantId);
}