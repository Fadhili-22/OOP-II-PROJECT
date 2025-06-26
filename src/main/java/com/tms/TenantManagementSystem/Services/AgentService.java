package com.tms.TenantManagementSystem.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tms.TenantManagementSystem.Models.Agent;
import com.tms.TenantManagementSystem.Repositories.AgentRepository;

@Service
public class AgentService {
    @Autowired
    private AgentRepository agentRepository;

    public List<Agent> getAllAgents() {
        return agentRepository.findAll();
    }

    public Agent getAgentById(int id) {
        return agentRepository.findById(id).orElse(null);
    }

    public Agent createAgent(Agent agent) {
        return agentRepository.save(agent);
    }

    public Agent updateAgent(int id, Agent agent) {
        agent.setId(id);
        return agentRepository.save(agent);
    }

    public void deleteAgent(int id) {
        agentRepository.deleteById(id);
    }
}
