package com.smartparking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle")
@Data
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plate_number", nullable = false, length = 20)
    private String plateNumber;           // 车牌号

    @Column(name = "entry_time")
    private LocalDateTime entryTime;      // 入场时间

    @Column(name = "exit_time")
    private LocalDateTime exitTime;       // 出场时间

    @Column(name = "status", length = 20)
    private String status = "PARKING";    // 状态: PARKING, EXITED

    @Column(name = "spot_number", length = 10)
    private String spotNumber;            // 车位号

    @Column(name = "created_at")
    private LocalDateTime createdAt;      // 创建时间

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;      // 更新时间

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (entryTime == null) {
            entryTime = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
