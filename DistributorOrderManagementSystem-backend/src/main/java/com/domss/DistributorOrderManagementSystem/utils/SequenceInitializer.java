package com.domss.DistributorOrderManagementSystem.utils;

import jakarta.annotation.PostConstruct;
import org.hibernate.annotations.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SequenceInitializer {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    private static final List<String> TABLES = List.of(
            "distributor_master", "executive_master", "godown_master", "ledger_master",
            "product_master", "region_master", "unit_master", "voucher_type_master",
            "voucher_type_create" );

    @PostConstruct
    public void init(){
        for (String table : TABLES){
            updateAutoIncrementation(table);
        }
    }

    private void updateAutoIncrementation(String tableName) {
        try {
            String sql = "SELECT MAX(id) FROM " + tableName;
            Integer maxId = jdbcTemplate.queryForObject(sql, Integer.class);
            if (maxId != null){
                int nextId = maxId + 1;
                String alterQuery = "ALTER TABLE " + tableName + " AUTO_INCREMENT = " + nextId;
                jdbcTemplate.execute(alterQuery);
            }

        } catch (Exception e){
            System.err.println("Error updating auto-increment " + tableName + ": "+ e.getMessage());
        }

    }


}
